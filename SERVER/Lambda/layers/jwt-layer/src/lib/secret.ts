import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export const jwtSecretAsync = async () => {
  const { SecretString: secret } = await (new SecretsManagerClient()).send(
    new GetSecretValueCommand({
      SecretId: 'sqmJwtSecret'
    }),
  );
  if (typeof secret === 'undefined') {
    throw 'empty secret';
  }
  return secret;
}
