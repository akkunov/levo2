import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {
    Breadcrumbs,
    CatalogProductSections,
    CatalogSummary,
    CategoryTiles,
} from '@/components/storefront';

export const metadata: Metadata = {
    title: 'Каталог бытовой техники',
    description: 'Выберите бытовую технику LEVO в Кыргызстане: модели для кухни и дома, характеристики и актуальные цены в сомах.',
    alternates: { canonical: '/catalogs' },
    openGraph: {
        type: 'website',
        title: 'Каталог бытовой техники',
        description: 'Техника для кухни и дома в каталоге LEVO Кыргызстан.',
        url: '/catalogs',
    },
};
export default function CatalogPage() {
    return <div className="page-shell">
        <Breadcrumbs items={[{label: 'Каталог'}]}/>
        <CatalogSummary/>
        <CategoryTiles/>
        <CatalogProductSections />

        <div className="catalog-help">
            <div>
                <span className="eyebrow">НУЖНА ПОМОЩЬ?</span>
                <h2>Подберём вместе.</h2>
            </div>
            <Link className="button button-dark" href="/contacts">Связаться с нами <ArrowRight size={17}/></Link>
        </div>
    </div>;
}
