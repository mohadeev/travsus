// File: /types/User.ts

export interface User {
  id: string;
  email: string;
  username: string | null;
  phone: string | null;
  password: string;
  senders: any;
  date: Date;
  library: any;
  accountData: any;
  createdAt: Date;
  updatedAt: Date;
  savedList: any;
  passwordResetToken: string | null;
  passwordResetTokens: string[];
  passwordHistory: string[];
  passwordResetTokenExpiry: Date | null;
}
  