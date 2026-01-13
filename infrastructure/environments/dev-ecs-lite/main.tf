# Dev ECS Lite Environment (af-south-1)
#
# Purpose: ultra-low-cost dev backend that sleeps when idle.
# - ECS on EC2 (single instance)
# - Elastic IP
# - API Gateway + Lambda wake/status/proxy
# - Auto-sleep after 1 hour idle

module "dev_backend" {
  source = "../../modules/dev-ecs-lite"

  name_prefix = "dermastore-dev-lite"
  aws_region  = "af-south-1"

  instance_type = "t3.small"

  # Wake credentials (dev-only)
  wake_username = "admin"
  wake_password = "1q2w3e4r"

  idle_timeout_seconds = 3600

  tags = {
    Project      = "Dermastore"
    Environment  = "dev"
    CostCenter   = "development"
    AutoShutdown = "true"
  }
}

output "dev_backend" {
  value = {
    elastic_ip            = module.dev_backend.elastic_ip
    backend_health_url    = module.dev_backend.backend_health_url
    wake_url              = module.dev_backend.wake_url
    status_url            = module.dev_backend.status_url
    magento_graphql_proxy = module.dev_backend.magento_graphql_proxy_url
    notes                 = "Backend starts only via wake endpoint. If you want it stopped immediately after first deploy, call the stop endpoint or wait for autosleep."
  }
}
