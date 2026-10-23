import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Сервисные центры LEVO',
    description: 'Найдите сервисный центр LEVO в Кыргызстане: адреса, телефоны и информация о сервисном обслуживании бытовой техники.',
    alternates: { canonical: '/services' },
    openGraph: {
        type: 'website',
        title: 'Сервисные центры LEVO',
        description: 'Адреса и контакты сервисных центров LEVO в Кыргызстане.',
        url: '/services',
    },
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
