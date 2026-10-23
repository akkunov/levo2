import type { Metadata } from 'next';
import AnalyticsDashboard from '@/components/admin/analytics/analytics-dashboard';

export const metadata: Metadata = {
  title: 'Статистика | LEVO Admin',
  description: 'Посещаемость сайта и просмотры товаров.',
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return <AnalyticsDashboard />;
}
