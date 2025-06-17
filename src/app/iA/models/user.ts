export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  companyName: string;
  industry: string;
  employeeCount: string;
  country: string;
  language: string;
  primaryUseCase: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
  
  userCompanyId: string;
  role: string;
  website: string;
  description: string;
  preferredLanguage: string;

    /*
  isActive: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  twoFactorEnabled: boolean;
  userCompanyName: string
  */

}