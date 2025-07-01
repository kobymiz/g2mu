import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

import {HttpStatusCode, getResponseSuccess, getResponseError} from 'request-response-helpers';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const TABLE = process.env.TABLE_NAME;

export const handler = async (event) => {
  const { key } = event.pathParameters || {};
  const username = event.requestContext?.authorizer?.email;
  const now = new Date().toISOString();
  let body;

  if (!key || !username) {
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Missing path parameter or username")
  }

  try {
    body = JSON.parse(event.body);
  } catch {    
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Invalid JSON")
  }

  try {
    // Fetch existing item to retain createdAt & totalAccessCount
    const { Item: existing } = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { key },
    }));

    const item = {
      key,
      username,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      longUrl: body.longUrl,
      title: body.title,
      description: body.description,
      active: body.active ?? true,
      deactivatedAt: body.deactivatedAt,
      deactivatedBy: body.deactivatedBy,
      lastAccessedAt: body.lastAccessedAt,
      totalAccessCount: existing?.totalAccessCount ?? 0,
    };

    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: item,
    }));

    const response = getResponseSuccess(JSON.stringify(item));
    console.log('Response:', response);
    return response;    
  } catch (err) {
    console.error(err);
    return getResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR, "Internal server error");
  }
};
