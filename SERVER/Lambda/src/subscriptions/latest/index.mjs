// src/list/index.js
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

import { HttpStatusCode, getResponseSuccess, getResponseError } from 'request-response-helpers';

// Initialize DynamoDB client and DocumentClient
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Define your table and index names
const TABLE = process.env.TABLE_NAME;
const USER_IDX = process.env.USERNAME_INDEX;

export const handler = async (event) => {
  const username = event.requestContext.authorizer.email;
  if(!username) {
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Username is required");
  };

  try {
    const command = new QueryCommand({
      TableName: TABLE,
      IndexName: USER_IDX,
      KeyConditionExpression: 'username = :u',
      ExpressionAttributeValues: { ':u': username }
    });

    const {Items} = await docClient.send(command);

    if(Items.length === 0) {
      return getResponseError(HttpStatusCode.NOT_FOUND, "No subscriptions found for this user");
    }
    
    // Sort Items by createdDate ascending and take the earliest item
    const earliestItem = (Items || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];

    const response = getResponseSuccess(JSON.stringify(earliestItem));
    console.log('Response:', response);
    return response;
    
  } catch (err) {
    console.error(err);
    return getResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR, "Failed to get the latest subscription");
  }
};
