# Security Module Outputs

output "db_credentials_secret_arn" {
  description = "Database credentials secret ARN"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "magento_api_secret_arn" {
  description = "Magento API secret ARN"
  value       = aws_secretsmanager_secret.magento_api.arn
}

output "ai_services_secret_arn" {
  description = "AI services secret ARN"
  value       = aws_secretsmanager_secret.ai_services.arn
}

output "waf_web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = var.enable_waf ? aws_wafv2_web_acl.main[0].arn : ""
}

output "sns_topic_arn" {
  description = "SNS topic ARN for alerts"
  value       = aws_sns_topic.alerts.arn
}
