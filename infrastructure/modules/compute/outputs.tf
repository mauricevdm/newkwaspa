# Compute Module Outputs

output "instance_id" {
  description = "Instance ID (from ASG)"
  value       = aws_autoscaling_group.magento.id
}

output "public_ip" {
  description = "Public IP (via ALB)"
  value       = aws_lb.main.dns_name
}

output "alb_arn" {
  description = "ALB ARN"
  value       = aws_lb.main.arn
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB zone ID"
  value       = aws_lb.main.zone_id
}

output "target_group_arn" {
  description = "Target group ARN"
  value       = aws_lb_target_group.magento.arn
}

output "asg_name" {
  description = "Auto Scaling Group name"
  value       = aws_autoscaling_group.magento.name
}

output "launch_template_id" {
  description = "Launch template ID"
  value       = aws_launch_template.magento.id
}
