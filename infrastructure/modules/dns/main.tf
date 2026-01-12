# DNS Module
# Route53 Hosted Zone and Records

# -----------------------------------------------------------------------------
# Route53 Hosted Zone
# -----------------------------------------------------------------------------
resource "aws_route53_zone" "main" {
  name = var.domain_name

  tags = merge(var.tags, {
    Name = var.domain_name
  })
}

# -----------------------------------------------------------------------------
# DNS Records
# -----------------------------------------------------------------------------

# Root domain A record (ALB)
resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

# WWW subdomain
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

# CDN subdomain
resource "aws_route53_record" "cdn" {
  count = var.cloudfront_domain != "" ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = "cdn.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [var.cloudfront_domain]
}

# API subdomain (API Gateway or ALB)
resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

# MX Records (placeholder - update with actual mail provider)
resource "aws_route53_record" "mx" {
  count = var.create_mx_records ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "MX"
  ttl     = 3600
  records = var.mx_records
}

# SPF Record
resource "aws_route53_record" "spf" {
  count = var.create_mx_records ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 3600
  records = ["v=spf1 include:_spf.google.com ~all"]
}
