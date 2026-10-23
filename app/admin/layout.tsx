'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { useAuth } from '@/hooks/use-auth';


export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/admin/login';
    const isManagerProductRoute = pathname === '/admin/products' || pathname.startsWith('/admin/products/');

    const {
        user,
        isLoading,
        isAuthenticated,
    } = useAuth();

    useEffect(() => {
        if (isLoginPage) return;

        if (!isLoading && !isAuthenticated) {
            router.replace('/admin/login');
            return;
        }

        if (!isLoading && isAuthenticated && user?.role === 'MANAGER' && !isManagerProductRoute) {
            router.replace('/admin/products');
            return;
        }

        if (!isLoading && isAuthenticated && user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
            router.replace('/');
        }
    }, [
        isLoginPage,
        isLoading,
        isAuthenticated,
        isManagerProductRoute,
        user,
        router,
    ]);

    if (isLoginPage) {
        return children;
    }

    if (
        isLoading ||
        !isAuthenticated ||
        !user ||
        (user.role !== 'ADMIN' && !(user.role === 'MANAGER' && isManagerProductRoute))
    ) {
        return (
            <div className="admin-loading">
                Проверяем доступ...
            </div>
        );
    }

    return (
        <div className="admin-shell">
            <AdminSidebar />

            <div className="admin-main">
                <header className="admin-topbar">
                    <span>Панель управления</span>
                    <span className="admin-topbar-status">
                        LEVO KG
                    </span>
                </header>

                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
}