import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('🔴 Error capturado por interceptor:', error);

      if (error.status === 401) {
        console.warn('⚠️ No autorizado (401)');
      } else if (error.status === 0) {
        console.warn('⚠️ Sin conexión con el servidor');
      }

      return throwError(() => error);
    })
  );
};