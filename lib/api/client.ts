
import type { ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TOKEN_KEY = 'levo_access_token';

export function getAccessToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch<T>(
    path: string,
    init: RequestInit = {},
): Promise<T> {
    if (!API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL не задан');
    }

    const headers = new Headers(init.headers);

    if (init.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const token = getAccessToken();

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const baseUrl = API_URL.replace(/\/+$/, '');
    const endpoint = path.replace(/^\/+/, '');

    const response = await fetch(`${baseUrl}/${endpoint}`, {
        ...init,
        headers,
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);

        const apiError = body as ApiError | null;

        const message = Array.isArray(apiError?.message)
            ? apiError.message.join(', ')
            : apiError?.message;

        throw new Error(
            message || `Ошибка API: ${response.status}`,
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
