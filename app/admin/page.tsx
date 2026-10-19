
import type { Metadata } from 'next';
import AdminDashboardContent from '@/components/admin/admin-dashboard-content';

export const metadata: Metadata = {
    title: 'Обзор | LEVO Admin',
    description: 'Панель управления интернет-магазином LEVO',
};

export default function AdminDashboardPage() {
    return <AdminDashboardContent />;
}
