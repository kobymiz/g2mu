import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import {HttpStatusCode, getResponseSuccess, getResponseError} from 'request-response-helpers';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const TABLE = process.env.TABLE_NAME;
export const USER_IDX = process.env.USERNAME_INDEX; // still unused here

export const handler = async (event) => {
  let body;
  console.log('Event:', JSON.stringify(event, null, 2));
  try {
    body = JSON.parse(event.body);
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch {
    console.error('Error parsing JSON body:', event.body);
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Invalid JSON");
  }

  const { key } = body;
  if (!key) {
    console.error('Missing "key" in body:', body);
    return getResponseError(HttpStatusCode.BAD_REQUEST, 'Missing "key" in body');    
  }

  try {
    console.log('Checking availability for key:', key);
    const { Item } = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { key }
    }));

    console.log('GetCommand result:', Item);
    const response = getResponseSuccess(JSON.stringify({ available: !Item }))
    
    console.log('Response:', response);
    return response;
  } catch (err) {
    console.error(err);
    return getResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR, "Internal server error");
  }
};