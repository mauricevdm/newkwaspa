# AI Services Module
# Amazon Rekognition, Personalize, Bedrock

# This module provisions IAM policies and configurations for AI services
# The actual service usage happens through Lambda functions

# -----------------------------------------------------------------------------
# Personalize Dataset Group
# -----------------------------------------------------------------------------
resource "aws_personalize_dataset_group" "main" {
  name = "${var.name_prefix}-recommendations"

  tags = var.tags
}

# -----------------------------------------------------------------------------
# IAM Policy for AI Services
# -----------------------------------------------------------------------------
resource "aws_iam_role_policy" "ai_services" {
  name = "${var.name_prefix}-ai-services"
  role = var.lambda_role_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Rekognition"
        Effect = "Allow"
        Action = [
          "rekognition:DetectFaces",
          "rekognition:DetectLabels",
          "rekognition:DetectText",
          "rekognition:DetectCustomLabels",
          "rekognition:DescribeCollection",
          "rekognition:SearchFacesByImage"
        ]
        Resource = "*"
      },
      {
        Sid    = "Personalize"
        Effect = "Allow"
        Action = [
          "personalize:GetRecommendations",
          "personalize:GetPersonalizedRanking",
          "personalize:DescribeCampaign",
          "personalize:ListCampaigns"
        ]
        Resource = [
          aws_personalize_dataset_group.main.arn,
          "arn:aws:personalize:*:*:campaign/${var.name_prefix}-*"
        ]
      },
      {
        Sid    = "Bedrock"
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:ListFoundationModels"
        ]
        Resource = [
          "arn:aws:bedrock:*::foundation-model/anthropic.claude-*",
          "arn:aws:bedrock:*::foundation-model/amazon.titan-*"
        ]
      },
      {
        Sid    = "Comprehend"
        Effect = "Allow"
        Action = [
          "comprehend:DetectSentiment",
          "comprehend:DetectEntities",
          "comprehend:DetectKeyPhrases"
        ]
        Resource = "*"
      }
    ]
  })
}

# -----------------------------------------------------------------------------
# S3 Bucket for AI Training Data
# -----------------------------------------------------------------------------
resource "aws_s3_bucket" "ai_data" {
  bucket = "${var.name_prefix}-ai-data-${data.aws_caller_identity.current.account_id}"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-ai-data"
  })
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_server_side_encryption_configuration" "ai_data" {
  bucket = aws_s3_bucket.ai_data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "ai_data" {
  bucket = aws_s3_bucket.ai_data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# -----------------------------------------------------------------------------
# IAM Role for Personalize
# -----------------------------------------------------------------------------
resource "aws_iam_role" "personalize" {
  name = "${var.name_prefix}-personalize-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "personalize.amazonaws.com"
      }
    }]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "personalize_s3" {
  name = "${var.name_prefix}-personalize-s3"
  role = aws_iam_role.personalize.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:GetObject",
        "s3:ListBucket"
      ]
      Resource = [
        aws_s3_bucket.ai_data.arn,
        "${aws_s3_bucket.ai_data.arn}/*"
      ]
    }]
  })
}
