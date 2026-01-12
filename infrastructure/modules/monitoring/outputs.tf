# Monitoring Module Outputs

output "dashboard_name" {
  description = "CloudWatch dashboard name"
  value       = aws_cloudwatch_dashboard.main.dashboard_name
}

output "application_log_group" {
  description = "Application log group name"
  value       = aws_cloudwatch_log_group.application.name
}

output "magento_log_group" {
  description = "Magento log group name"
  value       = aws_cloudwatch_log_group.magento.name
}

output "high_cpu_alarm_arn" {
  description = "High CPU alarm ARN"
  value       = aws_cloudwatch_metric_alarm.high_cpu.arn
}
