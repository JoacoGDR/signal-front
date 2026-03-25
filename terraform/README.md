# signal-front AWS (MVP)

Provisions an S3 bucket + CloudFront distribution to host the Signal SPA, **SSM parameters** for CI (Vite API URL, bucket name, distribution ID), and an **IAM user** whose keys are used only by GitHub Actions.

## Philosophy (same as signal-core backend)

- **Terraform Cloud** is the source of truth for configuration.
- **SSM Parameter Store** holds values the CI pipeline reads at build/deploy time (no app config in GitHub secrets).
- The SPA still bakes `VITE_API_BASE_URL` at **build** time; CI fetches it from SSM before `npm run build`.

## Prerequisites

- AWS account; Terraform Cloud or Terraform CLI with credentials
- A globally unique S3 `bucket_name`
- Backend API URL for `api_base_url`

## Usage

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars

terraform init
terraform plan
terraform apply
```

## After apply

1. Copy outputs **`deployer_access_key_id`** and **`deployer_secret_access_key`** into GitHub **Actions secrets**:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
2. Optionally set `AWS_REGION` (workflow defaults to `us-east-1` if unset).
3. Set backend **`cors_allowed_origins`** to `https://<cloudfront_domain>` and refresh backend env (SSM + deploy).

## SSM prefix and GitHub Actions

Terraform variable **`ssm_prefix`** (default `/signal-front/`) must match workflow env **`SIGNAL_FRONT_SSM_PREFIX`** in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml). If you change one, change the other.

SSM parameters created:

- `{ssm_prefix}VITE_API_BASE_URL`
- `{ssm_prefix}S3_BUCKET_NAME`
- `{ssm_prefix}CLOUDFRONT_DISTRIBUTION_ID`

## Outputs

- `cloudfront_url` — SPA URL (set backend CORS to this origin, HTTPS).
- `deployer_access_key_id` / `deployer_secret_access_key` — GitHub secrets for CI.
- `ssm_parameter_prefix` — should match `SIGNAL_FRONT_SSM_PREFIX` in the workflow.

## GitHub Actions

**Secrets required:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` only (plus optional `AWS_REGION`).

**Not used:** `VITE_API_BASE_URL`, `S3_BUCKET_NAME`, `CLOUDFRONT_DISTRIBUTION_ID` — all read from SSM.
