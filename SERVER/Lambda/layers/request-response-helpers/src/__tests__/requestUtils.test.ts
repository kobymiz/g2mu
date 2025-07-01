// lambda-layer/nodejs/__tests__/requestUtils.test.ts

import { getRequestAuthData, getRequestBody, getQueryStringParams } from '../requestUtils';
import { AuthData } from '../models';

const event = {
    resource: '/scorecard/item',
    path: '/scorecard/item',
    httpMethod: 'POST',
    headers: {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Authorization: 'Bearer eyJraWQiOiI1QUYxbUx5XC8zM0Q5V3pDbGN1WUFoakRLOW5oSTBTY2xZWWJRMkRFMEp1dz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoieUFfUGFNZXJ0OUNfVXhVNFItRlRBdyIsInN1YiI6ImQyMDlmNmNlLTJlYjMtNGU5Yi1iOTI5LWU2NmRjZWM4ZGUwYSIsImNvZ25pdG86Z3JvdXBzIjpbInVzLXdlc3QtMl9nRmtDeXMweHBfdG93ZXJBZEF6dXJlUHJvdmlkZXIiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9nRmtDeXMweHAiLCJjb2duaXRvOnVzZXJuYW1lIjoidG93ZXJhZGF6dXJlcHJvdmlkZXJfa29ieW1pekB0b3dlcnNlbWkuY29tIiwidXNlcl9yb2xlcyI6IltdIiwidXNlcl9wcm9maWxlIjoiSVQgQWRtaW4iLCJvcmlnaW5fanRpIjoiMTQwZjgwNjAtNWE2MC00NjgwLTljYTgtNDllZWM0MzIxNjZjIiwiY29ycF91c2VybmFtZSI6Imlrb21taCIsImF1ZCI6IjNnYzI5bWk0NWczbml1a2Z1MnNiOXRlZXU0IiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoia29ieW1pekB0b3dlcnNlbWkuY29tIiwicHJvdmlkZXJOYW1lIjoidG93ZXJBZEF6dXJlUHJvdmlkZXIiLCJwcm92aWRlclR5cGUiOiJTQU1MIiwiaXNzdWVyIjoiaHR0cHM6XC9cL3N0cy53aW5kb3dzLm5ldFwvNGExMWIwMDgtY2M4NC00OWM4LTgyYWItNzI0ODZiNzA4MTVlXC8iLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTcyMDUzMTkxOTM3NCJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MjIzMzY0MDcsImV4cCI6MTcyMjQ5ODQ0MiwiaWF0IjoxNzIyNDk0ODUzLCJqdGkiOiJjZGQ0NGFlMC1hYWU2LTRiNzQtOWEzMS1lMjMyYzU1OTM5MTkiLCJlbWFpbCI6ImtvYnltaXpAdG93ZXJzZW1pLmNvbSJ9.u5sDZ8II3Wqn7q2afrDfRNmBUq8rwyBwLlzFd6OQzFbZOfSZydqIcip0hY3c3EE5iqq05oWE_gi3BN31wyl9HAeAPpi8ZZn4NJlaRZu5liwvVB8oQzt0MXCBGycRIR4GNgtEVAY4HohbGuB3W5fPybqyrh0gJXlEbC5loAq8czqglONRGI4x5nlTy_DFN_VS1ZVICq91vdO_tA6CloaA5gWDB3NON_kGUg82TON8YZvizb6BrYcSUTok2hPIkFHuzBQ9wJ22QD_U2vW2uqGKQmyXL7egAtBqqLatB8RnMCTxAPHU61c9ElvQOwdWKNMOdrCZYQecndWjTjxwFFBLkw',
      'CloudFront-Forwarded-Proto': 'https',
      'CloudFront-Is-Desktop-Viewer': 'true',
      'CloudFront-Is-Mobile-Viewer': 'false',
      'CloudFront-Is-SmartTV-Viewer': 'false',
      'CloudFront-Is-Tablet-Viewer': 'false',
      'CloudFront-Viewer-ASN': '1680',
      'CloudFront-Viewer-Country': 'IL',
      'Content-Type': 'application/json',
      Host: 'xl5idl01ie.execute-api.us-west-2.amazonaws.com',
      'Postman-Token': 'a31b6c32-2dc4-4632-9df2-1b8323f2300c',
      'User-Agent': 'PostmanRuntime/7.26.8',
      Via: '1.1 ab5a0b129a46042ccb6b286f29e7940c.cloudfront.net (CloudFront)',
      'X-Amz-Cf-Id': 'SPloF_OO_GwovB3LgQpR08i_VuIgOt3_SoD8hSWbiWN5PCJqcX0oVQ==',
      'X-Amzn-Trace-Id': 'Root=1-66ab3149-41f86ec7330ec23f4bfc4d6f',
      'X-Forwarded-For': '93.172.219.106, 130.176.1.83',
      'X-Forwarded-Port': '443',
      'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
      Accept: [ '*/*' ],
      'Accept-Encoding': [ 'gzip, deflate, br' ],
      Authorization: [
        'Bearer eyJraWQiOiI1QUYxbUx5XC8zM0Q5V3pDbGN1WUFoakRLOW5oSTBTY2xZWWJRMkRFMEp1dz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoieUFfUGFNZXJ0OUNfVXhVNFItRlRBdyIsInN1YiI6ImQyMDlmNmNlLTJlYjMtNGU5Yi1iOTI5LWU2NmRjZWM4ZGUwYSIsImNvZ25pdG86Z3JvdXBzIjpbInVzLXdlc3QtMl9nRmtDeXMweHBfdG93ZXJBZEF6dXJlUHJvdmlkZXIiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9nRmtDeXMweHAiLCJjb2duaXRvOnVzZXJuYW1lIjoidG93ZXJhZGF6dXJlcHJvdmlkZXJfa29ieW1pekB0b3dlcnNlbWkuY29tIiwidXNlcl9yb2xlcyI6IltdIiwidXNlcl9wcm9maWxlIjoiSVQgQWRtaW4iLCJvcmlnaW5fanRpIjoiMTQwZjgwNjAtNWE2MC00NjgwLTljYTgtNDllZWM0MzIxNjZjIiwiY29ycF91c2VybmFtZSI6Imlrb21taCIsImF1ZCI6IjNnYzI5bWk0NWczbml1a2Z1MnNiOXRlZXU0IiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoia29ieW1pekB0b3dlcnNlbWkuY29tIiwicHJvdmlkZXJOYW1lIjoidG93ZXJBZEF6dXJlUHJvdmlkZXIiLCJwcm92aWRlclR5cGUiOiJTQU1MIiwiaXNzdWVyIjoiaHR0cHM6XC9cL3N0cy53aW5kb3dzLm5ldFwvNGExMWIwMDgtY2M4NC00OWM4LTgyYWItNzI0ODZiNzA4MTVlXC8iLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTcyMDUzMTkxOTM3NCJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MjIzMzY0MDcsImV4cCI6MTcyMjQ5ODQ0MiwiaWF0IjoxNzIyNDk0ODUzLCJqdGkiOiJjZGQ0NGFlMC1hYWU2LTRiNzQtOWEzMS1lMjMyYzU1OTM5MTkiLCJlbWFpbCI6ImtvYnltaXpAdG93ZXJzZW1pLmNvbSJ9.u5sDZ8II3Wqn7q2afrDfRNmBUq8rwyBwLlzFd6OQzFbZOfSZydqIcip0hY3c3EE5iqq05oWE_gi3BN31wyl9HAeAPpi8ZZn4NJlaRZu5liwvVB8oQzt0MXCBGycRIR4GNgtEVAY4HohbGuB3W5fPybqyrh0gJXlEbC5loAq8czqglONRGI4x5nlTy_DFN_VS1ZVICq91vdO_tA6CloaA5gWDB3NON_kGUg82TON8YZvizb6BrYcSUTok2hPIkFHuzBQ9wJ22QD_U2vW2uqGKQmyXL7egAtBqqLatB8RnMCTxAPHU61c9ElvQOwdWKNMOdrCZYQecndWjTjxwFFBLkw'
      ],
      'CloudFront-Forwarded-Proto': [ 'https' ],
      'CloudFront-Is-Desktop-Viewer': [ 'true' ],
      'CloudFront-Is-Mobile-Viewer': [ 'false' ],
      'CloudFront-Is-SmartTV-Viewer': [ 'false' ],
      'CloudFront-Is-Tablet-Viewer': [ 'false' ],
      'CloudFront-Viewer-ASN': [ '1680' ],
      'CloudFront-Viewer-Country': [ 'IL' ],
      'Content-Type': [ 'application/json' ],
      Host: [ 'xl5idl01ie.execute-api.us-west-2.amazonaws.com' ],
      'Postman-Token': [ 'a31b6c32-2dc4-4632-9df2-1b8323f2300c' ],
      'User-Agent': [ 'PostmanRuntime/7.26.8' ],
      Via: [
        '1.1 ab5a0b129a46042ccb6b286f29e7940c.cloudfront.net (CloudFront)'
      ],
      'X-Amz-Cf-Id': [ 'SPloF_OO_GwovB3LgQpR08i_VuIgOt3_SoD8hSWbiWN5PCJqcX0oVQ==' ],
      'X-Amzn-Trace-Id': [ 'Root=1-66ab3149-41f86ec7330ec23f4bfc4d6f' ],
      'X-Forwarded-For': [ '93.172.219.106, 130.176.1.83' ],
      'X-Forwarded-Port': [ '443' ],
      'X-Forwarded-Proto': [ 'https' ]
    },
    queryStringParameters: { id: 'eeb40756-1b2a-4493-ba5d-d8380674719d' },
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
      resourceId: 'l34ma9',
      authorizer: {
        principalId: 'toweradazureprovider_kobymiz@towersemi.com',
        integrationLatency: 623,
        token: '{"at_hash":"yA_PaMert9C_UxU4R-FTAw","sub":"d209f6ce-2eb3-4e9b-b929-e66dcec8de0a","cognito:groups":["us-west-2_gFkCys0xp_towerAdAzureProvider"],"email_verified":false,"iss":"https://cognito-idp.us-west-2.amazonaws.com/us-west-2_gFkCys0xp","cognito:username":"toweradazureprovider_kobymiz@towersemi.com","user_roles":"[]","user_profile":"IT Admin","origin_jti":"140f8060-5a60-4680-9ca8-49eec432166c","corp_username":"ikommh","aud":"3gc29mi45g3niukfu2sb9teeu4","identities":[{"userId":"kobymiz@towersemi.com","providerName":"towerAdAzureProvider","providerType":"SAML","issuer":"https://sts.windows.net/4a11b008-cc84-49c8-82ab-72486b70815e/","primary":"true","dateCreated":"1720531919374"}],"token_use":"id","auth_time":1722336407,"exp":1722498442,"iat":1722494853,"jti":"cdd44ae0-aae6-4b74-9a31-e232c5593919","email":"kobymiz@towersemi.com"}'
      },
      resourcePath: '/scorecard/item',
      httpMethod: 'POST',
      extendedRequestId: 'b0SjhGwbPHcEflw=',
      requestTime: '01/Aug/2024:06:55:05 +0000',
      path: '/dev/scorecard/item',
      accountId: '905418223141',
      protocol: 'HTTP/1.1',
      stage: 'dev',
      domainPrefix: 'xl5idl01ie',
      requestTimeEpoch: 1722495305477,
      requestId: '3117df26-e405-4c69-b378-861ae1c9fbb6',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: '93.172.219.106',
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'PostmanRuntime/7.26.8',
        user: null
      },
      domainName: 'xl5idl01ie.execute-api.us-west-2.amazonaws.com',
      deploymentId: 'xu5lj4',
      apiId: 'xl5idl01ie'
    },
    body: '{\r\n' +
      '    "id": "",\r\n' +
      '    "name":"Dummy ScoreCard",\r\n' +
      '    "supplier": "00001112312",\r\n' +
      '    "dueDate": "28-Aug-2024",\r\n' +
      '    "status": "Not Started",\r\n' +
      '    "createdBy": "ikommh",\r\n' +
      '    "createdAt": "1-Aug-2024 00:22:31.111"\r\n' +
      '}',
    isBase64Encoded: false
  }

