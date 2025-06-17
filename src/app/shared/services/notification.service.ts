import { Injectable } from '@angular/core';
//import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  /* #alertSystem = Swal;
  #toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: '',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
});

  showSuccessPopupResult(title: string, message: string): void {
    this.#alertSystem.fire({
      title: title,
      text: message,
      icon: "success",
      confirmButtonText: "Ok",
      allowOutsideClick: true,
    });
  }

  showErrorPopupResult(errorMessage: string): void {
    this.#alertSystem.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Ok",
      allowOutsideClick: true,
    });
  }
  
  showSuccessNotification(title: string, message?: string) {
    this.#toast.fire({
        icon: 'success',
        title: title,
        text: message
    });
  }

  showErrorNotification(title: string, message?: string) {
    this.#toast.fire({
        icon: 'error',
        title: title,
        text: message
    });
  }
    */
}
