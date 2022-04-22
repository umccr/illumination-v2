import axios, { AxiosRequestConfig } from "axios";
const ica_token = process.env.ica_token;
exports.handler = async (event: any) => {
  // Event payload:
  // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
  console.log("Processing event: ", JSON.stringify(event));

  const server_url = process.env.ica_server_name;
  const base_url = `https://${server_url}`;

  const raw_path = event.rawPath;
  const parameter = event.queryStringParameters;

  // Rsponse template
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
      baseURL: base_url,
      method: "get",
      headers: {
        Authorization: `Bearer ${ica_token}`,
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
