import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpConfigInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const AUTH_HEADERS = {
      'Access-Control-Allow-Origin': '*',
      'x-rapidapi-key': environment.rapidApi.key,
      'x-rapidapi-host': environment.rapidApi.host,
    };
    debugger
    const reqCloned = req.clone({ setHeaders: AUTH_HEADERS });

 
    return next.handle(reqCloned).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        
        console.log('HTTP Error:', errorMessage);
        return throwError(() => error);
      })
    );
  }
}
