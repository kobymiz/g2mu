import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const COGNITO_REGION = 'eu-west-2';         // ⬅️ Replace with your region
const USER_POOL_ID = 'eu-west-2_2LvSV12zU'; // ⬅️ Replace with your user pool ID
const ISSUER = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}`;

const client = jwksClient({
  jwksUri: `${ISSUER}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

function getKey(header) {
  return new Promise((resolve, reject) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) return reject(err);
      resolve(key.getPublicKey());
    });
  });
}

async function verifyToken(token) {
  const decodedHeader = jwt.decode(token, { complete: true });
  const signingKey = await getKey(decodedHeader.header);

  return jwt.verify(token, signingKey, {
    issuer: ISSUER,
    algorithms: ['RS256'],
  });
}

function generatePolicy(principalId, effect, resource, context = {}) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }],
    },
    context,
  };
}

function extractToken(event) {
  const authHeader = event.authorizationToken || '';
  return authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7)
    : null;
}

export async function handler(event) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const token = extractToken(event);
  console.log('Extracted token:', token);

  if (!token) {
    return generatePolicy('unauthorized', 'Deny', event.methodArn);
  }

  try {
    const decoded = await verifyToken(token);
    const principalId = decoded.sub;
    const username = decoded['cognito:username'];
    const email = decoded.email;

    return generatePolicy(principalId, 'Allow', event.methodArn, {
      username,
      email,
      claims: JSON.stringify(decoded),
    });
  } catch (err) {
    console.error('Token verification failed:', err);
    return generatePolicy('unauthorized', 'Deny', event.methodArn);
  }
}
