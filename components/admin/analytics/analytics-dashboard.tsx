'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, Eye, PackageSearch, Users } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { AdminPageHeader } from '@/components/ui/admin-page-header';
import { AdminStatCard } from '@/components/ui/admin-stat-card';
import { AdminPanel } from '@/components/ui/admin-panel';

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
      <AdminPageHeader
        eyebrow="LEVO / INSIGHTS"
        title="Статистика сайта"
        description="Посетители, просмотры страниц и популярные товары за последние 7 дней."
      />
      {query.isPending ? <div className="admin-empty-state">Загрузка аналитики…</div> :
       query.isError ? <div className="admin-error">Аналитика ещё не подключена к backend. Для сбора данных нужны POST /analytics/events и GET /analytics/admin/summary; без них достоверные числа недоступны. ({query.error instanceof Error ? query.error.message : 'Ошибка API'})</div> :
       data ? <>
        <section className="admin-stats admin-stats-four">
          <AdminStatCard label="Уникальные сессии" value={numberFormat.format(data.visitors)} caption="За 7 дней" icon={Users} />
          <AdminStatCard label="Просмотры страниц" value={numberFormat.format(data.pageViews)} caption="Все страницы магазина" icon={Eye} />
          <AdminStatCard label="Просмотры товаров" value={numberFormat.format(data.productViews)} caption="Страницы товаров" icon={PackageSearch} />
          <AdminStatCard label="Период отчёта" value="7 дней" caption="Последние семь дней" icon={Activity} />
        </section>
        <AdminPanel title="Самые просматриваемые товары" description="По количеству просмотров карточки товара.">
          {data.popularProducts.length === 0 ? <p>За выбранный период просмотров пока нет.</p> :
            <div className="admin-table-wrapper"><table className="admin-table"><thead><tr><th>Товар</th><th>Просмотры</th></tr></thead><tbody>{data.popularProducts.map(product => <tr key={product.productId}><td>{product.productTitle}</td><td>{numberFormat.format(product.views)}</td></tr>)}</tbody></table></div>}
        </AdminPanel>
       </> : null}
    </div>
  );
}
