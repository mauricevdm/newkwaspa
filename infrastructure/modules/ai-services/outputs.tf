# AI Services Module Outputs

output "personalize_dataset_group_arn" {
  description = "Personalize dataset group ARN"
  value       = aws_personalize_dataset_group.main.arn
}

output "personalize_role_arn" {
  description = "Personalize IAM role ARN"
  value       = aws_iam_role.personalize.arn
}

output "ai_data_bucket_name" {
  description = "AI training data bucket name"
  value       = aws_s3_bucket.ai_data.id
}

output "ai_data_bucket_arn" {
  description = "AI training data bucket ARN"
  value       = aws_s3_bucket.ai_data.arn
}
