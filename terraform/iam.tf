data "aws_caller_identity" "current" {}

resource "aws_iam_user" "github_deploy" {
  name = "${var.project_name}-github-deploy"
  path = "/"

  tags = {
    Name = "${var.project_name}-github-deploy"
  }
}

data "aws_iam_policy_document" "github_deploy" {
  statement {
    sid    = "ReadBuildAndDeployParams"
    effect = "Allow"
    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters",
      "ssm:GetParametersByPath",
    ]
    resources = [
      "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${local.ssm_iam_path}/*",
    ]
  }

  statement {
    sid    = "SyncDistToS3"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      aws_s3_bucket.site.arn,
      "${aws_s3_bucket.site.arn}/*",
    ]
  }

  statement {
    sid    = "InvalidateCloudFront"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
    ]
    resources = [
      aws_cloudfront_distribution.site.arn,
    ]
  }
}

resource "aws_iam_user_policy" "github_deploy" {
  name   = "${var.project_name}-github-deploy"
  user   = aws_iam_user.github_deploy.name
  policy = data.aws_iam_policy_document.github_deploy.json
}

resource "aws_iam_access_key" "github_deploy" {
  user = aws_iam_user.github_deploy.name
}
