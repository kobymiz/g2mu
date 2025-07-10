// src/get/index.js
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { error } from 'console';

import { HttpStatusCode, getResponseSuccess, getResponseError } from 'request-response-helpers';

// Initialize DynamoDB client and DocumentClient
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Define your table and index names
export const TABLE = process.env.TABLE_NAME;

export const handler = async (event) => {
  const { key } = event.pathParameters;
  console.log('Received key:', key);

  try {
    const command = new GetCommand({
      TableName: TABLE,
      Key: { key },
    });
    const { Item } = await docClient.send(command);
    if(!Item) {
      console.error('Short URL not found for key:', key);
      var errorResponse = getResponseError(HttpStatusCode.NOT_FOUND, "Short URL not found");
      errorResponse.headers['Access-Control-Allow-Methods'] = 'GET,OPTIONS';
      errorResponse.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
      console.log('Response:', errorResponse);
      return errorResponse;
    }

    const response = getResponseSuccess(JSON.stringify(Item));
    console.log('Response:', response);
    return response;
    
  } catch (err) {
    console.error(err);
    return getResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR, "Failed to get URL");
  }
};
