// src/get/index.js
import { docClient, TABLE } from '../shared.js';

export const handler = async (event) => {
  const { key } = event.pathParameters;
  const username = event.requestContext.authorizer.username;

  try {
    const { Item } = await docClient.get({
      TableName: TABLE,
      Key: { key }
    }).promise();

    if (!Item) {
      return { statusCode: 404, body: 'Not found' };
    }
    if (Item.username !== username) {
      return { statusCode: 403, body: 'Forbidden' };
    }

    return { statusCode: 200, body: JSON.stringify(Item) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Internal server error' };
  }
};
