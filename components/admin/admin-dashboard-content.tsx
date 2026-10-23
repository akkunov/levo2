
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
    Package,
    FolderTree,
    Plus,
    ArrowUpRight,
} from 'lucide-react';

import { fetchAdminProducts } from '@/lib/api/admin-products';
import { useCatalogs } from '@/hooks/use-catalogs';
import { AdminPageHeader } from '@/components/ui/admin-page-header';

export default function AdminDashboardContent() {
    const productsQuery = useQuery({
        queryKey: ['admin', 'dashboard', 'products-count'],
        queryFn: () => fetchAdminProducts(1, 1),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const catalogsQuery = useCatalogs();

    const productCount = productsQuery.data?.total;
    const categoryCount = catalogsQuery.data?.length;

    const formatCount = (value?: number) =>
        value === undefined ? '—' : value.toLocaleString('ru-RU');

    return (
        <div className="admin-dashboard">
            <AdminPageHeader
                eyebrow="LEVO / DASHBOARD"
                title="Обзор"
                description="Управление каталогом и товарами интернет-магазина."
                actions={<Link href="/admin/products/new" className="admin-primary-button"><Plus size={18} />Добавить товар</Link>}
            />

            <section className="admin-stats">
                <article className="admin-stat-card">
                    <div className="admin-stat-top">
                        <span>Товары</span>
                        <Package size={20} />
                    </div>

                    <strong>
                        {productsQuery.isLoading ? '…' : formatCount(productCount)}
                    </strong>

                    <span className="admin-stat-caption">
            {productsQuery.isError
                ? 'Не удалось загрузить количество'
                : 'Всего в каталоге'}
          </span>
                </article>

                <article className="admin-stat-card">
                    <div className="admin-stat-top">
                        <span>Категории</span>
                        <FolderTree size={20} />
                    </div>

                    <strong>
                        {catalogsQuery.isLoading ? '…' : formatCount(categoryCount)}
                    </strong>

                    <span className="admin-stat-caption">
            {catalogsQuery.isError
                ? 'Не удалось загрузить количество'
                : 'Категории и подкатегории'}
          </span>
                </article>
            </section>

            <section className="admin-section">
                <div className="admin-section-heading">
                    <div>
                        <h2>Быстрые действия</h2>
                        <p>Часто используемые разделы</p>
                    </div>
                </div>

                <div className="admin-quick-actions">
                    <Link
                        href="/admin/products"
                        className="admin-action-card"
                    >
                        <Package size={22} />
                        <span>
              <strong>Управление товарами</strong>
              <small>
                Поиск, цены, характеристики и изображения
              </small>
            </span>
                        <ArrowUpRight size={18} />
                    </Link>

                    <Link
                        href="/admin/catalogs"
                        className="admin-action-card"
                    >
                        <FolderTree size={22} />
                        <span>
              <strong>Управление категориями</strong>
              <small>
                Категории и вложенная структура каталога
              </small>
            </span>
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
