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
    const key= '760bca4caamsh2ba073fa7762ef6p1a9d3bjsnec00fb097fa5';
    const host='real-time-amazon-data.p.rapidapi.com';
    console.log('environment', environment.rapidApi.key);
    const AUTH_HEADERS = {
      'Access-Control-Allow-Origin': '*',
      'x-rapidapi-key': key,
      'x-rapidapi-host': host,
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
