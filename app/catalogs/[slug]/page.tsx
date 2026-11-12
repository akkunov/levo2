
import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import {
    ProductGrid,
} from '@/components/storefront';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';

import {
    fetchCatalogBySlug,
    fetchCatalogProducts,
} from '@/lib/api/catalogs';

import { mapCatalogProduct } from '@/lib/api/products';
import { siteConfig } from '@/lib/site';
import {
    JsonLd,
    createBreadcrumbs,
} from '@/lib/seo/json-ld';

type Props = {
    params: Promise<{ slug: string }>;
};

const getCategory = cache(async (slug: string) => {
    return fetchCatalogBySlug(slug);
});

// Названия, оптимизированные под поиск.
// Остальные категории работают автоматически.
const categorySEO: Record<string, string> = {
    'stiralnay-mashina': 'Стиральные машины',
    'Xolodilniki': 'Холодильники',
    'Morozilnik': 'Морозильные лари',
    'kondicionery': 'Кондиционеры',
    'built-in-appliances': 'Встраиваемая техника',
};

function getSEOName(
    slug: string,
    fallback: string,
) {
    return categorySEO[slug] ?? fallback;
}

// Метаданные для поисковых систем
export async function generateMetadata({
                                           params,
                                       }: Props): Promise<Metadata> {
    const { slug } = await params;

    const category = await getCategory(slug)
        .catch(() => null);

    if (!category) {
        return {
            title: 'Категория не найдена',
            robots: { index: false, follow: false },
        };
    }

    const name = getSEOName(slug, category.name);
    const title = `${name} LEVO — купить в Кыргызстане`;

    const description =
        `Выбирайте ${name.toLocaleLowerCase('ru-RU')} ` +
        `LEVO в Кыргызстане. Модели, ` +
        `характеристики, фотографии и цены в сомах.`;

    const path = `/catalogs/${encodeURIComponent(slug)}`;

    return {
        title: { absolute: title },
        description,
        alternates: {
            canonical: path,
        },
        openGraph: {
            type: 'website',
            title,
            description,
            url: path,
            images: category.image
                ? [{ url: category.image, alt: name }]
                : undefined,
        },
    };
}

// Серверный HTML категории
export default async function CategoryPage({
                                               params,
                                           }: Props) {
    const { slug } = await params;

    const category = await getCategory(slug)
        .catch(() => null);

    if (!category) notFound();

    const products = await fetchCatalogProducts(
        slug,
        1,
        12,
    );

    const name = getSEOName(slug, category.name);
    const categoryUrl =
        `${siteConfig.url}/catalogs/${encodeURIComponent(slug)}`;

    const items = products.items.map(mapCatalogProduct);
    const children = category.children ?? [];

    const breadcrumbs = createBreadcrumbs([
        {
            name: 'Главная',
            url: siteConfig.url,
        },
        {
            name: 'Каталог',
            url: `${siteConfig.url}/catalogs`,
        },
        {
            name,
            url: categoryUrl,
        },
    ]);

    // Список товаров для поисковых систем
    const productList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        url: categoryUrl,
        numberOfItems: items.length,
        itemListElement: items
            .filter((product) => Boolean(product.slug))
            .map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: product.name,
                url: `${siteConfig.url}/products/${encodeURIComponent(product.slug!)}`,
            })),
    };

    return (
        <div className="page-shell">
            <JsonLd data={[breadcrumbs, productList]} />

            <Breadcrumbs
                items={[
                    {
                        label: 'Каталог',
                        href: '/catalogs',
                    },
                    {
                        label: name,
                    },
                ]}
            />

            <section className="category-hero">
                {category.image && (
                    <Image
                        src={category.image}
                        alt={name}
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                )}

                <div className="category-hero-shade" />

                <div className="category-hero-copy">
          <span className="eyebrow light">
            LEVO / COLLECTION
          </span>

                    <h1>
                        {name}
                        <br />
                        <em>LEVO.</em>
                    </h1>

                    {category.description && (
                        <p>{category.description}</p>
                    )}

                    <span className="category-count">
            {products.total} товаров
          </span>
                </div>
            </section>

            {children.length > 0 && (
                <section className="catalog-products">
                    <div className="section-heading-row">
                        <h2>Подкатегории</h2>
                    </div>

                    <div className="category-grid">
                        {children.map((child, index) => (
                            <Link
                                key={child.id}
                                href={`/catalogs/${child.slug}`}
                                className={`category-tile tile-${index + 1}`}
                            >
                                {child.image && (
                                    <Image
                                        src={child.image}
                                        alt={child.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 240px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                )}

                                <span className="tile-shade" />

                                <span className="tile-copy">
                  <strong>{child.name}</strong>
                  <span className="tile-link">
                    Смотреть модели
                  </span>
                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="catalog-products">
                <div className="section-heading-row">
                    <h2>Каталог: {name}</h2>
                    <span>{products.total} товаров</span>
                </div>

                {items.length > 0 ? (
                    <ProductGrid items={items} />
                ) : (
                    <p>Товары скоро появятся.</p>
                )}
            </section>

            <section className="catalog-help">
                <div>
                    <h2>Поможем выбрать {name.toLowerCase()}</h2>
                    <p>
                        Сравните модели по характеристикам,
                        размерам и функциям.
                        Подробности о каждой модели
                        доступны в карточке товара.
                    </p>
                </div>

                <Link href="/contacts" className="button button-dark">
                    Связаться с нами
                </Link>
            </section>
        </div>
    );
}
