// src/delete/index.js
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import {HttpStatusCode, getResponseSuccess, getResponseError} from 'request-response-helpers';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const TABLE = process.env.TABLE_NAME;

export const handler = async (event) => {
  const { key } = event.pathParameters;
  const username = event.requestContext.authorizer.email;

  console.log("Input:", {key, username});

  if (!key || !username) {
    return getResponseError(HttpStatusCode.BAD_REQUEST, "Missing path parameter or username")
  }

  try {       
    const command= new DeleteCommand({
      TableName: TABLE,
      Key: {
        key: key,
      },
      ConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    });

    await docClient.send(command);    
    const response = getResponseSuccess(JSON.stringify(''));
    console.log('Response:', response);
    return response;        
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      if (!key || !username) {
        return getResponseError(HttpStatusCode.FORBIDDEN, "URL Not exists or you do not have permission to delete this URL");      
      }
    }
    console.error(err);
    return getResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR, "Internal server error");
  }
}
