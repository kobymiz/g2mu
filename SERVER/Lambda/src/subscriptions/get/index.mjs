import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,  
} from '@aws-sdk/lib-dynamodb';

import { HttpStatusCode, getResponseSuccess, getResponseError } from 'request-response-helpers';

// Initialize DynamoDB client and DocumentClient
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const TABLE = process.env.TABLE_NAME;

export const handler = async (event) => {
  const { key } = event.pathParameters;  

  if(!key){
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Key is required");
  };

  try {
      const command = new GetCommand({
        TableName: TABLE,       
        Key: { subscription_id: key }         
      });
  
      const {item} = await docClient.send(command);
      if(!item){
        return getResponseError(HttpStatusCode.NOT_FOUND, `Item with key ${key} not found`);
      }
      const response = getResponseSuccess(JSON.stringify(item));
      console.log('Response:', response);
      return response;
      
    } catch (err) {
      console.error(err);
      return getResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR, "Failed to get Subscription");
    }
};
