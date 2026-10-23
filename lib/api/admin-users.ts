import { apiFetch } from '@/lib/api/client';

export type Manager = {
  id: number | string;
  name: string;
  email: string;
  role: 'MANAGER' | 'ADMIN';
  isActive?: boolean;
  createdAt?: string;
};

export type CreateManagerDto = {
  name: string;
  email: string;
  password: string;
  role: 'MANAGER';
};

/**
 * These calls require matching protected endpoints in the NestJS API:
 * GET /users/admin and POST /users/admin. The server must hash passwords,
 * enforce ADMIN-only access, validate inputs, and never return password hashes.
 */
export function fetchManagers() {
  return apiFetch<Manager[]>('/users/admin');
}

export function createManager(dto: CreateManagerDto) {
  return apiFetch<Manager>('/users/admin', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
