export interface User {
  name: string, 
  email: string,
  password: string,
  phoneNumber: string,
  companyName: string,
  industry: string
  role: string;
}

export interface changePassword {
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
}
