
export interface AuthData {
  roles: string[];
  username: string;
  email: string;
}

export interface ResponseData{
  headers: any;
  statusCode: HttpStatusCode
  body: any
}

// httpStatusCodes.ts

export enum HttpStatusCode {  
  // 2xx Success
  OK = 200,  
  // 4xx Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,  
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,  
  REQUEST_TIMEOUT = 408,    
  PAYLOAD_TOO_LARGE = 413,        
  TOO_MANY_REQUESTS = 429,  

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511
}