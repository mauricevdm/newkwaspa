# Main Terraform Configuration
# Dermastore Infrastructure

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  common_tags = merge(var.additional_tags, {
    Project     = var.project_name
    Environment = var.environment
  })
}

# -----------------------------------------------------------------------------
# Networking Module
# -----------------------------------------------------------------------------
module "networking" {
  source = "./modules/networking"

  name_prefix        = local.name_prefix
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  environment        = var.environment

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Compute Module (EC2 Spot for Magento)
# -----------------------------------------------------------------------------
module "compute" {
  source = "./modules/compute"

  name_prefix        = local.name_prefix
  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids
  public_subnet_ids  = module.networking.public_subnet_ids

  instance_type      = var.ec2_instance_type
  use_spot_instances = var.use_spot_instances
  spot_max_price     = var.spot_max_price

  db_endpoint    = module.database.db_endpoint
  redis_endpoint = var.enable_redis ? module.cache[0].redis_endpoint : ""

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Database Module (RDS MySQL)
# -----------------------------------------------------------------------------
module "database" {
  source = "./modules/database"

  name_prefix       = local.name_prefix
  vpc_id            = module.networking.vpc_id
  subnet_ids        = module.networking.private_subnet_ids
  security_group_id = module.networking.db_security_group_id

  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  db_name           = var.db_name
  db_username       = var.db_username
  environment       = var.environment

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Cache Module (ElastiCache Redis) - Optional
# -----------------------------------------------------------------------------
module "cache" {
  count  = var.enable_redis ? 1 : 0
  source = "./modules/cache"

  name_prefix       = local.name_prefix
  vpc_id            = module.networking.vpc_id
  subnet_ids        = module.networking.private_subnet_ids
  security_group_id = module.networking.cache_security_group_id

  node_type       = var.redis_node_type
  num_cache_nodes = var.redis_num_cache_nodes

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Search Module (OpenSearch) - Optional
# -----------------------------------------------------------------------------
module "search" {
  count  = var.enable_opensearch ? 1 : 0
  source = "./modules/search"

  name_prefix       = local.name_prefix
  vpc_id            = module.networking.vpc_id
  subnet_ids        = module.networking.private_subnet_ids
  security_group_id = module.networking.search_security_group_id

  environment = var.environment

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Storage Module (S3 + CloudFront)
# -----------------------------------------------------------------------------
module "storage" {
  source = "./modules/storage"

  name_prefix = local.name_prefix
  domain_name = var.domain_name
  environment = var.environment

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Lambda Module (AI/ML Functions)
# -----------------------------------------------------------------------------
module "lambda" {
  source = "./modules/lambda"

  name_prefix        = local.name_prefix
  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids

  s3_bucket_arn = module.storage.media_bucket_arn
  environment   = var.environment

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# AI Services Module
# -----------------------------------------------------------------------------
module "ai_services" {
  source = "./modules/ai-services"

  name_prefix = local.name_prefix
  environment = var.environment

  lambda_role_arn = module.lambda.lambda_role_arn

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Monitoring Module
# -----------------------------------------------------------------------------
module "monitoring" {
  source = "./modules/monitoring"

  name_prefix = local.name_prefix
  environment = var.environment

  ec2_instance_id = module.compute.instance_id
  db_instance_id  = module.database.db_instance_id
  alb_arn         = module.compute.alb_arn

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Security Module (Secrets Manager, WAF)
# -----------------------------------------------------------------------------
module "security" {
  source = "./modules/security"

  name_prefix = local.name_prefix
  environment = var.environment
  enable_waf  = var.enable_waf

  alb_arn = module.compute.alb_arn

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# DNS Module (Route53) - Optional
# -----------------------------------------------------------------------------
module "dns" {
  count  = var.create_dns_zone ? 1 : 0
  source = "./modules/dns"

  domain_name      = var.domain_name
  alb_dns_name     = module.compute.alb_dns_name
  alb_zone_id      = module.compute.alb_zone_id
  cloudfront_domain = module.storage.cloudfront_domain

  tags = local.common_tags
}
