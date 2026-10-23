import { apiFetch } from '@/lib/api/client';

export type Manager = {
  id: number | string;
  name: string | null;
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
 * GET /admin/users and POST /admin/users. The server must hash passwords,
 * enforce ADMIN-only access, validate inputs, and never return password hashes.
 */
export function fetchManagers() {
  return apiFetch<Manager[]>('/admin/users').then((users) => users.filter((user) => user.role === 'MANAGER'));
}

export function createManager(dto: CreateManagerDto) {
  return apiFetch<Manager>('/users/admin', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
