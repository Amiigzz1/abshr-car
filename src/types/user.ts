export type UserRole = 'admin' | 'sales' | 'marketing';

export interface User {
  id: string;
  email?: string; // جعل البريد الإلكتروني اختيارياً
  role?: UserRole;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
}