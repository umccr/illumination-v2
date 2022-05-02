#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { InfrastructureStack } from "../lib/infrastructure-stack";

const account_id: string | undefined = process.env.CDK_DEFAULT_ACCOUNT;

let app_stage: string = "dev";
if (account_id === "472057503814") {
  app_stage = "prod";
}

const app_props = {
  app_name: "illumination",
  app_stage: app_stage,
  region: "ap-southeast-2",
  client_bucket_name: {
    dev: "org.umccr.dev.illumination",
    prod: "org.umccr.prod.illumination",
  },
  alias_domain_name: {
    dev: ["illumination.dev.umccr.org"],
    prod: ["illumination.prod.umccr.org", "illumination.umccr.org"],
  },
  callback_url: {
    dev: ["https://illumination.dev.umccr.org"],
    prod: [
      "https://illumination.umccr.org",
      "https://illumination.prod.umccr.org",
    ],
  },
};

const app = new cdk.App({ context: { app_props: app_props } });
new InfrastructureStack(app, "InfrastructureStack", {
  stackName: `${app_props.app_name}-stack`,
  tags: {
    stack: `${app_props.app_name}-stack`,
  },
});
