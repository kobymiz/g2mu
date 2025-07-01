// src/shared.js
import AWS from 'aws-sdk';

export const docClient = new AWS.DynamoDB.DocumentClient();
export const TABLE = process.env.TABLE_NAME;
export const USER_IDX = process.env.USERNAME_INDEX; // only used by list
