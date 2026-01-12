# Backend configuration for Development environment
# Initialize with: terraform init -backend-config=backend.hcl

bucket         = "dermastore-terraform-state"
key            = "dev/terraform.tfstate"
region         = "af-south-1"
encrypt        = true
dynamodb_table = "dermastore-terraform-locks"
