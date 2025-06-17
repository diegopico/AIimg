import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verificar si hay un token y si está expirado antes de la solicitud
    const token = this.authService.getToken();
    if (token && this.authService.isTokenExpired(token)) {
      console.log('Token expirado detectado antes de la solicitud. Cerrando sesión...');
      this.authService.logoutAndRemoveToken();
      this.router.navigate(['/site/home']);
      return throwError(() => new Error('Token expirado'));
    }
    
    return next.handle(request).pipe(
      tap({
        error: (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              console.log('Error 401 detectado. Cerrando sesión...');
              this.authService.logoutAndRemoveToken();
              this.router.navigate(['/site/home']);
            }
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Detectar errores de autenticación (401) o token expirado
        if (error.status === 401) {
          console.log('Error de autenticación detectado. Cerrando sesión...');
          // Cerrar sesión y redirigir
          this.authService.logoutAndRemoveToken();
          this.router.navigate(['/site/home']);
        } else if (error.status === 403) {
          console.log('Acceso prohibido (403). Posible problema de permisos.');
          // Opcional: redirigir a una página de acceso denegado
        }
        return throwError(() => error);
      })
    );
  }
}

// Exportar la función del interceptor compatible con el nuevo formato de Angular
export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Verificar si hay un token y si está expirado antes de la solicitud
  const token = authService.getToken();
  if (token && authService.isTokenExpired(token)) {
    console.log('Token expirado detectado antes de la solicitud. Cerrando sesión...');
    authService.logoutAndRemoveToken();
    router.navigate(['/site/home']);
    return throwError(() => new Error('Token expirado'));
  }
  
  return next(req).pipe(
    tap({
      error: (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.log('Error 401 detectado. Cerrando sesión...');
            authService.logoutAndRemoveToken();
            router.navigate(['/site/home']);
          }
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Detectar errores de autenticación (401) o token expirado
      if (error.status === 401) {
        console.log('Error de autenticación detectado. Cerrando sesión...');
        // Cerrar sesión y redirigir
        authService.logoutAndRemoveToken();
        router.navigate(['/site/home']);
      } else if (error.status === 403) {
        console.log('Acceso prohibido (403). Posible problema de permisos.');
        // Opcional: redirigir a una página de acceso denegado
      }
      return throwError(() => error);
    })
  );
};