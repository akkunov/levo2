import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Административная панель',
    description: 'Панель управления содержимым LEVO KG',
};

export default function AdminPage() {
    return (
        <div className="page-shell" style={{ paddingTop: '80px' }}>
            <div className="page-heading">
                <span className="eyebrow">LEVO / ADMIN</span>
                <h1>Панель управления</h1>
                <p>Здесь будет расположена административная логика: товары, категории, SEO, фото и заказы.</p>
            </div>

            <div className="catalog-help" style={{ marginTop: 0 }}>
                <div>
                    <span className="eyebrow">СТАТУС</span>
                    <h2>Доступ доступен после авторизации.</h2>
                </div>
                <Link className="button button-dark" href="/admin/login">
                    Вернуться к входу
                </Link>
            </div>
        </div>
    );
}
