# Terraform Outputs
# Dermastore Infrastructure

# -----------------------------------------------------------------------------
# Networking Outputs
# -----------------------------------------------------------------------------
output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.networking.private_subnet_ids
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.networking.public_subnet_ids
}

# -----------------------------------------------------------------------------
# Compute Outputs
# -----------------------------------------------------------------------------
output "magento_instance_id" {
  description = "Magento EC2 instance ID"
  value       = module.compute.instance_id
}

output "magento_public_ip" {
  description = "Magento public IP (if applicable)"
  value       = module.compute.public_ip
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = module.compute.alb_dns_name
}

output "magento_admin_url" {
  description = "Magento Admin URL"
  value       = "https://${module.compute.alb_dns_name}/admin"
}

# -----------------------------------------------------------------------------
# Database Outputs
# -----------------------------------------------------------------------------
output "db_endpoint" {
  description = "RDS MySQL endpoint"
  value       = module.database.db_endpoint
}

output "db_port" {
  description = "RDS MySQL port"
  value       = module.database.db_port
}

output "db_name" {
  description = "Database name"
  value       = module.database.db_name
}

# -----------------------------------------------------------------------------
# Cache Outputs (Conditional)
# -----------------------------------------------------------------------------
output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = var.enable_redis ? module.cache[0].redis_endpoint : "Redis disabled"
}

output "redis_port" {
  description = "ElastiCache Redis port"
  value       = var.enable_redis ? module.cache[0].redis_port : 0
}

# -----------------------------------------------------------------------------
# Search Outputs (Conditional)
# -----------------------------------------------------------------------------
output "opensearch_endpoint" {
  description = "OpenSearch endpoint"
  value       = var.enable_opensearch ? module.search[0].opensearch_endpoint : "OpenSearch disabled"
}

# -----------------------------------------------------------------------------
# Storage Outputs
# -----------------------------------------------------------------------------
output "media_bucket_name" {
  description = "S3 bucket name for media"
  value       = module.storage.media_bucket_name
}

output "media_bucket_arn" {
  description = "S3 bucket ARN for media"
  value       = module.storage.media_bucket_arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.storage.cloudfront_distribution_id
}

output "cloudfront_domain" {
  description = "CloudFront domain name"
  value       = module.storage.cloudfront_domain
}

# -----------------------------------------------------------------------------
# Lambda Outputs
# -----------------------------------------------------------------------------
output "api_gateway_url" {
  description = "API Gateway URL for Lambda functions"
  value       = module.lambda.api_gateway_url
}

output "skin_analysis_function_name" {
  description = "Skin analysis Lambda function name"
  value       = module.lambda.skin_analysis_function_name
}

output "recommendations_function_name" {
  description = "Recommendations Lambda function name"
  value       = module.lambda.recommendations_function_name
}

output "chatbot_function_name" {
  description = "Chatbot Lambda function name"
  value       = module.lambda.chatbot_function_name
}

# -----------------------------------------------------------------------------
# Security Outputs
# -----------------------------------------------------------------------------
output "db_credentials_secret_arn" {
  description = "ARN of database credentials secret"
  value       = module.security.db_credentials_secret_arn
  sensitive   = true
}

output "magento_api_secret_arn" {
  description = "ARN of Magento API credentials secret"
  value       = module.security.magento_api_secret_arn
  sensitive   = true
}

# -----------------------------------------------------------------------------
# DNS Outputs (Conditional)
# -----------------------------------------------------------------------------
output "route53_zone_id" {
  description = "Route53 hosted zone ID"
  value       = var.create_dns_zone ? module.dns[0].zone_id : "DNS zone not created"
}

output "name_servers" {
  description = "Route53 name servers"
  value       = var.create_dns_zone ? module.dns[0].name_servers : []
}

# -----------------------------------------------------------------------------
# Connection Information
# -----------------------------------------------------------------------------
output "connection_info" {
  description = "Connection information summary"
  value = {
    magento_url        = "https://${module.compute.alb_dns_name}"
    magento_admin      = "https://${module.compute.alb_dns_name}/admin"
    api_gateway        = module.lambda.api_gateway_url
    cloudfront_cdn     = "https://${module.storage.cloudfront_domain}"
    database_host      = module.database.db_endpoint
    redis_host         = var.enable_redis ? module.cache[0].redis_endpoint : "disabled"
    opensearch_host    = var.enable_opensearch ? module.search[0].opensearch_endpoint : "disabled"
  }
}

# -----------------------------------------------------------------------------
# Cost Estimation
# -----------------------------------------------------------------------------
output "estimated_monthly_cost" {
  description = "Estimated monthly cost for this configuration"
  value = {
    compute      = var.use_spot_instances ? "~$25 (spot t3.large)" : "~$60 (on-demand t3.large)"
    database     = "~$15 (db.t3.micro)"
    redis        = var.enable_redis ? "~$12 (cache.t3.micro)" : "$0 (disabled)"
    opensearch   = var.enable_opensearch ? "~$35 (t3.small.search)" : "$0 (disabled)"
    s3_cdn       = "~$15 (S3 + CloudFront)"
    lambda       = "~$5 (pay per use)"
    total_poc    = var.use_spot_instances ? "~$60-80/month" : "~$100-120/month"
  }
}
