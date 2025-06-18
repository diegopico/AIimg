import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../wrappers/response';
//import { environment } from './../../../environments/environment.development';
import { environment } from 'src/environments/environment.prod';

import { IAuthResponse } from './../models/auth-response';
import { IAuthRequest } from './../models/auth-request';
//import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //#tokenHelper: JwtHelperService = new JwtHelperService();
  #tokenKey: string = "access_token"; 
  constructor(private httpClient: HttpClient) { }

  private getHttpHeaders(): HttpHeaders {
    //const selectedLanguage = this.coreService.getLanguageSelect();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      //'Accept-Language': selectedLanguage.code
    });
  }

  login(payload: IAuthRequest): Observable<IAuthResponse> {
    //return this.httpClient.post<IResponse<IAuthResponse>>(`${environment.basePathUrl}/v1/Auth`, payload);
    let url = `${environment.basePathUrl}/Account/ApiLogin?username=${payload.username}&password=${payload.password}`;
    return this.httpClient.post<IAuthResponse>(url, { headers: this.getHttpHeaders() });
  }

  getToken(): string | null {
    return localStorage.getItem(this.#tokenKey) ?? null;
  }

  isTokenExpired(token: string): boolean {
    //return this.#tokenHelper.isTokenExpired(token);
    return false;
  }

  getTokenInfo(token: string): any {
    if (!token) {
      console.log('No token provided to getTokenInfo');
      return null;
    }

    // Verificar si el token tiene el formato básico de JWT (tres partes separadas por puntos)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Token does not have the expected JWT format');
      return null;
    }

    try {
      // Intentar decodificar el token manualmente
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserName(token: string): string {    
    if (!token) return '';
    const tokenInfo = this.getTokenInfo(token);
    return tokenInfo ? tokenInfo["name"] || '' : '';
  }

  getCustomerId(token: string): string {    
    if (!token) return '';
    const tokenInfo = this.getTokenInfo(token);
    return tokenInfo ? tokenInfo["customerid"] || '' : '';
  }


  logoutAndRemoveToken() {
    localStorage.removeItem(this.#tokenKey);
  }

  saveToken(token: string) {
    if (!token) {
      console.error('No token provided');
      return;
    }
    localStorage.setItem(this.#tokenKey, token);
  }  


}



/*
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, fromEvent, merge, Observable, Subscription, BehaviorSubject, of, share } from 'rxjs';
import { catchError, tap, map, finalize } from 'rxjs/operators';
import { IResponse, IValidationErrors } from '../wrappers/response';
import { environment } from './../../../environments/environment.development';
import { IAuthResponse } from './../models/auth-response';
import { IAuthRequest, IRegisterRequest, ITwoFactorRequest, IRefreshTokenRequest } from './../models/auth-request';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './error-handler.service';
import { CoreService } from './core.service';

export declare type TypeUser = 'Tenant Admin' | 'Admin';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenExpires: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenHelper: JwtHelperService = new JwtHelperService();
  private tokenKey: string = "access_token";
  private refreshTokenKey: string = "refresh_token_secure";
  private tokenExpiresKey: string = "token_expires";
  
  private readonly initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    tokenExpires: null
  };

  private authState$ = new BehaviorSubject<AuthState>(this.initialState);
  private refreshingToken = false;
  private refreshTokenObservable$?: Observable<{ success: boolean; data?: IAuthResponse; errors?: IValidationErrors }>;
  private periodicRefreshInterval = 15; // Minutos para refresco periódico
  private periodicRefreshTimer?: any;

  private minutesToMilliseconds = (minutes: number) => minutes * 60000;
  private AUTO_LOGOUT_INTERVAL_WAIT = this.minutesToMilliseconds(30);

  private resetTimerSubscription = new Subscription();
  private inactivityTimerSubscription = new Subscription();
  private refreshTokenSubscription = new Subscription();
  private pauseInactiveListener = new BehaviorSubject<boolean>(false);
  private inactivityTimer?: any;
  private refreshTokenTimer?: any;
  private isLoggedOut = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private coreService: CoreService
  ) {
    this.initializeStore();
    
    // Configurar idioma del manejador de errores
    const selectedLanguage = this.coreService.getLanguageSelect();
    this.errorHandler.setLanguage(selectedLanguage.code);
  }

  private initializeStore(): void {
    const storedAccessToken = localStorage.getItem(this.tokenKey);
    const storedRefreshToken = sessionStorage.getItem(this.refreshTokenKey);
    const storedTokenExpires = localStorage.getItem(this.tokenExpiresKey);
    
    if (storedAccessToken && !this.isTokenExpired(storedAccessToken)) {
      this.updateAuthState({
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        isAuthenticated: true,
        isLoading: false,
        tokenExpires: storedTokenExpires
      });
      
      this.initializeInactiveListener();
    } else {
      this.clearAuthState();
    }
  }

  private updateAuthState(updates: Partial<AuthState>): void {
    const currentState = this.authState$.value;
    const newState = { ...currentState, ...updates };
    this.authState$.next(newState);
    
    if (newState.accessToken) {
      localStorage.setItem(this.tokenKey, newState.accessToken);
    }
    
    if (newState.refreshToken) {
      sessionStorage.setItem(this.refreshTokenKey, newState.refreshToken);
    }
    
    if (newState.tokenExpires) {
      localStorage.setItem(this.tokenExpiresKey, newState.tokenExpires);
    }
  }

  private clearAuthState(): void {
    this.authState$.next(this.initialState);
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.tokenExpiresKey);
  }

  private getHttpHeaders(): HttpHeaders {
    const selectedLanguage = this.coreService.getLanguageSelect();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': selectedLanguage.code
    });
  }

  register(payload: IRegisterRequest): Observable<{ success: boolean; data?: IAuthResponse; errors?: IValidationErrors }> {
    this.updateAuthState({ isLoading: true });
    
    return this.httpClient.post<IResponse<IAuthResponse>>(
      `${environment.basePathUrl}/auth/register`, 
      payload,
      { headers: this.getHttpHeaders() }
    )
      .pipe(
        map(response => {
          if (response.succeeded && response.data) {
            this.updateAuthState({
              accessToken: response.data.AccessToken,
              isAuthenticated: true,
              isLoading: false,
              tokenExpires: response.data.tokenExpires || null
            });
            
            this.isLoggedOut = false;
            this.initializeInactiveListener();
            
            return { success: true, data: response.data };
          } else {
            this.updateAuthState({ isLoading: false });
            const errors = this.errorHandler.processValidationErrors(response.errors || []);
            return { success: false, errors };
          }
        }),
        catchError(error => {
          this.updateAuthState({ isLoading: false });
          const networkError = this.errorHandler.handleNetworkError(error);
          const errors = this.errorHandler.processValidationErrors([{
            code: networkError.type,
            message: networkError.message
          }]);
          return of({ success: false, errors });
        })
      );
  }

  login(payload: IAuthRequest): Observable<{ success: boolean; data?: IAuthResponse; errors?: IValidationErrors }> {
    this.updateAuthState({ isLoading: true });
    let url = `${environment.basePathUrl}/Account/ApiLogin?username=${payload.username}&password=${payload.password}`;
    return this.httpClient.post<IAuthResponse>( url, { headers: this.getHttpHeaders() } )
      .pipe(
        map(response => {
          console.log('AuthService - Login response received:', response);
          if (response.Successful) {
            this.updateAuthState({
              accessToken: response.AccessToken,
              isAuthenticated: true,
              isLoading: false,
            });
            this.isLoggedOut = false;
            
            // Navegar directamente al dashboard después de un login exitoso
            this.router.navigate(['/ia/upload-file-prod']);            
            return { success: true, data: response };
          } else {
            // Login falló con errores del servidor
            this.updateAuthState({ isLoading: false });
            return { 
              success: false, 
              errors: {
                fieldErrors: {},
                generalErrors: [],
                severity: 'error'
              }
            };
          }
        }),
        catchError(error => {
          this.updateAuthState({ isLoading: false });
          // Crear errores basados en el tipo de error HTTP
          let errorCode = 'UNKNOWN_ERROR';
          let errorMessage = this.errorHandler.getMessage('UNKNOWN_ERROR');
          
          if (error.status === 400 || error.status === 401) {
            errorCode = 'INVALID_CREDENTIALS';
            errorMessage = this.errorHandler.getMessage('INVALID_CREDENTIALS');
          } else if (error.status === 403) {
            errorCode = 'ACCOUNT_DISABLED';
            errorMessage = this.errorHandler.getMessage('ACCOUNT_DISABLED');
          } else if (error.status === 0) {
            errorCode = 'NETWORK_OFFLINE';
            errorMessage = this.errorHandler.getMessage('NETWORK_OFFLINE');
          } else if (error.status >= 500) {
            errorCode = 'NETWORK_ERROR';
            errorMessage = this.errorHandler.getMessage('NETWORK_ERROR');
          }
          
          const errors = this.errorHandler.processValidationErrors([{
            code: errorCode,
            message: errorMessage
          }]);
          return of({ success: false, errors });
        })
      );
  }

  verify2FA(payload: ITwoFactorRequest): Observable<{ success: boolean; data?: IAuthResponse; errors?: IValidationErrors }> {
    this.updateAuthState({ isLoading: true });
    
    return this.httpClient.post<IResponse<IAuthResponse>>(
      `${environment.basePathUrl}/auth/verify-2fa`, 
      payload,
      { headers: this.getHttpHeaders() }
    )
      .pipe(
        map(response => {
          if (response.succeeded && response.data) {
            this.updateAuthState({
              accessToken: response.data.AccessToken,
              isAuthenticated: true,
              isLoading: false,
              tokenExpires: response.data.tokenExpires || null
            });
            
            this.isLoggedOut = false;
            this.initializeInactiveListener();
            
            // Navegar al dashboard
            this.router.navigate(['/dashboards/the-agent']);
            
            return { success: true, data: response.data };

          } else {
            this.updateAuthState({ isLoading: false });
            const errors = this.errorHandler.processValidationErrors(response.errors || []);
            return { success: false, errors };
          }
        }),
        catchError(error => {
          this.updateAuthState({ isLoading: false });
          const networkError = this.errorHandler.handleNetworkError(error);
          const errors = this.errorHandler.processValidationErrors([{
            code: networkError.type,
            message: networkError.message
          }]);
          return of({ success: false, errors });
        })
      );
  }


  getToken(): string | null {
    return this.authState$.value.accessToken;
  }

  getTokenExpiration(): Date | null {
    const expiresStr = localStorage.getItem(this.tokenExpiresKey);
    if (!expiresStr) {
      const token = this.getToken();
      return token ? this.tokenHelper.getTokenExpirationDate(token) : null;
    }
    return new Date(expiresStr);
  }

  isTokenExpired(token: string): boolean {
    return this.tokenHelper.isTokenExpired(token);
  }

  getTokenInfo(token: string): any {
    if (!token) {
      console.log('No token provided to getTokenInfo');
      return null;
    }

    // Verificar si el token tiene el formato básico de JWT (tres partes separadas por puntos)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Token does not have the expected JWT format');
      return null;
    }

    try {
      // Intentar decodificar el token manualmente
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserName(token: string): string {
    if (!token) return '';
    const tokenInfo = this.getTokenInfo(token);
    return tokenInfo ? tokenInfo["name"] || '' : '';
  }

  getUserRole(token: string): string {
    return this.getTokenInfo(token) ? this.getTokenInfo(token)["role"] : '';
  }

  getCustomerId(token: string): string {
    if (!token) return '';
    const tokenInfo = this.getTokenInfo(token);
    return tokenInfo ? tokenInfo["customerid"] || '' : '';
  }

  logoutAndRemoveToken(): void {
    this.clearAuthState();
  }

  saveToken(token: string): void {
    // Validate token format before saving
    if (!token || !token.includes('.')) {
      console.error('Invalid token format received:', token);
      return;
    }
    
    try {
      // Try to decode the token to validate it
      const decodedToken = this.#tokenHelper.decodeToken(token);
      if (!decodedToken) {
        console.error('Failed to decode token');
        return;
      }
      
      localStorage.setItem(this.#tokenKey, token);
    } catch (error) {
      console.error('Error validating token:', error);
    }
  }

  initializeInactiveListener(): void {
    // Limpiar cualquier suscripción previa
    this.cleanComponentSubscriptions();

    if (this.isLoggedOut) return;

    // Eventos que consideramos como actividad del usuario
    const mouseMove$ = fromEvent(document, 'mousemove');
    const click$ = fromEvent(document, 'click');
    const keyDown$ = fromEvent(document, 'keydown');
    const scroll$ = fromEvent(document, 'scroll');

    // Combinamos todos los eventos de actividad
    const userActivity$ = merge(mouseMove$, click$, keyDown$, scroll$);

    // Reiniciamos el temporizador cada vez que hay actividad
    this.resetTimerSubscription = userActivity$
      .pipe(
        filter(() => !this.pauseInactiveListener.value && !this.isLoggedOut)
      )
      .subscribe(() => {
        this.resetInactivityTimer();
      });

    // Iniciar el temporizador de inactividad inmediatamente
    this.resetInactivityTimer();
  }

  resetInactivityTimer(): void {
    // Cancelar cualquier temporizador existente
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Configurar un nuevo temporizador
    this.inactivityTimer = setTimeout(() => {
      if (!this.isLoggedOut) {
        console.log('Usuario inactivo por ' + (this.AUTO_LOGOUT_INTERVAL_WAIT / 60000) + ' minutos, cerrando sesión...');
        this.isLoggedOut = true;
        this.logoutAndRemoveToken();
        //this.router.navigate(['/site/home']);
        this.router.navigate([
            {
              outlets: {
                go: '/site/home '
              }
            }
          ]);
      }
    }, this.AUTO_LOGOUT_INTERVAL_WAIT);
  }

  setupTokenExpirationCheck(): void {
    // Obtener el token actual
    const token = this.getToken();
    if (!token) return;

    try {
      // Calcular el tiempo hasta la expiración
      const tokenExpiration = this.getTokenExpiration();
      if (!tokenExpiration) return;

      const now = new Date();
      const timeUntilExpiration = tokenExpiration.getTime() - now.getTime();

      // Si el token ya expiró o expirará en menos de 10 segundos, cerrar sesión inmediatamente
      if (timeUntilExpiration <= 10000) {
        console.log('Token expirado o a punto de expirar');
        this.isLoggedOut = true;
        this.logoutAndRemoveToken();
        //this.router.navigate(['/site/home']);
        this.router.navigate([
            {
              outlets: {
                go: '/site/home '
              }
            }
          ]);
        return;
      }

      // Configurar un temporizador para cerrar sesión justo cuando expire el token
      setTimeout(() => {
        if (!this.isLoggedOut) {
          console.log('Token expirado');
          this.isLoggedOut = true;
          this.logoutAndRemoveToken();
          //this.router.navigate(['/site/home']);
          this.router.navigate([
            {
              outlets: {
                go: '/site/home '
              }
            }
          ]);
        }
      }, timeUntilExpiration - 5000); // 5 segundos antes de que expire
    } catch (error) {
      console.error('Error al verificar la expiración del token:', error);
    }
  }


  public cleanComponentSubscriptions(): void {
    if (this.resetTimerSubscription) {
      this.resetTimerSubscription.unsubscribe();
    }

    if (this.inactivityTimerSubscription) {
      this.inactivityTimerSubscription.unsubscribe();
    }

   
  }


  
  
  isAuthenticatedSync(): boolean {
    const state = this.authState$.value;
    return state.isAuthenticated && !!state.accessToken && !this.isTokenExpired(state.accessToken);
  }

  getCurrentUserSync(): { id: string, name: string, email: string } | null {
    const token = this.authState$.value.accessToken;
    if (!token) return null;

    const tokenInfo = this.getTokenInfo(token);
    if (!tokenInfo) return null;

    return {
      id: tokenInfo.sub || tokenInfo.id || '',
      name: tokenInfo.name || '',
      email: tokenInfo.email || ''
    };
  }

  logout(): void {
    this.clearAuthState();
    this.isLoggedOut = true;
    this.router.navigate([
      {
        outlets: {
          go: '/site/home'
        }
      }
    ]);
  }

  public get authState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  public get isAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(map(state => state.isAuthenticated));
  }

  public get isLoading(): Observable<boolean> {
    return this.authState$.pipe(map(state => state.isLoading));
  }

  public get currentUser(): Observable<{ id: string, name: string, email: string } | null> {
    return this.authState$.pipe(
      map(state => {
        if (!state.accessToken) return null;
        
        const tokenInfo = this.getTokenInfo(state.accessToken);
        if (!tokenInfo) return null;

        return {
          id: tokenInfo.sub || tokenInfo.id || '',
          name: tokenInfo.name || '',
          email: tokenInfo.email || ''
        };
      })
    );
  }
}
*/