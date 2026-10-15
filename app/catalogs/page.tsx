import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {
    Breadcrumbs,
    CatalogProductSections,
    CatalogSummary,
    CategoryTiles,
} from '@/components/storefront';

export const metadata: Metadata = {title: 'Каталог бытовой техники'};
export default function CatalogPage() {
    return <div className="page-shell"><Breadcrumbs items={[{label: 'Каталог'}]}/>
        <div className="page-heading"><span className="eyebrow">LEVO / CATALOGUE</span><h1>Каталог<br/><em>техники для
            жизни.</em></h1><p>Выбирайте не просто устройство, а решение, которое подходит вашему дому.</p></div>
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
