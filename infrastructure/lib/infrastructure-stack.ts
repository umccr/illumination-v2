import {
  Stack,
  StackProps,
  RemovalPolicy,
  aws_ssm,
  aws_route53,
  aws_route53_targets as aws_route53_t,
  aws_certificatemanager,
  aws_s3,
  aws_cloudfront,
  aws_cognito,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const app_props = this.node.tryGetContext("app_props");

    // HostedZone Lookup
    const hostedZoneId = aws_ssm.StringParameter.fromStringParameterName(
      this,
      "UMCCRHostedZoneId",
      "/hosted_zone/umccr/id"
    ).stringValue;
    const hostedZoneName = aws_ssm.StringParameter.fromStringParameterName(
      this,
      "UMCCRHostedZoneName",
      "/hosted_zone/umccr/name"
    ).stringValue;

    const hostedZone = aws_route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      { hostedZoneId: hostedZoneId, zoneName: hostedZoneName }
    );

    /**
     * Lookup SSL Certficate that is created manually
     */
    const use1_cert_arn = aws_ssm.StringParameter.fromStringParameterName(
      this,
      "UMCCRUSECertArn",
      "/illumination/ssl_use1_cert_arn"
    ).stringValue;
    const illumination_use1_cert =
      aws_certificatemanager.Certificate.fromCertificateArn(
        this,
        "IlluminationSSLCert",
        use1_cert_arn
      );

    /**
     * Creates S3 bucket where the React code live
     */

    const client_bucket = new aws_s3.Bucket(this, "IlluminationClientBucket", {
      bucketName: app_props.client_bucket_name[app_props.app_stage],
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
    });
    new aws_ssm.StringParameter(this, "SSMClientBucketName", {
      stringValue: client_bucket.bucketName,
      parameterName: "/illumination/bucket_name",
    });

    /**
     * Creates CloudFront and S3 acess via OAI
     */

    // Illumination OriginAccessIdentiy
    const illumination_oai = new aws_cloudfront.OriginAccessIdentity(
      this,
      "IlluminationOAI",
      {
        comment: "Created for Illumination.",
      }
    );

    // Setup CloudFront
    const cloudfront_web_distribution =
      new aws_cloudfront.CloudFrontWebDistribution(
        this,
        "IlluminationCloudFrontWebDistribution",
        {
          originConfigs: [
            {
              s3OriginSource: {
                s3BucketSource: client_bucket,
                originAccessIdentity: illumination_oai,
              },
              behaviors: [{ isDefaultBehavior: true }],
            },
          ],
          defaultRootObject: "index.html",
          priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_ALL,
          viewerProtocolPolicy:
            aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          enableIpV6: false,
          viewerCertificate:
            aws_cloudfront.ViewerCertificate.fromAcmCertificate(
              illumination_use1_cert,
              {
                aliases: app_props.alias_domain_name[app_props.app_stage],
                securityPolicy: aws_cloudfront.SecurityPolicyProtocol.TLS_V1,
                sslMethod: aws_cloudfront.SSLMethod.SNI,
              }
            ),
        }
      );

    /**
     * Creates A Record in route53, to redirect to CloudFront
     */
    new aws_route53.ARecord(this, "IlluminationARecord", {
      target: aws_route53.RecordTarget.fromAlias(
        new aws_route53_t.CloudFrontTarget(cloudfront_web_distribution)
      ),
      zone: hostedZone,
      recordName: app_props.app_name,
    });

    /**
     * Creates illumination domain to UMCCR Authentication Cognito setup.
     */

    // Lookup current cognito setup
    const umccr_cognito_user_pool_id =
      aws_ssm.StringParameter.fromStringParameterName(
        this,
        "UMCCRCognitoUserPoolId",
        "/data_portal/client/cog_user_pool_id"
      ).stringValue;
    const umccr_cognito_user_pool = aws_cognito.UserPool.fromUserPoolId(
      this,
      "UMCCRCognitoUserPool",
      umccr_cognito_user_pool_id
    );

    // Add Illumination as new cognito client
    const illumination_client_id = umccr_cognito_user_pool.addClient(
      "IlluminationCognitoAppClient",
      {
        authFlows: {
          custom: true,
          userSrp: true,
        },
        generateSecret: false,
        oAuth: {
          callbackUrls: app_props.callback_url[app_props.app_stage],
          flows: {
            authorizationCodeGrant: true,
          },
          logoutUrls: app_props.callback_url[app_props.app_stage],
          scopes: [
            aws_cognito.OAuthScope.EMAIL,
            aws_cognito.OAuthScope.OPENID,
            aws_cognito.OAuthScope.PROFILE,
            aws_cognito.OAuthScope.COGNITO_ADMIN,
          ],
        },
        supportedIdentityProviders: [
          aws_cognito.UserPoolClientIdentityProvider.GOOGLE,
        ],
        userPoolClientName: `${app_props.app_name}-app-${app_props.app_stage}`,
      }
    );

    // Exporting these values to SSM paramter to be used in React app
    new aws_ssm.StringParameter(this, "SSMAppClientId", {
      stringValue: illumination_client_id.userPoolClientId,
      parameterName: "/illumination/cognito_app_client_id",
    });
    new aws_ssm.StringParameter(this, "SSMOAuthRedirectOut", {
      stringValue: app_props.callback_url[app_props.app_stage][0],
      parameterName: "/illumination/oauth_redirect_in_stage",
    });
    new aws_ssm.StringParameter(this, "SSMOAuthRedirectIn", {
      stringValue: app_props.callback_url[app_props.app_stage][0],
      parameterName: "/illumination/oauth_redirect_out_stage",
    });
  }
}
