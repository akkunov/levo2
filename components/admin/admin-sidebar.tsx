'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    BarChart3,
    Users,
    ExternalLink,
    LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const NAV_ITEMS = [
    {
        label: 'Обзор',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        label: 'Товары',
        href: '/admin/products',
        icon: Package,
    },
    {
        label: 'Категории',
        href: '/admin/catalogs',
        icon: FolderTree,
    },
    {
        label: 'Статистика',
        href: '/admin/analytics',
        icon: BarChart3,
    },
    {
        label: 'Менеджеры',
        href: '/admin/managers',
        icon: Users,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    async function handleLogout() {
        await logout();
        router.replace('/admin/login');
    }

    return (
        <aside className="admin-sidebar">
            <Link href="/admin" className="admin-brand">
                <span className="admin-brand-logo">L</span>
                <span>
                    <strong>LEVO</strong>
                    <small>ADMINISTRATION</small>
                </span>
            </Link>

            <div className="admin-nav-label">УПРАВЛЕНИЕ</div>

            <nav className="admin-nav">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const active =
                        href === '/admin'
                            ? pathname === href
                            : pathname === href ||
                            pathname.startsWith(`${href}/`);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`admin-nav-link${active ? ' active' : ''}`}
                        >
                            <Icon size={19} strokeWidth={1.8} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="admin-sidebar-bottom">
                <Link href="/" className="admin-nav-link">
                    <ExternalLink size={18} />
                    <span>Открыть магазин</span>
                </Link>

                <div className="admin-user">
                    <div className="admin-avatar">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="admin-user-info">
                        <strong>{user?.name || 'Администратор'}</strong>
                        <small>{user?.email}</small>
                    </div>
                </div>

                <button
                    type="button"
                    className="admin-nav-link admin-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    <span>Выйти</span>
                </button>
            </div>
        </aside>
    );
}