describe('getRequestAuthData', () => {
    it('should return AuthData object when token is present', () => {          
        const expected: AuthData = {
            roles: [],
            username: 'ikommh',
            email: 'kobymiz@towersemi.com'
        };

        const result = getRequestAuthData(event);
        expect(result).toEqual(expected);
    });

    it('should throw an error when token is missing', () => {
        const event = {
            requestContext: {
                authorizer: {}
            }
        };

        expect(() => getRequestAuthData(event)).toThrow("Token is required inside authorizer in request context");
    });
});

describe('getRequestBody', () => {
  it('should return Body object when body is present', () => {          
      const expected = {
        "id": "",
        "name":"Dummy ScoreCard",
        "supplier": "00001112312",
        "dueDate": "28-Aug-2024",
        "status": "Not Started",
        "createdBy": "ikommh",
        "createdAt": "1-Aug-2024 00:22:31.111"
    }

      const result = getRequestBody(event);
      expect(result).toEqual(expected);
  });

  it('should throw an error when body is missing', () => {
      const event = {          
      };

      expect(() => getRequestBody(event)).toThrow("body is required inside event");
  });
});

  describe('getQueryStringParams', () => {
    it('should return Query String object when query string parameters is present', () => {          
        const expected = {
          "id": "eeb40756-1b2a-4493-ba5d-d8380674719d"
      }
  
        const result = getQueryStringParams(event);
        expect(result).toEqual(expected);
    });
  
    it('should throw an error when queryStringParameter is missing', () => {
        const event = {          
        };
  
        expect(() => getQueryStringParams(event)).toThrow("queryStringParameters is required inside event");
    });
});