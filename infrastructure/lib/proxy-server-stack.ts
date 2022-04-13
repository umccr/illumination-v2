import { Stack, StackProps, Duration } from "aws-cdk-lib";
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

    const some_secret_token =
      process.env.ICAV2_ACCESS_TOKEN ?? "SOME_SECRET_TOKEN";

    // Lambda for proxy server
    const proxyServerFn = new lambda.NodejsFunction(this, "LambdaProxyServer", {
      entry: "proxy_server/server.ts",
      handler: "handler",
      functionName: "proxy_server_ica_v2",
      environment: {
        ica_server_name: "ica.illumina.com",
        ica_token: some_secret_token,
      },
      timeout: Duration.seconds(10),
    });

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

    // API Gateway
    const httpApi = new apigwv2a.HttpApi(this, "ApiGatewayProxyServer", {
      apiName: "ICAV2_proxy_server",
      defaultIntegration: lambdaApiIntegration,
      corsPreflight: corsConfig,
      defaultAuthorizer: userPoolAuthorizer,
      description: "Gateway for ICAV2 proxy server",
    });
  }
}
