# Search Module Variables

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for OpenSearch"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for OpenSearch"
  type        = string
}

variable "instance_type" {
  description = "OpenSearch instance type"
  type        = string
  default     = "t3.small.search"
}

variable "instance_count" {
  description = "Number of instances"
  type        = number
  default     = 1
}

variable "volume_size" {
  description = "EBS volume size in GB"
  type        = number
  default     = 20
}

variable "master_user_name" {
  description = "Master user name"
  type        = string
  default     = "admin"
}

variable "master_user_password" {
  description = "Master user password"
  type        = string
  sensitive   = true
  default     = "Admin123!" # Change in production
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
