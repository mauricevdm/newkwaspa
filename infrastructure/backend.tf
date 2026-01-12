# Terraform State Backend Configuration
# Dermastore Infrastructure

# S3 Backend for remote state storage
# Initialize with: terraform init -backend-config=environments/<env>/backend.hcl

terraform {
  backend "s3" {
    # These values are provided via backend.hcl files per environment
    # bucket         = "dermastore-terraform-state"
    # key            = "env/terraform.tfstate"
    # region         = "af-south-1"
    # encrypt        = true
    # dynamodb_table = "dermastore-terraform-locks"
  }
}

# Note: Create the S3 bucket and DynamoDB table before running terraform init
# Use the script: scripts/init-backend.sh
