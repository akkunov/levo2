
import { apiFetch } from './client';
import type { LoginDto, LoginResponse, User } from '@/types';

export function login(dto: LoginDto): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
}

export function fetchCurrentUser(): Promise<User> {
    return apiFetch<User>('/auth/me');
}

export function logout() {
    return apiFetch<{ ok: boolean; message: string }>(
        '/auth/logout',
        { method: 'POST' },
    );
}
