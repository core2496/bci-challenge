import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

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
      'x-rapidapi-key': '760bca4caamsh2ba073fa7762ef6p1a9d3bjsnec00fb097fa5',
      'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
    };

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
