# Global Variables
# Dermastore Infrastructure

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "af-south-1" # Cape Town region for South Africa
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "dermastore"
}

# Networking
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["af-south-1a", "af-south-1b"]
}

# Compute
variable "ec2_instance_type" {
  description = "EC2 instance type for Magento"
  type        = string
  default     = "t3.large"
}

variable "use_spot_instances" {
  description = "Whether to use spot instances for cost savings"
  type        = bool
  default     = true
}

variable "spot_max_price" {
  description = "Maximum spot price (0 = on-demand price cap)"
  type        = string
  default     = "0.04"
}

# Database
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro" # POC size
}

variable "db_allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "magento"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "admin"
  sensitive   = true
}

# Cache
variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

# Domain
variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = "dermastore.co.za"
}

variable "create_dns_zone" {
  description = "Whether to create Route53 hosted zone"
  type        = bool
  default     = false
}

# Feature Flags
variable "enable_opensearch" {
  description = "Enable OpenSearch (disable for minimal POC)"
  type        = bool
  default     = false # Disabled for POC to save costs
}

variable "enable_redis" {
  description = "Enable ElastiCache Redis"
  type        = bool
  default     = false # Disabled for POC to save costs
}

variable "enable_waf" {
  description = "Enable WAF for production"
  type        = bool
  default     = false
}

# Tags
variable "additional_tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}
