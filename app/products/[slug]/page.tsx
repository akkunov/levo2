import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check, ShieldCheck, Truck } from 'lucide-react';

import {
    fetchProductBySlug,
    fetchCatalogProducts,
} from '@/lib/api/products';
import type { StoreProduct } from '@/lib/api/products';

import {
    AddToCart,
    Breadcrumbs, ProductGallery,
    ProductGrid,
} from '@/components/storefront';

import './product-premium.css';

type PageProps = {
    params: Promise<{ slug: string }>;
};

function formatPrice(price: number | null): string {
    if (price == null) return 'Цена уточняется';

    return new Intl.NumberFormat('ru-KG', {
        style: 'currency',
        currency: 'KGS',
        maximumFractionDigits: 0,
    }).format(price);
}

export async function generateMetadata({
                                           params,
                                       }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

    if (!product) {
        return { title: 'Товар не найден — LEVO' };
    }

    return {
        title: `${product.title} — LEVO`,
        description:
            product.description ?? `Познакомьтесь с ${product.title} в LEVO.`,
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const categoryName = product.catalog?.name ?? 'Бытовая техника';
    const categorySlug = product.catalog?.slug ?? 'built-in-appliances';

    const images = [
        product.image,
        ...(product.images ?? []).map((image) => image.url),
    ].filter((image): image is string => Boolean(image));

    const uniqueImages = [...new Set(images)];

    const storeProduct: StoreProduct = {
        id: product.id,
        name: product.title,
        slug: product.slug,
        category: categoryName,
        image: uniqueImages[0] ?? '/images/product-placeholder.png',
        price: Number(product.price ?? 0),
        oldPrice:
            product.oldPrice != null ? Number(product.oldPrice) : null,
        tag: product.tag,
        description: product.description,
        specs: product.specs ?? [],
    };

    let related: StoreProduct[] = [];

    if (product.catalog?.slug) {
        try {
            const response = await fetchCatalogProducts(
                product.catalog.slug,
                1,
                8,
            );

            related = response.items
                .filter((item) => item.id !== product.id)
                .slice(0, 4);
        } catch {
            related = [];
        }
    }

    return (
        <main className="page-shell premium-product-page">
            <Breadcrumbs
                items={[
                    { label: 'Каталог', href: '/catalogs' },
                    {
                        label: categoryName,
                        href: `/catalogs/${categorySlug}`,
                    },
                    { label: product.title },
                ]}
            />

            <section className="premium-product">
                <ProductGallery
                    images={
                        uniqueImages.length > 0
                            ? uniqueImages
                            : ['/images/product-placeholder.png']
                    }
                    name={product.title}
                />

                <div className="premium-product-info">
                    <div className="premium-product-overline">
                        <span>LEVO COLLECTION</span>
                        {product.sku && <span>АРТ. {product.sku}</span>}
                    </div>

                    <span className="premium-product-category">
            {categoryName}
          </span>

                    <h1>{product.title}</h1>

                    {product.subtitle && (
                        <p className="premium-product-subtitle">
                            {product.subtitle}
                        </p>
                    )}

                    {product.description && (
                        <p className="premium-product-description">
                            {product.description}
                        </p>
                    )}

                    <div className="premium-product-price">
                        <strong>{formatPrice(product.price)}</strong>

                        {product.oldPrice != null && (
                            <del>{formatPrice(product.oldPrice)}</del>
                        )}
                    </div>

                    <p className="premium-product-price-note">
                        Цена указана в кыргызских сомах.
                    </p>

                    <div className="premium-product-actions">
                        <AddToCart product={storeProduct} />
                    </div>

                    <div className="premium-product-benefits">
                        <div>
                            <Truck size={21} strokeWidth={1.5} />
                            <span>
                <strong>Доставка</strong>
                <small>Условия уточняются при заказе</small>
              </span>
                            <ArrowUpRight size={16} />
                        </div>

                        <div>
                            <ShieldCheck size={21} strokeWidth={1.5} />
                            <span>
                <strong>Гарантия</strong>
                <small>
                  {product.warranty || 'Уточняйте у консультанта'}
                </small>
              </span>
                            <ArrowUpRight size={16} />
                        </div>
                    </div>

                    <div className="premium-product-meta">
                        <span>Модель</span>
                        <span>{product.sku || product.slug || `LV-${product.id}`}</span>
                    </div>

                    <div className="premium-product-meta">
                        <span>Категория</span>
                        <Link href={`/catalogs/${categorySlug}`}>
                            {categoryName}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="premium-specifications">
                <div className="premium-section-intro">
                    <span className="eyebrow">DETAILS / 01</span>
                    <h2>
                        Продумано
                        <br />
                        <em>до мелочей.</em>
                    </h2>
                </div>

                <div className="premium-specifications-content">
                    <div className="premium-specifications-heading">
                        <h3>Характеристики</h3>
                        <span>{product.specs.length} параметров</span>
                    </div>

                    {product.specs.length > 0 ? (
                        product.specs.map((spec, index) => (
                            <div className="premium-spec-row" key={`${spec}-${index}`}>
                                <span>{spec}</span>
                                <Check size={17} strokeWidth={1.5} />
                            </div>
                        ))
                    ) : (
                        <p className="premium-empty-specs">
                            Характеристики уточняются. Свяжитесь с нами, чтобы узнать
                            подробности о модели.
                        </p>
                    )}

                    {product.description && (
                        <div className="premium-long-description">
                            <h3>О товаре</h3>
                            <p>{product.description}</p>
                        </div>
                    )}
                </div>
            </section>

            {related.length > 0 && (
                <section className="premium-related">
                    <div className="premium-related-heading">
                        <div>
                            <span className="eyebrow">DISCOVER MORE</span>
                            <h2>
                                Продолжите
                                <br />
                                <em>знакомство.</em>
                            </h2>
                        </div>

                        <Link href={`/catalogs/${categorySlug}`} className="text-link">
                            Вся коллекция <ArrowUpRight size={18} />
                        </Link>
                    </div>

                    <ProductGrid items={related} />
                </section>
            )}
        </main>
    );
}