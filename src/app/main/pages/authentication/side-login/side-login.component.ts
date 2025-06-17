import { Component, inject } from '@angular/core';
import { CoreService } from 'src/app/shared/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';

import { IAuthRequest } from 'src/app/shared/models/auth-request';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { listlanguages,LanguageService } from 'src/app/shared/services/language.services';

@Component({
    selector: 'app-side-login',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule,TranslateModule],
    templateUrl: './side-login.component.html'
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();
  readonly #notificationService = inject(NotificationService);
  form: FormGroup;



    constructor(
      private settings: CoreService, 
      private router: Router,
      private _authService: AuthService,
      private _formBuilder: FormBuilder,
      private snackBar: MatSnackBar,
      private translate: TranslateService,
      private languageService:LanguageService
      ) { 

      this.form = this._formBuilder.group({
        username: new FormControl('', [Validators.required, Validators.minLength(6)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      });
    
    }

  
  get f() {
    return this.form.controls;
  }

  
  submit() {
    // console.log(this.form.value);
    //this.router.navigate(['/dashboards/dashboard1']);
    this.onLogin();
  }

  onLogin(): void {
    /*
    const authRequest: IAuthRequest = {
      username: 'admin',
      password: '130433',
    };*/
    //let email: string=this.form.get("uname")?.value;
    //let password=this.form.controls["password"].value;
    console.log(this.form.get("username")?.value);
    const authRequest: IAuthRequest = {
      username: this.form.get("username")?.value,
      password: this.form.get("password")?.value,
    };

    this._authService.login(authRequest).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        if (response.Successful) {
          // Log token format before saving
          console.log('Token format check:', {
            hasToken: !!response.AccessToken,
            tokenLength: response.AccessToken?.length,
            hasDots: response.AccessToken?.includes('.'),
            tokenParts: response.AccessToken?.split('.')?.length
          });
          
          this._authService.saveToken(response.AccessToken);
          this.snackBar.open('Inicio de sesión exitoso', 'Close', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        }
      },
      error: (e) => {
        console.error(e);
        //this.#notificationService.showErrorPopupResult('User or password is wrong');
        this.snackBar.open('Usuario o Contraseña incorrecta', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });

      },
      complete: () => {
        console.log('pasar');
        //this.router.navigate(["/dashboards"]);        
        //this.router.navigate(['/dashboards/dashboard1']);
        this.router.navigate(['/ia/upload-file-prod']);            
      },
    });
  }
}



