# Monitoring Module Variables

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "asg_name" {
  description = "Auto Scaling Group name"
  type        = string
  default     = ""
}

variable "alb_arn" {
  description = "ALB ARN"
  type        = string
  default     = ""
}

variable "alb_arn_suffix" {
  description = "ALB ARN suffix"
  type        = string
  default     = ""
}

variable "db_instance_id" {
  description = "RDS instance ID"
  type        = string
  default     = ""
}

variable "alarm_sns_topic_arn" {
  description = "SNS topic ARN for alarm notifications"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
