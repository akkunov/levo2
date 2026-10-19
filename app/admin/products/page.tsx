'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Package,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import { useAdminProducts } from '@/hooks/use-admin-products';

const PAGE_SIZE = 20;

function formatPrice(value: number | string | null | undefined) {
    const price = Number(value ?? 0);

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'KGS',
        maximumFractionDigits: 0,
    }).format(price);
}

export default function AdminProductsPage() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    const {
        products,
        total,
        isLoading,
        error,
        deleteProduct,
        isDeleting,
    } = useAdminProducts(page, PAGE_SIZE, search);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    }

    async function handleDelete(id: number, title: string) {
        const confirmed = window.confirm(
            `Удалить товар «${title}»? Это действие нельзя отменить.`,
        );

        if (!confirmed) return;

        try {
            await deleteProduct(id);
        } catch (error) {
            window.alert(
                error instanceof Error
                    ? error.message
                    : 'Не удалось удалить товар',
            );
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-page-heading">
                <div>
                    <h1>Товары</h1>
                    <p>Управление ассортиментом интернет-магазина LEVO</p>
                </div>

                <Link href="/admin/products/new" className="admin-primary-button">
                    <Plus size={18} />
                    Добавить товар
                </Link>
            </div>

            <section className="admin-section">
                <form className="admin-search-form" onSubmit={handleSearch}>
                    <div className="admin-search-field">
                        <Search size={18} />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Поиск по названию товара..."
                            aria-label="Поиск товаров"
                        />
                    </div>

                    <button type="submit" className="admin-secondary-button">
                        Найти
                    </button>
                </form>

                <div className="admin-table-meta">
                    <span>Всего товаров: {total}</span>
                    <span>
            Страница {page} из {totalPages}
          </span>
                </div>

                {isLoading ? (
                    <div className="admin-empty-state">
                        <Package size={28} />
                        <p>Загружаем товары...</p>
                    </div>
                ) : error ? (
                    <div className="admin-error">
                        Не удалось загрузить товары. Проверь подключение к API и права
                        доступа.
                    </div>
                ) : products.length === 0 ? (
                    <div className="admin-empty-state">
                        <Package size={32} />
                        <h3>Товары не найдены</h3>
                        <p>Попробуй изменить поисковый запрос или добавь новый товар.</p>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                            <tr>
                                <th>Товар</th>
                                <th>Категория</th>
                                <th>Цена</th>
                                <th>Slug</th>
                                <th className="admin-actions-column">Действия</th>
                            </tr>
                            </thead>

                            <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="admin-product-cell">
                                            <div className="admin-product-image">
                                                {product.image ? (
                                                    // Обычный img позволяет отображать URL из R2
                                                    // без настройки remotePatterns в next.config.js.
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                    />
                                                ) : (
                                                    <Package size={22} />
                                                )}
                                            </div>

                                            <div className="admin-product-info">
                                                <strong>{product.title}</strong>
                                                <span>ID: {product.id}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{product.catalog?.name ?? 'Без категории'}</td>

                                    <td className="admin-price">
                                        {formatPrice(product.price)}
                                    </td>

                                    <td>
                      <span className="admin-slug">
                        {product.slug || '—'}
                      </span>
                                    </td>

                                    <td>
                                        <div className="admin-row-actions">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="admin-icon-button"
                                                title="Редактировать"
                                                aria-label={`Редактировать ${product.title}`}
                                            >
                                                <Pencil size={17} />
                                            </Link>

                                            <button
                                                type="button"
                                                className="admin-icon-button admin-icon-button-danger"
                                                title="Удалить"
                                                aria-label={`Удалить ${product.title}`}
                                                disabled={isDeleting}
                                                onClick={() =>
                                                    handleDelete(product.id, product.title)
                                                }
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!isLoading && !error && total > 0 && (
                    <div className="admin-pagination">
                        <button
                            type="button"
                            className="admin-secondary-button"
                            disabled={page <= 1}
                            onClick={() => setPage((current) => current - 1)}
                        >
                            <ChevronLeft size={17} />
                            Назад
                        </button>

                        <span>
              {page} / {totalPages}
            </span>

                        <button
                            type="button"
                            className="admin-secondary-button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((current) => current + 1)}
                        >
                            Вперёд
                            <ChevronRight size={17} />
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}