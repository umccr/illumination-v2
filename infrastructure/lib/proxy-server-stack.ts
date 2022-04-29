import {
  Stack,
  StackProps,
  Duration,
  aws_certificatemanager,
  aws_route53,
  aws_route53_targets,
  aws_secretsmanager,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as cognito from "aws-cdk-lib/aws-cognito";

// ALPHA (not stable) libraries
import * as apigwv2a from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";

export class ProxyServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Grab ICA JWT from secret manager
     */

    const ica_jwt_secret_manager = aws_secretsmanager.Secret.fromSecretNameV2(
      this,
      "ICAJWTSecret",
      "IcaSecretsPortal" // TODO: Change secret name to the proper V2
    );

    // Lambda for proxy server
    const proxyServerFn = new lambda.NodejsFunction(this, "LambdaProxyServer", {
      entry: "proxy_server/server.ts",
      handler: "handler",
      functionName: "proxy_server_ica_v2",
      environment: {
        ICA_SECRET_MANAGER_NAME: ica_jwt_secret_manager.secretName,
      },
      timeout: Duration.seconds(10),
    });

    ica_jwt_secret_manager.grantRead(proxyServerFn);

    // User Pool
    const userPoolId = ssm.StringParameter.fromStringParameterName(
      this,
      "CognitoUserPoolIdSSMParamter",
      "/data_portal/client/cog_user_pool_id"
    ).stringValue;

    const userPool = cognito.UserPool.fromUserPoolId(
      this,
      "CognitoUserPool",
      userPoolId
    );

    // UserPool Authorizer
    const userPoolAuthorizer = new HttpUserPoolAuthorizer(
      "DataPortalAuthorizer",
      userPool
    );

    // Lambda route integration
    const lambdaApiIntegration = new HttpLambdaIntegration(
      "ProxyServerLmabdaApiIntegration",
      proxyServerFn
    );

    // Cors config
    const corsConfig = {
      allowHeaders: ["Authorization"],
      allowMethods: [
        apigwv2a.CorsHttpMethod.GET,
        apigwv2a.CorsHttpMethod.OPTIONS,
      ],
      allowOrigins: ["*"],
    };

    /**
     * Lookup SSL Certficate that is created manually
     */
    // HostedZone Lookup
    const hostedZoneId = ssm.StringParameter.fromStringParameterName(
      this,
      "UMCCRHostedZoneId",
      "/hosted_zone/umccr/id"
    ).stringValue;
    const hostedZoneName = ssm.StringParameter.fromStringParameterName(
      this,
      "UMCCRHostedZoneName",
      "/hosted_zone/umccr/name"
    ).stringValue;

    const hostedZone = aws_route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      { hostedZoneId: hostedZoneId, zoneName: hostedZoneName }
    );

    const use1_cert_arn = ssm.StringParameter.fromStringParameterName(
      this,
      "UMCCRUSECertArn",
      "/illumination/ssl_aps2_cert_arn"
    ).stringValue;
    const illumination_aps2_cert =
      aws_certificatemanager.Certificate.fromCertificateArn(
        this,
        "IlluminationSSLCert",
        use1_cert_arn
      );

    // API Gateway
    const apigwv2_domain_name = new apigwv2a.DomainName(
      this,
      "ApiGatewayDomainName",
      {
        certificate: illumination_aps2_cert,
        domainName: `api.illumination.${hostedZoneName}`,
        certificateName: "IlluminationSSL",
      }
    );

    new apigwv2a.HttpApi(this, "ApiGatewayProxyServer", {
      apiName: "ICAV2_proxy_server",
      defaultIntegration: lambdaApiIntegration,
      corsPreflight: corsConfig,
      defaultAuthorizer: userPoolAuthorizer,
      description: "Gateway for ICAV2 proxy server",
      defaultDomainMapping: {
        domainName: apigwv2_domain_name,
      },
    });

    const illumination_api_a_record = new aws_route53.ARecord(
      this,
      "IlluminationARecord",
      {
        target: aws_route53.RecordTarget.fromAlias(
          new aws_route53_targets.ApiGatewayv2DomainProperties(
            apigwv2_domain_name.regionalDomainName,
            apigwv2_domain_name.regionalHostedZoneId
          )
        ),
        zone: hostedZone,
        recordName: "api.illumination",
      }
    );

    // API Gateway URL ssm param
    new ssm.StringParameter(this, "SSMOAuthRedirectIn", {
      stringValue: illumination_api_a_record.domainName,
      parameterName: "/illumination/proxy_server",
    });
  }
}
