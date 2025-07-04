// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import * as Auth from '@aws-amplify/auth';

/**
 * Intercepts all outgoing HTTP requests and injects
 * a Cognito JWT Bearer token in the Authorization header.
 */
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {  
    return from(Auth.fetchAuthSession()).pipe(
      switchMap(session => {
        
        const token = session.tokens?.idToken;
        // Clone the request and set the Authorization header
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });        
        return next.handle(authReq);
      }),
      catchError(error => {
        return next.handle(req);
      })
    )
  }
}

/**
 * Provides the interceptor as HTTP_INTERCEPTOR
 */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
