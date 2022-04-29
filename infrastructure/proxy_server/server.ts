import axios, { AxiosRequestConfig } from "axios";
import { SecretsManager } from "aws-sdk";

// Global Variables
const BASE_URL: string = "https://ica.illumina.com/ica/rest";

// Lambda environment
const ICA_SECRET_MANAGER_NAME: string =
  process.env.ICA_SECRET_MANAGER_NAME ?? "SUPER SECRET JWT TOKEN";

async function getICAToken() {
  let aws_secret_manager = new SecretsManager({ region: "ap-southeast-2" });
  try {
    let secret_data = await aws_secret_manager
      .getSecretValue({
        SecretId: ICA_SECRET_MANAGER_NAME,
      })
      .promise();
    if ("SecretString" in secret_data) {
      return String(secret_data.SecretString);
    } else {
      let buff = Buffer.from(String(secret_data.SecretBinary), "base64");
      return buff.toString("ascii");
    }
  } catch (error) {
    console.error("Something went wrong. Err: ", error);
    throw error;
  }
}

exports.handler = async (event: any) => {

  // Event payload:
  // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
  // console.log("Processing event: ", JSON.stringify(event));

  const raw_path = event.rawPath;
  const parameter = event.queryStringParameters;

  // Response template
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
    body: event,
  };

  if (event.requestContext.http.method === "GET") {
    const get_config: AxiosRequestConfig = {
      baseURL: BASE_URL,
      method: "get",
      headers: {
        Authorization: `Bearer ${await getICAToken()}`,
        Accept: "application/vnd.illumina.v3+json",
      },
      url: raw_path,
      params: parameter,
    };

    try {
      const get_request = await axios(get_config);
      response.body = JSON.stringify(get_request.data);
    } catch (error) {
      response.statusCode = 501;
      response.body = error;
      console.error(error);
    }
  } else {
    response.statusCode = 400;
    response.body = "Unsupported request method";
  }

  console.log("Response: ", JSON.stringify(response));

  return response;
};
