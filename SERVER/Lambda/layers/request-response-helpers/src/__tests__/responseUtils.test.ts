import { getResponseSuccess, getResponseInternalServerError, getResponseUnAuthorized } from '../responseUtils';
import { HttpStatusCode } from '../models';

describe('responseUtils', () => {
    describe('getResponseSuccess', () => {
        it('should return a success response with status code 200', () => {
            const responseBody = { message: 'Success' };
            const response = getResponseSuccess(responseBody);

            expect(response.statusCode).toBe(HttpStatusCode.OK);
            expect(response.body).toBe(JSON.stringify(responseBody));
            expect(response.headers).toBeDefined();
        });
    });

    describe('getResponseInternalServerError', () => {
        it('should return an internal server error response with status code 500', () => {
            const error = 'Something went wrong';
            const response = getResponseInternalServerError(error);

            expect(response.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
            expect(response.body).toBe(JSON.stringify({ message: 'INTERNAL_SERVER_ERROR', error }));
            expect(response.headers).toBeDefined();
        });
    });

    describe('getResponseUnAuthorized', () => {
        it('should return an unauthorized response with status code 401', () => {
            const error = 'Unauthorized access';
            const response = getResponseUnAuthorized(error);

            expect(response.statusCode).toBe(HttpStatusCode.UNAUTHORIZED);
            expect(response.body).toBe(JSON.stringify({ message: 'UNAUTHORIZED', error }));
            expect(response.headers).toBeDefined();
        });
    });
});