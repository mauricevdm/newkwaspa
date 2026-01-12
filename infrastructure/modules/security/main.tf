# Security Module
# WAF, Secrets Manager, ACM

# -----------------------------------------------------------------------------
# Secrets Manager - Database Credentials
# -----------------------------------------------------------------------------
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.name_prefix}/db-credentials"
  description = "Database credentials for Magento"

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = var.db_password
    host     = var.db_endpoint
    port     = 3306
    database = var.db_name
  })
}

# -----------------------------------------------------------------------------
# Secrets Manager - Magento API
# -----------------------------------------------------------------------------
resource "aws_secretsmanager_secret" "magento_api" {
  name        = "${var.name_prefix}/magento-api"
  description = "Magento API credentials"

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "magento_api" {
  secret_id = aws_secretsmanager_secret.magento_api.id
  secret_string = jsonencode({
    integration_token = "placeholder-update-after-magento-install"
    admin_token       = "placeholder-update-after-magento-install"
    base_url          = "https://${var.domain_name}"
  })
}

# -----------------------------------------------------------------------------
# Secrets Manager - AI Services
# -----------------------------------------------------------------------------
resource "aws_secretsmanager_secret" "ai_services" {
  name        = "${var.name_prefix}/ai-services"
  description = "AI service configurations"

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "ai_services" {
  secret_id = aws_secretsmanager_secret.ai_services.id
  secret_string = jsonencode({
    personalize_campaign_arn = "placeholder-update-after-training"
    bedrock_model_id        = "anthropic.claude-3-sonnet-20240229-v1:0"
  })
}

# -----------------------------------------------------------------------------
# WAF Web ACL (Optional)
# -----------------------------------------------------------------------------
resource "aws_wafv2_web_acl" "main" {
  count = var.enable_waf ? 1 : 0

  name        = "${var.name_prefix}-waf"
  description = "WAF for Dermastore"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  # Rate limiting rule
  rule {
    name     = "RateLimitRule"
    priority = 1

    override_action {
      none {}
    }

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "${var.name_prefix}-rate-limit"
      sampled_requests_enabled  = true
    }
  }

  # AWS Managed Rules - Common Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "${var.name_prefix}-common-rules"
      sampled_requests_enabled  = true
    }
  }

  # AWS Managed Rules - SQL Injection
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "${var.name_prefix}-sqli-rules"
      sampled_requests_enabled  = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name               = "${var.name_prefix}-waf"
    sampled_requests_enabled  = true
  }

  tags = var.tags
}

# Associate WAF with ALB
resource "aws_wafv2_web_acl_association" "alb" {
  count = var.enable_waf ? 1 : 0

  resource_arn = var.alb_arn
  web_acl_arn  = aws_wafv2_web_acl.main[0].arn
}

# -----------------------------------------------------------------------------
# SNS Topic for Alerts
# -----------------------------------------------------------------------------
resource "aws_sns_topic" "alerts" {
  name = "${var.name_prefix}-alerts"

  tags = var.tags
}

resource "aws_sns_topic_policy" "alerts" {
  arn = aws_sns_topic.alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowCloudWatchAlarms"
      Effect = "Allow"
      Principal = {
        Service = "cloudwatch.amazonaws.com"
      }
      Action   = "sns:Publish"
      Resource = aws_sns_topic.alerts.arn
    }]
  })
}
