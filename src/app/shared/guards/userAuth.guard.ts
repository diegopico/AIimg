import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const userAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  //console.log('userAuthGuard - Token:', token);
  if(!token) {
    router.navigate(["/site/home"]);//(["/authentication/login"]);
    return false
  };
  
  
  return true;
};
