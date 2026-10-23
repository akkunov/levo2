'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, Eye, PackageSearch, Users } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';

type ProductVisit = { productId: number | string; productTitle: string; views: number };
type AnalyticsSummary = {
  visitors: number;
  pageViews: number;
  productViews: number;
  popularProducts: ProductVisit[];
  period: { from: string; to: string };
};

/** Requires GET /analytics/admin/summary?period=7d on the backend. */
function fetchAnalytics() {
  return apiFetch<AnalyticsSummary>('/analytics/admin/summary?period=7d');
}

const numberFormat = new Intl.NumberFormat('ru-RU');

export default function AnalyticsDashboard() {
  const query = useQuery({ queryKey: ['admin', 'analytics', '7d'], queryFn: fetchAnalytics, retry: false });
  const data = query.data;

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">LEVO / INSIGHTS</span>
          <h1>Статистика сайта</h1>
          <p>Посетители, просмотры страниц и популярные товары за последние 7 дней.</p>
        </div>
      </div>
      {query.isPending ? <div className="admin-empty-state">Загрузка аналитики…</div> :
       query.isError ? <div className="admin-error">Аналитика ещё не подключена к backend. Для сбора данных нужны POST /analytics/events и GET /analytics/admin/summary; без них достоверные числа недоступны. ({query.error instanceof Error ? query.error.message : 'Ошибка API'})</div> :
       <>
        <section className="admin-stats admin-stats-four">
          <article className="admin-stat-card"><div className="admin-stat-top"><span>Уникальные сессии</span><Users size={20}/></div><strong>{numberFormat.format(data.visitors)}</strong><span className="admin-stat-caption">За 7 дней</span></article>
          <article className="admin-stat-card"><div className="admin-stat-top"><span>Просмотры страниц</span><Eye size={20}/></div><strong>{numberFormat.format(data.pageViews)}</strong><span className="admin-stat-caption">Все страницы магазина</span></article>
          <article className="admin-stat-card"><div className="admin-stat-top"><span>Просмотры товаров</span><PackageSearch size={20}/></div><strong>{numberFormat.format(data.productViews)}</strong><span className="admin-stat-caption">Страницы товаров</span></article>
          <article className="admin-stat-card"><div className="admin-stat-top"><span>Сбор данных</span><Activity size={20}/></div><strong>7 дней</strong><span className="admin-stat-caption">Период отчёта</span></article>
        </section>
        <section className="admin-section admin-panel">
          <div className="admin-section-heading"><h2>Самые просматриваемые товары</h2><p>По количеству просмотров карточки товара.</p></div>
          {data.popularProducts.length === 0 ? <p>За выбранный период просмотров пока нет.</p> :
            <div className="admin-table-wrapper"><table className="admin-table"><thead><tr><th>Товар</th><th>Просмотры</th></tr></thead><tbody>{data.popularProducts.map(product => <tr key={product.productId}><td>{product.productTitle}</td><td>{numberFormat.format(product.views)}</td></tr>)}</tbody></table></div>}
        </section>
       </>}
    </div>
  );
}
