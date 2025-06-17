import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
//import { NotificationService } from '../services/notification.service';

export const validSessionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);
  //const notificationService = inject(NotificationService);

  return next(req).pipe(catchError((e: HttpErrorResponse) => {
    if(e.status === 401) {
      //notificationService.showErrorNotification("Su sesión expiró, ingrese nuevamente");
      
      const tokenInfo = authService.getTokenInfo(token!);  
    if (authService.isTokenExpired(token!) || !tokenInfo || tokenInfo["role"] === "Admin") {
      authService.logoutAndRemoveToken();
      router.navigate(["/admin/login"]);
    } 

    if (authService.isTokenExpired(token!) || tokenInfo["role"] !== "Admin") {
        authService.logoutAndRemoveToken();
        router.navigate(["/app/login"]);
      }
    }

    return throwError(() => e);
  }));
};
