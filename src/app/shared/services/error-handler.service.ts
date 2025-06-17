import { Injectable } from '@angular/core';
import { IError, IValidationErrors } from '../wrappers/response';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private currentLanguage = 'es';

  private messages = {
    es: {
      // Errores de campos requeridos
      'FIRST_NAME_REQUIRED': 'El nombre es obligatorio',
      'LAST_NAME_REQUIRED': 'El apellido es obligatorio',
      'EMAIL_REQUIRED': 'El correo electrónico es obligatorio',
      'PASSWORD_REQUIRED': 'La contraseña es obligatoria',
      'COMPANY_NAME_REQUIRED': 'El nombre de la empresa es obligatorio',
      'TERMS_MUST_BE_ACCEPTED': 'Debe aceptar los términos y condiciones',
      
      // Errores de validación
      'EMAIL_INVALID': 'Formato de correo electrónico inválido',
      'EMAIL_ALREADY_EXISTS': 'El correo electrónico ya está registrado',
      'PASSWORD_MIN_LENGTH': 'La contraseña debe tener al menos 8 caracteres',
      'PASSWORD_COMPLEXITY': 'La contraseña debe contener mayúsculas, minúsculas, números y símbolos',
      'PASSWORDS_DONT_MATCH': 'Las contraseñas no coinciden',
      'PHONE_INVALID': 'Formato de teléfono inválido',
      
      // Errores de autenticación
      'INVALID_CREDENTIALS': 'Usuario o contraseña incorrectos',
      'ACCOUNT_DISABLED': 'La cuenta está deshabilitada',
      'TWO_FACTOR_INVALID': 'Código de verificación inválido',
      'REFRESH_TOKEN_EXPIRED': 'La sesión ha expirado',
      
      // Errores generales
      'NETWORK_ERROR': 'Error de conexión con el servidor',
      'NETWORK_OFFLINE': 'No hay conexión a internet',
      'UNKNOWN_ERROR': 'Error inesperado'
    },
    en: {
      // Required field errors
      'FIRST_NAME_REQUIRED': 'First name is required',
      'LAST_NAME_REQUIRED': 'Last name is required',
      'EMAIL_REQUIRED': 'Email is required',
      'PASSWORD_REQUIRED': 'Password is required',
      'COMPANY_NAME_REQUIRED': 'Company name is required',
      'TERMS_MUST_BE_ACCEPTED': 'You must accept the terms and conditions',
      
      // Validation errors
      'EMAIL_INVALID': 'Invalid email format',
      'EMAIL_ALREADY_EXISTS': 'Email is already registered',
      'PASSWORD_MIN_LENGTH': 'Password must be at least 8 characters',
      'PASSWORD_COMPLEXITY': 'Password must contain uppercase, lowercase, numbers and symbols',
      'PASSWORDS_DONT_MATCH': 'Passwords don\'t match',
      'PHONE_INVALID': 'Invalid phone format',
      
      // Authentication errors
      'INVALID_CREDENTIALS': 'Invalid username or password',
      'ACCOUNT_DISABLED': 'Account is disabled',
      'TWO_FACTOR_INVALID': 'Invalid verification code',
      'REFRESH_TOKEN_EXPIRED': 'Session has expired',
      
      // General errors
      'NETWORK_ERROR': 'Connection error with server',
      'NETWORK_OFFLINE': 'No internet connection',
      'UNKNOWN_ERROR': 'Unexpected error'
    }
  };

  setLanguage(language: string): void {
    console.log('ErrorHandler - Setting language from:', this.currentLanguage, 'to:', language);
    if (this.messages[language as keyof typeof this.messages]) {
      this.currentLanguage = language;
      console.log('ErrorHandler - Language set successfully to:', this.currentLanguage);
    } else {
      console.warn('ErrorHandler - Language not supported:', language, 'using default: es');
      this.currentLanguage = 'es';
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  processValidationErrors(errors: IError[] = []): IValidationErrors {
    const fieldErrors: Record<string, IError> = {};
    const generalErrors: IError[] = [];

    errors.forEach(error => {
      const processedError = {
        ...error,
        message: this.getMessage(error.code) || error.message
      };

      if (error.field && error.field !== 'general') {
        fieldErrors[error.field] = processedError;
      } else {
        generalErrors.push(processedError);
      }
    });

    return { fieldErrors, generalErrors };
  }

  getMessage(code: string): string {
    const messages = this.messages[this.currentLanguage as keyof typeof this.messages];
    const message = messages?.[code as keyof typeof messages] || code;
    console.log(`ErrorHandler - getMessage(${code}) in ${this.currentLanguage}:`, message);
    return message;
  }

  getFieldErrorMessage(fieldName: string, errors: IValidationErrors): string {
    return errors.fieldErrors[fieldName]?.message || '';
  }

  hasFieldError(fieldName: string, errors: IValidationErrors): boolean {
    return !!errors.fieldErrors[fieldName];
  }

  getGeneralErrors(errors: IValidationErrors): IError[] {
    return errors.generalErrors || [];
  }

  handleNetworkError(error: any): { type: string; message: string; action: string } {
    if (!navigator.onLine) {
      return {
        type: 'NETWORK_OFFLINE',
        message: this.getMessage('NETWORK_OFFLINE'),
        action: 'retry'
      };
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        type: 'NETWORK_ERROR',
        message: this.getMessage('NETWORK_ERROR'),
        action: 'retry'
      };
    }

    return {
      type: 'UNKNOWN_ERROR',
      message: this.getMessage('UNKNOWN_ERROR'),
      action: 'contact_support'
    };
  }
} 