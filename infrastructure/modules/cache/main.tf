# Cache Module
# ElastiCache Redis for Magento

# -----------------------------------------------------------------------------
# ElastiCache Subnet Group
# -----------------------------------------------------------------------------
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.name_prefix}-redis-subnet-group"
  subnet_ids = var.subnet_ids

  tags = var.tags
}

# -----------------------------------------------------------------------------
# ElastiCache Parameter Group
# -----------------------------------------------------------------------------
resource "aws_elasticache_parameter_group" "redis" {
  family = "redis7"
  name   = "${var.name_prefix}-redis-params"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  tags = var.tags
}

# -----------------------------------------------------------------------------
# ElastiCache Redis Cluster
# -----------------------------------------------------------------------------
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.name_prefix}-redis"
  description                = "Redis cluster for Magento"
  node_type                  = var.node_type
  num_cache_clusters         = var.num_cache_nodes
  port                       = 6379
  parameter_group_name       = aws_elasticache_parameter_group.redis.name
  subnet_group_name          = aws_elasticache_subnet_group.main.name
  security_group_ids         = [var.security_group_id]
  
  automatic_failover_enabled = var.num_cache_nodes > 1
  multi_az_enabled           = var.num_cache_nodes > 1
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = false # Enable if using TLS

  snapshot_retention_limit   = var.environment == "prod" ? 7 : 0
  snapshot_window            = "03:00-05:00"
  maintenance_window         = "mon:05:00-mon:06:00"

  auto_minor_version_upgrade = true
  apply_immediately          = var.environment != "prod"

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis"
  })
}
