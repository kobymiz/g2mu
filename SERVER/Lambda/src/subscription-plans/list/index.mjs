// src/list/index.js
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

import { HttpStatusCode, getResponseSuccess, getResponseError } from 'request-response-helpers';

// Initialize DynamoDB client and DocumentClient
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Define your table and index names
export const TABLE = process.env.TABLE_NAME;

export const handler = async (event) => {    

  try {
    const command = new ScanCommand({    
      TableName: TABLE,
    });

    const {Items} = await docClient.send(command);

    const response = getResponseSuccess(JSON.stringify(Items));
    console.log('Response:', response);
    return response;
    
  } catch (err) {
    console.error(err);
    return getResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR, "Failed to list Subscription Plans");
  }
};