/*
import { Component, OnDestroy } from '@angular/core';
import { CoreService } from './../../../../shared/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';

import { IAuthRequest, ITwoFactorRequest } from 'src/app/shared/models/auth-request';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { FormValidatorService } from 'src/app/shared/services/form-validator.service';
import { IValidationErrors } from 'src/app/shared/wrappers/response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil, debounceTime } from 'rxjs';

@Component({
    selector: 'app-side-login',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, TranslateModule],
    styleUrls: ['./side-login.component.scss'],
    templateUrl: './side-login.component.html'
})
export class AppSideLoginComponent implements OnDestroy {
  options = this.settings.getOptions();
  form: FormGroup;
  twoFactorForm: FormGroup;
  
  // Estados del componente
  isLoading = false;
  showTwoFactor = false;
  errors: IValidationErrors = { fieldErrors: {}, generalErrors: [] };
  
  // Destrucción del componente
  private destroy$ = new Subject<void>();

  constructor(
      private settings: CoreService, 
      private router: Router,
      private _authService: AuthService,
      private _formBuilder: FormBuilder,
      private snackBar: MatSnackBar,
      private translate: TranslateService,
      private errorHandler: ErrorHandlerService,
      private formValidator: FormValidatorService
      ) { 

      let selectedLanguage = settings.getLanguageSelect();
      console.log('Selected language:', selectedLanguage);
      this.translate.use(selectedLanguage.code);
      this.errorHandler.setLanguage(selectedLanguage.code);
      console.log('ErrorHandler language set to:', this.errorHandler.getCurrentLanguage());

      this.form = this._formBuilder.group({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      });

      this.twoFactorForm = this._formBuilder.group({
        code: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)])
      });

      // Validación en tiempo real
      this.setupRealTimeValidation();
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRealTimeValidation(): void {
    // Validación en tiempo real para el formulario principal
    Object.keys(this.form.controls).forEach(fieldName => {
      this.form.get(fieldName)?.valueChanges
        .pipe(
          debounceTime(300),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.validateField(fieldName);
        });
    });

    // Validación en tiempo real para el formulario 2FA
    this.twoFactorForm.get('code')?.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.validateTwoFactorField('code');
      });
  }

  private validateField(fieldName: string): void {
    const value = this.form.get(fieldName)?.value;
    const formData = this.form.value;
    const fieldErrors = this.formValidator.validateField(fieldName, value, formData);
    
    if (fieldErrors.length > 0) {
      this.errors.fieldErrors[fieldName] = fieldErrors[0];
    } else {
      delete this.errors.fieldErrors[fieldName];
    }
  }

  private validateTwoFactorField(fieldName: string): void {
    const value = this.twoFactorForm.get(fieldName)?.value;
    
    if (fieldName === 'code' && value && !/^\d{6}$/.test(value)) {
      this.errors.fieldErrors[fieldName] = {
        code: 'TWO_FACTOR_INVALID',
        field: fieldName,
        message: this.errorHandler.getMessage('TWO_FACTOR_INVALID')
      };
    } else {
      delete this.errors.fieldErrors[fieldName];
    }
  }

  get f() {
    return this.form.controls;
  }

  get tf() {
    return this.twoFactorForm.controls;
  }

  hasFieldError(fieldName: string): boolean {
    return this.errorHandler.hasFieldError(fieldName, this.errors);
  }

  getFieldErrorMessage(fieldName: string): string {
    return this.errorHandler.getFieldErrorMessage(fieldName, this.errors);
  }

  getGeneralErrors(): any[] {
    return this.errorHandler.getGeneralErrors(this.errors);
  }

  submit(): void {
      this.onLogin();
  }

  onLogin(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isLoading = true;
    this.clearErrors();

    const authRequest: IAuthRequest = {
      username: this.form.get("username")?.value,
      password: this.form.get("password")?.value
    };

    this._authService.login(authRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.success) {
            this.showMessage('Inicio de sesión exitoso', 'success');
          } else if (response.errors) {
            this.errors = response.errors;
            this.showGeneralErrors();
            
            // Si hay errores de credenciales, mostrar mensaje específico
            const hasCredentialError = this.errors.generalErrors.some(
              error => error.code === 'INVALID_CREDENTIALS'
            );
            
            if (hasCredentialError) {
              this.showMessage('Usuario o contraseña incorrectos', 'error');
            } else if (this.errors.generalErrors.length === 0) {
              this.showMessage('Usuario o contraseña incorrectos', 'error');
            }
          } else {
            // Fallback para respuestas sin success ni errors
            this.showMessage('Usuario o contraseña incorrectos', 'error');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en login:', error);
          
          // Manejo específico para diferentes tipos de errores HTTP
          if (error.status === 400) {
            this.showMessage('Datos de login inválidos. Verifica tu username y contraseña.', 'error');
          } else if (error.status === 401) {
            this.showMessage('Usuario o contraseña incorrectos', 'error');
          } else if (error.status === 403) {
            this.showMessage('Acceso denegado. Tu cuenta puede estar deshabilitada.', 'error');
          } else if (error.status === 429) {
            this.showMessage('Demasiados intentos. Espera unos minutos antes de intentar de nuevo.', 'error');
          } else if (error.status >= 500) {
            this.showMessage('Error del servidor. Inténtalo más tarde.', 'error');
          } else if (error.status === 0) {
            this.showMessage('Sin conexión a internet. Verifica tu conexión.', 'error');
          } else {
            this.showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
          }
        }
      });
  }


  goBackToLogin(): void {
    this.showTwoFactor = false;
    this.twoFactorForm.reset();
    this.clearErrors();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  private clearErrors(): void {
    this.errors = { fieldErrors: {}, generalErrors: [] };
  }

  private showGeneralErrors(): void {
    const generalErrors = this.getGeneralErrors();
    console.log('Component - General errors to show:', generalErrors);
    if (generalErrors.length > 0) {
      const errorMessage = generalErrors.map(e => e.message).join(', ');
      console.log('Component - Showing error message:', errorMessage);
      this.showMessage(errorMessage, 'error');
    } else {
      console.log('Component - No general errors found, showing default message');
      this.showMessage('Usuario o contraseña incorrectos', 'error');
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    console.log(`Component - Showing ${type} message:`, message);
    
    // Configuración de estilos según el tipo
    let panelClass: string[] = [];
    let action = 'Cerrar';
    
    switch (type) {
      case 'success':
        panelClass = ['snackbar-success'];
        break;
      case 'error':
        panelClass = ['snackbar-error'];
        break;
      case 'info':
        panelClass = ['snackbar-info'];
        break;
    }
    
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: panelClass
    });
  }

  // Métodos de utilidad para la vista
  getPasswordStrength(): { score: number; feedback: string[] } {
    const password = this.form.get('password')?.value || '';
    return this.formValidator.getPasswordStrength(password);
  }

  isPasswordStrong(): boolean {
    const password = this.form.get('password')?.value || '';
    return this.formValidator.isPasswordStrong(password);
  }
}
*/