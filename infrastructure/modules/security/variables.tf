# Security Module Variables

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "enable_waf" {
  description = "Enable WAF"
  type        = bool
  default     = false
}

variable "alb_arn" {
  description = "ALB ARN for WAF association"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Domain name"
  type        = string
  default     = "dermastore.co.za"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "db_password" {
  description = "Database password"
  type        = string
  default     = ""
  sensitive   = true
}

variable "db_endpoint" {
  description = "Database endpoint"
  type        = string
  default     = ""
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "magento"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
