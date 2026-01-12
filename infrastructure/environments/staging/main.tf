# Staging Environment Configuration
# Dermastore Infrastructure

module "dermastore" {
  source = "../../"

  # Environment
  environment  = "staging"
  project_name = "dermastore"

  # Region - Cape Town for South Africa
  aws_region         = "af-south-1"
  availability_zones = ["af-south-1a", "af-south-1b"]

  # Networking
  vpc_cidr = "10.2.0.0/16"

  # Compute - Use spot for cost savings in staging
  ec2_instance_type  = "t3.large"
  use_spot_instances = true
  spot_max_price     = "0.04"

  # Database - Medium for staging
  db_instance_class    = "db.t3.small"
  db_allocated_storage = 50
  db_name              = "magento_staging"
  db_username          = var.db_username

  # Cache & Search - Enabled for staging to test production-like environment
  enable_redis      = true
  enable_opensearch = false # Keep disabled to save costs
  redis_node_type   = "cache.t3.micro"

  # Domain
  domain_name     = "staging.dermastore.co.za"
  create_dns_zone = false

  # Security
  enable_waf = false

  # Tags
  additional_tags = {
    CostCenter = "staging"
  }
}

# Output all values from root module
output "connection_info" {
  value = module.dermastore.connection_info
}

output "estimated_monthly_cost" {
  value = module.dermastore.estimated_monthly_cost
}
