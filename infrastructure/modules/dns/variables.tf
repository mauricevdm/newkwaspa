# DNS Module Variables

variable "domain_name" {
  description = "Primary domain name"
  type        = string
}

variable "alb_dns_name" {
  description = "ALB DNS name"
  type        = string
}

variable "alb_zone_id" {
  description = "ALB hosted zone ID"
  type        = string
}

variable "cloudfront_domain" {
  description = "CloudFront distribution domain"
  type        = string
  default     = ""
}

variable "create_mx_records" {
  description = "Create MX records for email"
  type        = bool
  default     = false
}

variable "mx_records" {
  description = "MX records"
  type        = list(string)
  default     = ["10 mail.example.com"]
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
