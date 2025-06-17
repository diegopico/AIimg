import { Injectable } from '@angular/core';
import { IError } from '../wrappers/response';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorService {
  private rules = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    phone: /^\+?[0-9]{10,15}$/,
    employeeCount: /^(1-10|11-50|51-200|201-1000|1001-5000|5000\+)$/
  };

  constructor(private errorHandler: ErrorHandlerService) {}

  validateField(fieldName: string, value: any, formData: any = {}): IError[] {
    const errors: IError[] = [];

    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        if (!value || value.toString().trim().length < 2) {
          errors.push({
            code: `${fieldName.toUpperCase()}_REQUIRED`,
            field: fieldName,
            message: this.errorHandler.getMessage(`${fieldName.toUpperCase()}_REQUIRED`)
          });
        }
        break;

      case 'email':
        if (!value) {
          errors.push({
            code: 'EMAIL_REQUIRED',
            field: fieldName,
            message: this.errorHandler.getMessage('EMAIL_REQUIRED')
          });
        } else if (!this.rules.email.test(value)) {
          errors.push({
            code: 'EMAIL_INVALID',
            field: fieldName,
            message: this.errorHandler.getMessage('EMAIL_INVALID')
          });
        }
        break;

      case 'password':
        if (!value) {
          errors.push({
            code: 'PASSWORD_REQUIRED',
            field: fieldName,
            message: this.errorHandler.getMessage('PASSWORD_REQUIRED')
          });
        } else if (value.length < 8) {
          errors.push({
            code: 'PASSWORD_MIN_LENGTH',
            field: fieldName,
            message: this.errorHandler.getMessage('PASSWORD_MIN_LENGTH')
          });
        } else if (!this.rules.password.test(value)) {
          errors.push({
            code: 'PASSWORD_COMPLEXITY',
            field: fieldName,
            message: this.errorHandler.getMessage('PASSWORD_COMPLEXITY')
          });
        }
        break;

      case 'confirmPassword':
        if (value !== formData.password) {
          errors.push({
            code: 'PASSWORDS_DONT_MATCH',
            field: fieldName,
            message: this.errorHandler.getMessage('PASSWORDS_DONT_MATCH')
          });
        }
        break;

      case 'phoneNumber':
        if (value && !this.rules.phone.test(value)) {
          errors.push({
            code: 'PHONE_INVALID',
            field: fieldName,
            message: this.errorHandler.getMessage('PHONE_INVALID')
          });
        }
        break;

      case 'companyName':
        if (!value || value.toString().trim().length < 2) {
          errors.push({
            code: 'COMPANY_NAME_REQUIRED',
            field: fieldName,
            message: this.errorHandler.getMessage('COMPANY_NAME_REQUIRED')
          });
        }
        break;

      case 'termsAccepted':
        if (!value) {
          errors.push({
            code: 'TERMS_MUST_BE_ACCEPTED',
            field: fieldName,
            message: this.errorHandler.getMessage('TERMS_MUST_BE_ACCEPTED')
          });
        }
        break;
    }

    return errors;
  }

  validateForm(formData: any): Record<string, IError> {
    const allErrors: Record<string, IError> = {};
    
    Object.keys(formData).forEach(field => {
      const fieldErrors = this.validateField(field, formData[field], formData);
      if (fieldErrors.length > 0) {
        allErrors[field] = fieldErrors[0]; // Solo mostrar el primer error
      }
    });

    return allErrors;
  }

  isEmailValid(email: string): boolean {
    return this.rules.email.test(email);
  }

  isPasswordStrong(password: string): boolean {
    return this.rules.password.test(password);
  }

  getPasswordStrength(password: string): { score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Mínimo 8 caracteres');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Al menos una letra minúscula');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Al menos una letra mayúscula');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Al menos un número');
    }

    if (/[@$!%*?&]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Al menos un símbolo (@$!%*?&)');
    }

    return { score, feedback };
  }
} 