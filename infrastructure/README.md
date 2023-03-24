# Illumination Infrastructure


## infrastructure-stack
The infrastructure overview.

New Resource declare in this stack:
- S3 bucket - To store static app code.
- CloudFront - To allow access from the domain name to s3 bucket,
- SSM parameter - To store environment values
- Cognito Identity Pool - To add read secret manager access for authenticated user from Cognito User Pool.


Modifying existing resource:
- [UMCCR cognito_user_pool](https://github.com/umccr/infrastructure/tree/master/terraform/stacks/cognito_aai) - adding a new app client for `illumination.${stage}.umccr.org` to existing UMCCR Cognito User Pool.
- Route53 - add A Record to the DNS to access CloudFront

Manual Resource Creation:
- AWS Certificate Manager - SSL certificate needed for cloudfront in `US-East-1` region
- CName in Route53 -  To allow the above certificate to be verified via DNS
- AWS SSM Parameter - Store the above SSL Certificate ARN with parameter name `/illumination/ssl_use1_cert_arn`

## Deploy

To deploy/update changes to the cdk, use the cdk deploy command.

```bash
cdk deploy
```

NOTE: Make sure AWS_PROFILE is set with the correct configuration.
