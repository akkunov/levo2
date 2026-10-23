import type {Metadata} from 'next';
import './globals.css';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {siteConfig} from '@/lib/site';
import {Providers} from "@/app/providers";
import { ThemeProvider } from '@/components/theme/theme-provider';
import { PageViewTracker } from '@/components/analytics/page-view-tracker';

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.defaultTitle,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{name: siteConfig.name}],
    keywords: ['LEVO', 'техника', 'бытовая техника', 'Кыргызстан', 'дизайнерская техника'],
    openGraph: {
        title: siteConfig.defaultTitle,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.name,
        locale: 'ru_KG',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.defaultTitle,
        description: siteConfig.description,
    },
    icons: {
        icon: '/logo.svg',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#ffffff',
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ru">
            <body>
            <Providers>
              <ThemeProvider>
                <PageViewTracker />
                <Header />
                <main>{children}</main>
                <Footer />
              </ThemeProvider>
            </Providers>
            </body>
        </html>
    );
}
