export interface User {
  _id: string;
  email: string;
  password: string;
  username: string;
  isActive: boolean;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
