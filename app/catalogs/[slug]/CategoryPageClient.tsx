
'use client';

import Link from 'next/link';
import { Breadcrumbs, ProductGrid } from '@/components/storefront';
import { useCatalogProducts } from '@/hooks/use-catalog-products';
import {useCatalog} from "@/hooks/use-catalogs";
import {mapCatalogProduct, StoreProduct} from "@/lib/api/products";

export default function CategoryPageClient({
                                               slug,
                                           }: {
    slug: string;
}) {
    const {
        data: category,
        isPending: categoryPending,
        isError: categoryError,
    } = useCatalog(slug);

    const {
        data: products,
        isPending: productsPending,
        isError: productsError,
    } = useCatalogProducts(slug);

    if (categoryPending) return <div className="page-shell">Загрузка категории...</div>;

    if (categoryError || !category) {
        return <div className="page-shell">Категория не найдена.</div>;
    }

    const items: StoreProduct[] = (products?.items ?? []).map(
        mapCatalogProduct,
    );
    const children = category.children ?? [];

    return (
        <div className="page-shell">
            <Breadcrumbs
                items={[
                    { label: 'Каталог', href: '/catalogs' },
                    { label: category.name },
                ]}
            />

            <section className="category-hero">
                {category.image && <img src={category.image} alt={category.name} />}
                <div className="category-hero-shade" />
                <div className="category-hero-copy">
                    <span className="eyebrow light">LEVO / COLLECTION</span>
                    <h1>{category.name}<br /><em>по-новому.</em></h1>
                    {category.description && <p>{category.description}</p>}
                    <span className="category-count">
            {category.count} моделей в категории
          </span>
                </div>
            </section>

            {children.length > 0 && (
                <section className="catalog-products">
                    <div className="section-heading-row">
                        <h2>Подкатегории</h2>
                        <span>Коллекция LEVO</span>
                    </div>

                    <div className="category-grid">
                        {children.map((child, index) => (
                            <Link
                                className={`category-tile tile-${index + 1}`}
                                key={child.id}
                                href={`/catalogs/${child.slug}`}
                            >
                                {child.image && <img src={child.image} alt={child.name} />}
                                <span className="tile-shade" />
                                <span className="tile-copy">
                  <strong>{child.name}</strong>
                  <span className="tile-link">Исследовать</span>
                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <div className="category-toolbar">
                <span>Подборка LEVO</span>
                <span>
          {productsPending
              ? 'Загрузка товаров...'
              : `${products?.total ?? 0} товаров`}
        </span>
            </div>

            {productsError ? (
                <p>Не удалось загрузить товары.</p>
            ) : productsPending ? (
                <p>Загрузка товаров...</p>
            ) : items.length > 0 ? (
                <ProductGrid items={items} />
            ) : children.length === 0 ? (
                <div className="empty-category">
                    <h2>Коллекция скоро появится.</h2>
                    <p>
                        Свяжитесь с нами — поможем уточнить наличие нужной модели.
                    </p>
                </div>
            ) : null}
        </div>
    );
}
