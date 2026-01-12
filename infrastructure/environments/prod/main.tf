# Production Environment Configuration
# Dermastore Infrastructure

module "dermastore" {
  source = "../../"

  # Environment
  environment  = "prod"
  project_name = "dermastore"

  # Region - Cape Town for South Africa
  aws_region         = "af-south-1"
  availability_zones = ["af-south-1a", "af-south-1b", "af-south-1c"]

  # Networking
  vpc_cidr = "10.1.0.0/16"

  # Compute - Mixed spot/on-demand for production reliability
  ec2_instance_type  = "t3.xlarge"
  use_spot_instances = true  # Still use spot but with on-demand fallback
  spot_max_price     = "0.08"

  # Database - Production sized
  db_instance_class    = "db.t3.medium"
  db_allocated_storage = 100
  db_name              = "magento"
  db_username          = var.db_username

  # Cache & Search - Enabled for production
  enable_redis        = true
  enable_opensearch   = true
  redis_node_type     = "cache.t3.small"
  redis_num_cache_nodes = 2

  # Domain
  domain_name     = "dermastore.co.za"
  create_dns_zone = true

  # Security - Full security for production
  enable_waf = true

  # Tags
  additional_tags = {
    CostCenter   = "production"
    Criticality  = "high"
    BackupPolicy = "daily"
  }
}

# Output all values from root module
output "connection_info" {
  value = module.dermastore.connection_info
}

output "estimated_monthly_cost" {
  value = module.dermastore.estimated_monthly_cost
}

output "name_servers" {
  description = "Configure these at your domain registrar"
  value       = module.dermastore.name_servers
}
