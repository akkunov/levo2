import type { Metadata } from 'next';
import ManagerManagement from '@/components/admin/managers/manager-management';

export const metadata: Metadata = {
  title: 'Менеджеры | LEVO Admin',
  description: 'Создание и управление учётными записями менеджеров LEVO.',
  robots: { index: false, follow: false },
};

export default function AdminManagersPage() {
  return <ManagerManagement />;
}
