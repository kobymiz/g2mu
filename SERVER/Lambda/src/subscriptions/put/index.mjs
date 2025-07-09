import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

import {HttpStatusCode, getResponseSuccess, getResponseError} from 'request-response-helpers';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const TABLE = process.env.TABLE_NAME;

export const handler = async (event) => {  
  const username = event.requestContext?.authorizer?.email;
  const now = new Date().toISOString();
  let item;

  // Validate username
  if (!username) {
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Missing path parameter or username")
  }

  // Validate request body and extract the item
  try {
    item = JSON.parse(event.body);
  } catch {    
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Invalid JSON")
  }

  try {
    
    // Fetch existing item 
    const { Item: existingItem } = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { key },
    }));

    // If item exists, update it; otherwise, create a new one
    if (existingItem) {
      Object.keys(existingItem).forEach(prop => {
      if (prop !== 'key') {
        item[prop] = existingItem[prop];
      }
      });
    } else{
      item.subscription_id = uuidv4();
    }
    

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
