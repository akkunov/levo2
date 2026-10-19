import type { UserRole } from './enums';

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string | null;
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string | null;
  role?: UserRole;
  isActive?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
}

export interface UserFormData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: User;
}
