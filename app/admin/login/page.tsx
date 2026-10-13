import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Авторизация администратора',
    description: 'Вход в административную панель LEVO KG',
};

export default function AdminLoginPage() {
    return (
        <div className="admin-auth-page">
            <div className="admin-auth-card">
                <span className="eyebrow">LEVO / ADMIN</span>
                <h1>Вход в панель</h1>
                <p>Введите данные администратора, чтобы попасть в CRM и управлять каталогом.</p>

                <form className="admin-form" action="/admin" method="post">
                    <div className="admin-field">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="admin@levo.kg" autoComplete="email" required />
                    </div>

                    <div className="admin-field">
                        <label htmlFor="password">Пароль</label>
                        <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
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

                    <button className="button button-dark" type="submit">
                        Войти <ArrowRight size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
