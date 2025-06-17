import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
//import { NotificationService } from '../services/notification.service';

export const notifyInterceptor: HttpInterceptorFn = (req, next) => {
  //const notificationService = inject(NotificationService);
  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      if(event instanceof HttpResponse && event.status === 201 && req.headers.get("X-Source-Request-Type") === 'createReserve') {        
        //notificationService.showSuccessPopupResult("Reserva creada", "La reserva ha sido creada exitosamente");
      }

      if(event instanceof HttpResponse && event.status === 200 && req.headers.get("X-Source-Request-Type") === 'updateReserve') {        
        //notificationService.showSuccessPopupResult("Reserva actualizada", "La reserva ha sido actualizada exitosamente");
      }

      if(event instanceof HttpResponse && event.status === 201 && req.headers.get("X-Source-Request-Type") === 'createUser') {
        //notificationService.showSuccessPopupResult("Usuario creado", "El usuario ha sido creado exitosamente");
      }
    })
  );
};
