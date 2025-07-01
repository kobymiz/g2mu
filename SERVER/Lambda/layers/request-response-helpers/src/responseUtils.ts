// lambda-layer/nodejs/responseUtils.mjs
import { ResponseData,HttpStatusCode } from "./models";

export const getResponseSuccess = (responseBody:any):ResponseData => {
    
    return {
        headers: getResponseHeaders(),
        statusCode: HttpStatusCode.OK,
        body: responseBody
    };
};

export const getResponseInternalServerError = (error: string) => {
    return getResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR, error);
};

export const getResponseUnAuthorized = (error:string) => {
    return getResponseError(HttpStatusCode.UNAUTHORIZED, error);
};

export const getResponseForbidden = (error:string) => {
    return getResponseError(HttpStatusCode.FORBIDDEN, error);
};

export const getResponseNotFound = (error:string) => {
    return getResponseError(HttpStatusCode.NOT_FOUND, error);
};

export const getResponseError = (statusCode: HttpStatusCode, error: string) => {
    return {
        headers: getResponseHeaders(),
        statusCode: statusCode,
        body: JSON.stringify({ message: HttpStatusCode[statusCode], error })
    };
}

const getResponseHeaders = (): any => {
    return {
        "Access-Control-Allow-Origin": "*"
    }
}