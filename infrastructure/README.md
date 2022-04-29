# Illumination Infrastrucutre


Currently, there are 2 stacks in place for the Illumination.
- [Infrastructure](lib/infrastructure-stack.ts) - This is the main stack, where all the resource to make Illumination online is defined here.
- [Proxy Server](lib/proxy-server-stack.ts) - This is a temporary stack to proxy the ICA endpoint to allow `Access-Control-Allow-Origin": "*"` when it is requested from browser.


## infrastructure-stack
The infrastructure overview.

New Resource declare in this stack:
- S3 bucket - To store static app code.
- CloudFront - To allow access from the domain name to s3 bucket,
- SSM paramter - To store environment values

Modifying existing resource:
- [UMCCR cognito_user_pool](https://github.com/umccr/infrastructure/tree/master/terraform/stacks/cognito_aai) - adding a new app client for `illumination.${stage}.umccr.org` to existing UMCCR Cognito User Pool.
- Route53 - add A Record to the DNS to access CloudFront

Manual Resource Creation:
- AWS Certificate Manager - SSL certificate needed for cloudfront in `US-East-1` region
- CName in Route53 -  To allow the above certificate to be verified via DNS
- AWS SSM Parameter - Store the above SSL Certificate ARN with parameter name `/illumination/ssl_use1_cert_arn`

## proxy-server-stack

This stack is only temporary until ICA endpoint allow Cross-Origin support.

New Resource declare in this stack:
- Lambda function - To edit the response from ICA endpoint to include Cross-Origin support
- API GatewayV2 - To allow lambda access from authenticated user
- SSM paramter - To store environment values

Modifying existing resource:
- Route53 - add A Record to the DNS to access api-gateway

Manual Resource Creation:
- AWS Certificate Manager - SSL certificate needed for cloudfront in `ap-southeast-2` region
- CName in Route53 -  To allow the above certificate to be verified via DNS
- AWS SSM Parameter - Store the above SSL Certificate ARN with parameter name `/illumination/ssl_aps2_cert_arn`  

NOTE: Yes there are 2 SSL certificate created for 2 stacks. Ideally we could create one to be used in both stack. CloudFront need the certificate located in USE1 and ApiGatewayV2 (HttpApi) needed to be located at ASP2.

