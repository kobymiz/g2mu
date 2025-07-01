// lambda-layer/nodejs/requestUtils.mjs

import { AuthData } from './models';

export const getRequestAuthData = (event: any): AuthData => {
    const token = event?.requestContext?.authorizer?.token;

    if (!token) {
        throw new Error("Token is required inside authorizer in request context");
    }

    // Convert the token from String to JSON
    const tokenData = JSON.parse(token);    

    // Extract authorization data from the event
    var authData = {
        roles: JSON.parse(tokenData.user_roles) || [],
        username: tokenData.corp_username || '',
        email: tokenData.email || ''
    };    

    return authData;
};

export const getRequestBody = (event: any) => {
    const body = event?.body    

    if (!body) {
        throw new Error("body is required inside event");
    }
    
    var bodyData = JSON.parse(body);        
    
    return bodyData;
};

export const getQueryStringParams = (event: any) => {
    const params = event?.queryStringParameters    
    console.log(params);
    
    if (!params) {
        throw new Error("queryStringParameters is required inside event");
    }    
    
    return params;   
};