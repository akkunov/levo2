import type {Metadata, Viewport} from 'next';
import './globals.css';

import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {siteConfig} from '@/lib/site';
import {Providers} from '@/app/providers';
import {ThemeProvider} from '@/components/theme/theme-provider';
import {PageViewTracker} from '@/components/analytics/page-view-tracker';

const OG_IMAGE = '/images/og-image.jpg';

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),

    title: {
        default: siteConfig.defaultTitle,
        template: `%s | ${siteConfig.name}`,
    },

    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{name: siteConfig.name}],

    keywords: [
        'LEVO',
        'техника',
        'бытовая техника',
        'Кыргызстан',
        'дизайнерская техника',
    ],

    openGraph: {
        type: 'website',
        title: siteConfig.defaultTitle,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.name,
        locale: 'ru_KG',
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: 'LEVO — бытовая техника для современного дома',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: siteConfig.defaultTitle,
        description: siteConfig.description,
        images: [OG_IMAGE],
    },

    icons: {
        icon: '/icon.svg',
    },

    verification: {
        yandex: '80a46febe04233b0',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#ffffff',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ru">
        <body>
        <Providers>
            <ThemeProvider>
                <PageViewTracker/>
                <Header/>
                <main>{children}</main>
                <Footer/>
            </ThemeProvider>
        </Providers>
        </body>
        </html>
    );
}
