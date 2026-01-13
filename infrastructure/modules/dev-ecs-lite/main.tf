terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  tags = var.tags

  cluster_name = "${var.name_prefix}-ecs"
  service_name = "${var.name_prefix}-backend"

  health_port = 80
}

# -----------------------------------------------------------------------------
# Networking (minimal, no NAT)
# -----------------------------------------------------------------------------
resource "aws_vpc" "main" {
  cidr_block           = "10.42.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.tags, { Name = "${var.name_prefix}-vpc" })
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = merge(local.tags, { Name = "${var.name_prefix}-igw" })
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.42.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = merge(local.tags, { Name = "${var.name_prefix}-public" })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = merge(local.tags, { Name = "${var.name_prefix}-public-rt" })
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "backend" {
  name        = "${var.name_prefix}-backend-sg"
  description = "Backend SG"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, { Name = "${var.name_prefix}-backend-sg" })
}

# -----------------------------------------------------------------------------
# Elastic IP
# -----------------------------------------------------------------------------
resource "aws_eip" "backend" {
  domain = "vpc"
  tags   = merge(local.tags, { Name = "${var.name_prefix}-eip" })
}

# -----------------------------------------------------------------------------
# ECS Cluster
# -----------------------------------------------------------------------------
resource "aws_ecs_cluster" "main" {
  name = local.cluster_name
  tags = local.tags
}

# -----------------------------------------------------------------------------
# IAM: EC2 container instance role
# -----------------------------------------------------------------------------
resource "aws_iam_role" "ecs_instance" {
  name = "${var.name_prefix}-ecs-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "ecs_instance_ecs" {
  role       = aws_iam_role.ecs_instance.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_role_policy_attachment" "ecs_instance_ssm" {
  role       = aws_iam_role.ecs_instance.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ecs_instance" {
  name = "${var.name_prefix}-ecs-instance-profile"
  role = aws_iam_role.ecs_instance.name
}

# -----------------------------------------------------------------------------
# EC2: ECS Optimized AMI + instance
# -----------------------------------------------------------------------------
data "aws_ami" "ecs_al2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }
}

resource "aws_instance" "ecs" {
  ami                    = data.aws_ami.ecs_al2.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.backend.id]

  iam_instance_profile = aws_iam_instance_profile.ecs_instance.name

  user_data = <<-EOF
              #!/bin/bash
              set -e
              echo "ECS_CLUSTER=${aws_ecs_cluster.main.name}" >> /etc/ecs/ecs.config
              systemctl enable --now ecs
              EOF

  tags = merge(local.tags, { Name = "${var.name_prefix}-ecs" })
}

resource "aws_eip_association" "backend" {
  instance_id   = aws_instance.ecs.id
  allocation_id = aws_eip.backend.id
}

# -----------------------------------------------------------------------------
# ECS Task Definition + Service
# Placeholder backend container (replace with Magento stack later)
# -----------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.name_prefix}/backend"
  retention_in_days = 7
  tags              = local.tags
}

resource "aws_iam_role" "task_execution" {
  name = "${var.name_prefix}-task-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "task_execution" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.name_prefix}-backend"
  requires_compatibilities = ["EC2"]
  # For EC2 launch type, use bridge networking and expose via the instance's Elastic IP.
  # (assign_public_ip is not supported for EC2 launch type services)
  network_mode             = "bridge"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "hashicorp/http-echo:1.0.0"
      essential = true
      command   = ["-listen=:80", "-text=ok", "-status-code=200"]
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.backend.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "backend"
        }
      }
    }
  ])

  tags = local.tags
}

resource "aws_ecs_service" "backend" {
  name            = local.service_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 0

  launch_type = "EC2"

  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent         = 100

  tags = local.tags
}

# -----------------------------------------------------------------------------
# DynamoDB: idle tracking
# -----------------------------------------------------------------------------
resource "aws_dynamodb_table" "idle" {
  name         = "${var.name_prefix}-idle"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = local.tags
}

