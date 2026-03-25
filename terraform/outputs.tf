output "s3_bucket_name" {
  description = "S3 bucket name (also in SSM as S3_BUCKET_NAME)."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (also in SSM as CLOUDFRONT_DISTRIBUTION_ID)."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name (use as SPA URL; set backend CORS to https://<this>)."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "cloudfront_url" {
  description = "HTTPS URL for the SPA."
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "deployer_access_key_id" {
  description = "Set as GitHub secret AWS_ACCESS_KEY_ID for the frontend workflow."
  value       = aws_iam_access_key.github_deploy.id
}

output "deployer_secret_access_key" {
  description = "Set as GitHub secret AWS_SECRET_ACCESS_KEY (shown once; stored in Terraform state)."
  value       = aws_iam_access_key.github_deploy.secret
  sensitive   = true
}

output "ssm_parameter_prefix" {
  description = "Must match SIGNAL_FRONT_SSM_PREFIX in .github/workflows/deploy.yml."
  value       = local.ssm_dir
}
