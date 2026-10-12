import type {Metadata} from 'next';
import './globals.css';
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";


export const metadata: Metadata = {
    title: {default: 'LEVO — техника для жизни', template: '%s | LEVO KG'},
    description: 'Бытовая техника LEVO в Кыргызстане. Продуманный дизайн, технологии и комфорт на каждый день.',
    metadataBase: new URL('https://levo.kg')
};
export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return <html lang="ru">
    <body><Header/>
    <main>{children}</main>
    <Footer/></body>
    </html>;
}
