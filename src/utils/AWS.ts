import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export async function get_secret_manager_value(
  creds: any,
  secretName: string
): Promise<string> {
  // Configure
  const client = new SecretsManagerClient({
    credentials: creds,
    region: "ap-southeast-2",
  });
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);

  // Parsing
  if ("SecretString" in response) {
    return String(response.SecretString);
  } else {
    let buff = Buffer.from(String(response.SecretBinary), "base64");
    return buff.toString("ascii");
  }
}