# -----------------------------------------------------------------------------
# Lambda + API Gateway: wake/status/touch + GraphQL proxy
# -----------------------------------------------------------------------------
resource "aws_iam_role" "dev_lambda" {
  name = "${var.name_prefix}-dev-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "dev_lambda_basic" {
  role       = aws_iam_role.dev_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "dev_lambda_policy" {
  name = "${var.name_prefix}-dev-lambda-policy"
  role = aws_iam_role.dev_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeInstances",
          "ec2:StartInstances",
          "ec2:StopInstances"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecs:DescribeServices",
          "ecs:UpdateService"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem"
        ]
        Resource = aws_dynamodb_table.idle.arn
      }
    ]
  })
}

# Package lambda code

data "archive_file" "dev_api_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/dev_api.py"
  output_path = "${path.module}/lambda/dev_api.zip"
}

resource "aws_lambda_function" "dev_api" {
  function_name = "${var.name_prefix}-dev-api"
  role          = aws_iam_role.dev_lambda.arn
  runtime       = "python3.11"
  handler       = "dev_api.lambda_handler"

  filename         = data.archive_file.dev_api_zip.output_path
  source_code_hash = data.archive_file.dev_api_zip.output_base64sha256

  timeout     = 30
  memory_size = 256

  environment {
    variables = {
      EC2_INSTANCE_ID     = aws_instance.ecs.id
      ECS_CLUSTER_ARN     = aws_ecs_cluster.main.arn
      ECS_SERVICE_NAME    = aws_ecs_service.backend.name
      DDB_TABLE_NAME      = aws_dynamodb_table.idle.name
      IDLE_TIMEOUT_SEC    = tostring(var.idle_timeout_seconds)
      ELASTIC_IP          = aws_eip.backend.public_ip
      WAKE_USER           = var.wake_username
      WAKE_PASS           = var.wake_password
      BACKEND_HEALTH_URL  = "http://${aws_eip.backend.public_ip}/"
    }
  }

  tags = local.tags
}

resource "aws_apigatewayv2_api" "dev" {
  name          = "${var.name_prefix}-http"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }

  tags = local.tags
}

resource "aws_apigatewayv2_stage" "dev" {
  api_id      = aws_apigatewayv2_api.dev.id
  name        = "dev"
  auto_deploy = true

  tags = local.tags
}

resource "aws_apigatewayv2_integration" "dev_lambda" {
  api_id                 = aws_apigatewayv2_api.dev.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.dev_api.invoke_arn
  payload_format_version = "2.0"
}

# Routes
resource "aws_apigatewayv2_route" "wake" {
  api_id    = aws_apigatewayv2_api.dev.id
  route_key = "POST /wake"
  target    = "integrations/${aws_apigatewayv2_integration.dev_lambda.id}"
}

resource "aws_apigatewayv2_route" "status" {
  api_id    = aws_apigatewayv2_api.dev.id
  route_key = "GET /status"
  target    = "integrations/${aws_apigatewayv2_integration.dev_lambda.id}"
}

resource "aws_apigatewayv2_route" "touch" {
  api_id    = aws_apigatewayv2_api.dev.id
  route_key = "POST /touch"
  target    = "integrations/${aws_apigatewayv2_integration.dev_lambda.id}"
}

resource "aws_apigatewayv2_route" "magento_graphql" {
  api_id    = aws_apigatewayv2_api.dev.id
  route_key = "POST /magento/graphql"
  target    = "integrations/${aws_apigatewayv2_integration.dev_lambda.id}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dev_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.dev.execution_arn}/*/*"
}

# Auto-sleep schedule (every 15 minutes)
resource "aws_cloudwatch_event_rule" "autosleep" {
  name                = "${var.name_prefix}-autosleep"
  schedule_expression = "rate(15 minutes)"
  tags                = local.tags
}

resource "aws_cloudwatch_event_target" "autosleep" {
  rule      = aws_cloudwatch_event_rule.autosleep.name
  target_id = "autosleep"
  arn       = aws_lambda_function.dev_api.arn

  input = jsonencode({ action = "autosleep" })
}

resource "aws_lambda_permission" "events" {
  statement_id  = "AllowEventsInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dev_api.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.autosleep.arn
}
