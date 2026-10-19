'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';


export default function AdminLoginPage() {
    const { login, isLoggingIn, loginError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            await login({
                email: email.trim(),
                password,
            });
        } catch {
            // Ошибка отображается через loginError.
        }
    }

    return (
        <div className="admin-auth-page">
            <div className="admin-auth-card">
                <span className="eyebrow">LEVO / ADMIN</span>

                <h1>Вход в панель</h1>

                <p>
                    Введите данные администратора, чтобы попасть в CRM
                    и управлять каталогом.
                </p>

                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="admin-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="admin@levo.kg"
                            autoComplete="username"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-field">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-actions">
                        <label className="admin-remember">
                            <input type="checkbox" name="remember" />
                            <span>Запомнить меня</span>
                        </label>

                        <Link href="/" className="text-link">
                            На главную <ArrowRight size={16} />
                        </Link>
                    </div>

                    {loginError && (
                        <p role="alert" className="admin-error">
                            {loginError instanceof Error
                                ? loginError.message
                                : 'Не удалось войти. Проверьте данные.'}
                        </p>
                    )}

                    <button
                        className="button button-dark"
                        type="submit"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? 'Входим...' : 'Войти'}
                        {!isLoggingIn && <ArrowRight size={16} />}
                    </button>
                </form>
            </div>
        </div>
    );
}