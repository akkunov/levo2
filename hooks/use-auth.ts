
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser, login } from '@/lib/api/auth';
import {
    clearAccessToken,
    getAccessToken,
    setAccessToken,
} from '@/lib/api/client';
import type { LoginDto } from '@/types';

const AUTH_KEY = ['auth', 'me'];

export function useAuth() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const token = getAccessToken();

    const userQuery = useQuery({
        queryKey: AUTH_KEY,
        queryFn: fetchCurrentUser,
        enabled: Boolean(token),
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const loginMutation = useMutation({
        mutationFn: (dto: LoginDto) => login(dto),

        onSuccess: (result) => {
            setAccessToken(result.accessToken);

            queryClient.setQueryData(AUTH_KEY, result.user);

            router.replace(
                result.user.role === 'ADMIN' ? '/admin' : '/',
            );
        },
    });

    function logout() {
        clearAccessToken();
        queryClient.removeQueries({ queryKey: ['auth'] });
        router.replace('/login');
    }

    return {
        user: userQuery.data ?? null,
        isLoading: userQuery.isPending && Boolean(token),
        error: userQuery.error,
        isAuthenticated: Boolean(token && userQuery.data),
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        logout,
    };
}
