# AI Services Module Variables

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "lambda_role_arn" {
  description = "Lambda IAM role ARN"
  type        = string
}

variable "lambda_role_name" {
  description = "Lambda IAM role name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
