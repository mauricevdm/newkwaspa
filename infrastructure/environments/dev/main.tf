# Development Environment Configuration
# Dermastore Infrastructure

module "dermastore" {
  source = "../../"

  # Environment
  environment  = "dev"
  project_name = "dermastore"

  # Region - Cape Town for South Africa
  aws_region         = "af-south-1"
  availability_zones = ["af-south-1a", "af-south-1b"]

  # Networking
  vpc_cidr = "10.0.0.0/16"

  # Compute - Use spot for cost savings in dev
  ec2_instance_type  = "t3.medium" # Smaller for dev
  use_spot_instances = true
  spot_max_price     = "0.03"

  # Database - Minimal for dev
  db_instance_class    = "db.t3.micro"
  db_allocated_storage = 20
  db_name              = "magento_dev"
  db_username          = var.db_username

  # Cache & Search - Disabled for dev to save costs
  enable_redis      = false
  enable_opensearch = false
  redis_node_type   = "cache.t3.micro"

  # Domain
  domain_name     = "dev.dermastore.co.za"
  create_dns_zone = false

  # Security
  enable_waf = false

  # Tags
  additional_tags = {
    CostCenter = "development"
    AutoShutdown = "true"
  }
}

# Output all values from root module
output "connection_info" {
  value = module.dermastore.connection_info
}

output "estimated_monthly_cost" {
  value = module.dermastore.estimated_monthly_cost
}
