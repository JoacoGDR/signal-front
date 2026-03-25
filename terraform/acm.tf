# TLS for custom domain on CloudFront — certificate must be in us-east-1.

resource "aws_acm_certificate" "site" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "${var.project_name}-acm"
  }
}

# Waits until you add the DNS validation CNAME(s) at your registrar (see terraform output acm_validation_records).
resource "aws_acm_certificate_validation" "site" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.site.arn
}
