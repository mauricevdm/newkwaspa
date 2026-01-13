variable "name_prefix" {
  type        = string
  description = "Prefix for resource names"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for ECS container instance"
  default     = "t3.small"
}

variable "wake_username" {
  type        = string
  description = "Dev wake username (Basic Auth)"
  default     = "admin"
}

variable "wake_password" {
  type        = string
  description = "Dev wake password (Basic Auth)"
  default     = "1q2w3e4r"
  sensitive   = true
}

variable "idle_timeout_seconds" {
  type        = number
  description = "Idle time before auto-sleep (seconds)"
  default     = 3600
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply"
  default     = {}
}
