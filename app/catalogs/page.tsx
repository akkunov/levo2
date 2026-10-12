import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories, products } from '@/lib/data';
import { Breadcrumbs, CategoryTiles, ProductGrid } from '@/components/storefront';
export const metadata: Metadata = { title: 'Каталог бытовой техники' };
export default function CatalogPage() { return <div className="page-shell"><Breadcrumbs items={[{label:'Каталог'}]}/><div className="page-heading"><span className="eyebrow">LEVO / CATALOGUE</span><h1>Каталог<br/><em>техники для жизни.</em></h1><p>Выбирайте не просто устройство, а решение, которое подходит вашему дому.</p></div><div className="catalog-summary"><span>{categories.length} категорий</span><span>{products.length} демонстрационных товаров</span></div><CategoryTiles/><div className="catalog-products"><div className="section-heading-row"><h2>Популярное</h2><span>Подборка LEVO</span></div><ProductGrid/></div><div className="catalog-help"><div><span className="eyebrow">НУЖНА ПОМОЩЬ?</span><h2>Подберём вместе.</h2></div><Link className="button button-dark" href="/contacts">Связаться с нами <ArrowRight size={17}/></Link></div></div>; }
