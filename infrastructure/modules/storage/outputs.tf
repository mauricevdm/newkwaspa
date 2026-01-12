# Storage Module Outputs

output "media_bucket_name" {
  description = "Media S3 bucket name"
  value       = aws_s3_bucket.media.id
}

output "media_bucket_arn" {
  description = "Media S3 bucket ARN"
  value       = aws_s3_bucket.media.arn
}

output "media_bucket_domain" {
  description = "Media S3 bucket domain"
  value       = aws_s3_bucket.media.bucket_regional_domain_name
}

output "static_bucket_name" {
  description = "Static S3 bucket name"
  value       = aws_s3_bucket.static.id
}

output "static_bucket_arn" {
  description = "Static S3 bucket ARN"
  value       = aws_s3_bucket.static.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.cdn.id
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "cloudfront_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.cdn.arn
}
