#!/bin/bash
set -euo pipefail

# =============================================================================
# Frontend Deployment Script - ECS on EC2
# Builds Docker image, pushes to ECR, and updates ECS service
# Access site at: http://13.247.27.53:3000
# =============================================================================

# Configuration with defaults
AWS_PROFILE="${AWS_PROFILE:-cabeceo}"
AWS_REGION="${AWS_REGION:-af-south-1}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[deploy]${NC} $1"; }
info() { echo -e "${BLUE}[info]${NC} $1"; }
warn() { echo -e "${YELLOW}[warn]${NC} $1"; }
error() { echo -e "${RED}[error]${NC} $1" >&2; exit 1; }

# Change to frontend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Derived values
ACCOUNT_ID=$(AWS_PROFILE="$AWS_PROFILE" aws sts get-caller-identity --query Account --output text)
ECR_REPO="newkwaspa"
IMAGE_TAG="frontend-$(date +%Y%m%d-%H%M%S)"
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
ECS_CLUSTER="dermastore-dev-lite-ecs"
ECS_SERVICE="dermastore-dev-lite-backend"
ELASTIC_IP="13.247.27.53"

echo ""
log "Deploying frontend to ECS"
info "   Profile:      $AWS_PROFILE"
info "   Region:       $AWS_REGION"
info "   ECR Repo:     $ECR_URI"
info "   Image Tag:    $IMAGE_TAG"
info "   ECS Cluster:  $ECS_CLUSTER"
info "   ECS Service:  $ECS_SERVICE"
echo ""

# Step 1: Login to ECR
log "Logging into ECR..."
AWS_PROFILE="$AWS_PROFILE" aws ecr get-login-password --region "$AWS_REGION" | \
    docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Step 2: Build the Docker image
log "Building Docker image..."
docker build --platform linux/amd64 -t "${ECR_REPO}:${IMAGE_TAG}" .

# Tag for ECR
docker tag "${ECR_REPO}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
docker tag "${ECR_REPO}:${IMAGE_TAG}" "${ECR_URI}:latest"

# Step 3: Push to ECR
log "Pushing image to ECR..."
docker push "${ECR_URI}:${IMAGE_TAG}"
docker push "${ECR_URI}:latest"

log "Image pushed: ${ECR_URI}:${IMAGE_TAG}"

# Step 4: Update ECS service
log "Updating ECS service..."

# Get the current task definition
TASK_DEF_ARN=$(AWS_PROFILE="$AWS_PROFILE" aws ecs describe-services \
    --region "$AWS_REGION" \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE" \
    --query 'services[0].taskDefinition' \
    --output text)

if [[ "$TASK_DEF_ARN" == "None" ]] || [[ -z "$TASK_DEF_ARN" ]]; then
    error "Could not find ECS service: $ECS_SERVICE in cluster: $ECS_CLUSTER"
fi

TASK_DEF_NAME=$(echo "$TASK_DEF_ARN" | sed 's/.*task-definition\///' | sed 's/:.*//')
info "   Current task definition: $TASK_DEF_NAME"

# Get current task definition and update image
TASK_DEF=$(AWS_PROFILE="$AWS_PROFILE" aws ecs describe-task-definition \
    --region "$AWS_REGION" \
    --task-definition "$TASK_DEF_NAME" \
    --query 'taskDefinition')

# Update the container image and port mapping
NEW_TASK_DEF=$(echo "$TASK_DEF" | jq --arg IMAGE "${ECR_URI}:${IMAGE_TAG}" \
    '.containerDefinitions[0].image = $IMAGE | 
     .containerDefinitions[0].portMappings = [{"containerPort": 3000, "hostPort": 3000, "protocol": "tcp"}] |
     del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)')

# Register the new task definition
NEW_TASK_DEF_ARN=$(AWS_PROFILE="$AWS_PROFILE" aws ecs register-task-definition \
    --region "$AWS_REGION" \
    --cli-input-json "$NEW_TASK_DEF" \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)

info "   New task definition: $NEW_TASK_DEF_ARN"

# Update the service to use the new task definition
AWS_PROFILE="$AWS_PROFILE" aws ecs update-service \
    --region "$AWS_REGION" \
    --cluster "$ECS_CLUSTER" \
    --service "$ECS_SERVICE" \
    --task-definition "$NEW_TASK_DEF_ARN" \
    --force-new-deployment \
    --query 'service.serviceName' \
    --output text > /dev/null

log "Waiting for deployment to stabilize (this may take a few minutes)..."
AWS_PROFILE="$AWS_PROFILE" aws ecs wait services-stable \
    --region "$AWS_REGION" \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE" 2>/dev/null || warn "Timeout waiting - check AWS console"

echo ""
log "Deployment complete!"
info "   Image: ${ECR_URI}:${IMAGE_TAG}"
info "   Site:  http://${ELASTIC_IP}:3000"
