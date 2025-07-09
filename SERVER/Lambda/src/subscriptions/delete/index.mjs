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
  const { key } = event.pathParameters;  
  const username = event.requestContext?.authorizer?.email;    

  // Vallidate key in url path parameters
  if(!key){
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Key is required");
  };  

  // Validate username
  if (!username) {
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Missing path parameter or username")
  }

  try {
    
    // Fetch existing item 
    const { Item: existingItem } = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { key },
    }));

    if(!existingItem) {
      return getResponseError(HttpStatusCode.NOT_FOUND, `No such Subscription`);
    }

    if(existingItem.username !== username) {
      return getResponseError(HttpStatusCode.FORBIDDEN, "You are not allowed to update this subscription");
    }

    existingItem.deleted = true; // Mark as deleted
    existingItem.deletedAt = new Date().getTime();
    existingItem.active = false; // Mark as inactive
    
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
