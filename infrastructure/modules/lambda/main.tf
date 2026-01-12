# Lambda Module
# AWS Lambda Functions and API Gateway

# -----------------------------------------------------------------------------
# IAM Role for Lambda Functions
# -----------------------------------------------------------------------------
resource "aws_iam_role" "lambda" {
  name = "${var.name_prefix}-lambda-role"

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

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy" "lambda_services" {
  name = "${var.name_prefix}-lambda-services"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "rekognition:DetectFaces",
          "rekognition:DetectLabels",
          "rekognition:DetectText"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "personalize:GetRecommendations",
          "personalize:GetPersonalizedRanking"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${var.s3_bucket_arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = "arn:aws:secretsmanager:*:*:secret:${var.name_prefix}/*"
      }
    ]
  })
}

# -----------------------------------------------------------------------------
# Lambda Layer for Shared Dependencies
# -----------------------------------------------------------------------------
resource "aws_lambda_layer_version" "shared" {
  filename            = "${path.module}/layers/shared.zip"
  layer_name          = "${var.name_prefix}-shared-layer"
  compatible_runtimes = ["python3.11"]
  description         = "Shared dependencies for Lambda functions"

  lifecycle {
    create_before_destroy = true
  }
}

# -----------------------------------------------------------------------------
# Skin Analysis Lambda
# -----------------------------------------------------------------------------
resource "aws_lambda_function" "skin_analysis" {
  function_name = "${var.name_prefix}-skin-analysis"
  description   = "AI-powered skin analysis using Rekognition"
  runtime       = "python3.11"
  handler       = "handler.lambda_handler"
  timeout       = 30
  memory_size   = 512

  role = aws_iam_role.lambda.arn

  filename         = "${path.module}/functions/skin-analysis.zip"
  source_code_hash = filebase64sha256("${path.module}/functions/skin-analysis.zip")

  layers = [aws_lambda_layer_version.shared.arn]

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [var.lambda_security_group_id]
  }

  environment {
    variables = {
      ENVIRONMENT = var.environment
      LOG_LEVEL   = var.environment == "prod" ? "INFO" : "DEBUG"
    }
  }

  tags = var.tags
}

# -----------------------------------------------------------------------------
# Recommendations Lambda
# -----------------------------------------------------------------------------
resource "aws_lambda_function" "recommendations" {
  function_name = "${var.name_prefix}-recommendations"
  description   = "Product recommendations using Amazon Personalize"
  runtime       = "python3.11"
  handler       = "handler.lambda_handler"
  timeout       = 10
  memory_size   = 256

  role = aws_iam_role.lambda.arn

  filename         = "${path.module}/functions/recommendations.zip"
  source_code_hash = filebase64sha256("${path.module}/functions/recommendations.zip")

  layers = [aws_lambda_layer_version.shared.arn]

  environment {
    variables = {
      ENVIRONMENT = var.environment
      LOG_LEVEL   = var.environment == "prod" ? "INFO" : "DEBUG"
    }
  }

  tags = var.tags
}

# -----------------------------------------------------------------------------
# Chatbot Lambda
# -----------------------------------------------------------------------------
resource "aws_lambda_function" "chatbot" {
  function_name = "${var.name_prefix}-chatbot"
  description   = "AI chatbot using Amazon Bedrock"
  runtime       = "python3.11"
  handler       = "handler.lambda_handler"
  timeout       = 60
  memory_size   = 512

  role = aws_iam_role.lambda.arn

  filename         = "${path.module}/functions/chatbot.zip"
  source_code_hash = filebase64sha256("${path.module}/functions/chatbot.zip")

  layers = [aws_lambda_layer_version.shared.arn]

  environment {
    variables = {
      ENVIRONMENT = var.environment
      LOG_LEVEL   = var.environment == "prod" ? "INFO" : "DEBUG"
      MODEL_ID    = "anthropic.claude-3-sonnet-20240229-v1:0"
    }
  }

  tags = var.tags
}

# -----------------------------------------------------------------------------
# API Gateway
# -----------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.name_prefix}-api"
  protocol_type = "HTTP"
  description   = "API Gateway for AI Lambda functions"

  cors_configuration {
    allow_origins = ["https://${var.domain_name}", "https://www.${var.domain_name}"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization", "X-Api-Key"]
    max_age       = 3600
  }

  tags = var.tags
}

resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = var.environment
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      responseLength = "$context.responseLength"
    })
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/api-gateway/${var.name_prefix}"
  retention_in_days = 14

  tags = var.tags
}

# Skin Analysis Integration
resource "aws_apigatewayv2_integration" "skin_analysis" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.skin_analysis.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "skin_analysis" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /api/skin-analysis"
  target    = "integrations/${aws_apigatewayv2_integration.skin_analysis.id}"
}

resource "aws_lambda_permission" "skin_analysis" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.skin_analysis.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Recommendations Integration
resource "aws_apigatewayv2_integration" "recommendations" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.recommendations.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "recommendations" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /api/recommendations"
  target    = "integrations/${aws_apigatewayv2_integration.recommendations.id}"
}

resource "aws_lambda_permission" "recommendations" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.recommendations.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Chatbot Integration
resource "aws_apigatewayv2_integration" "chatbot" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.chatbot.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "chatbot" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /api/chat"
  target    = "integrations/${aws_apigatewayv2_integration.chatbot.id}"
}

resource "aws_lambda_permission" "chatbot" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
