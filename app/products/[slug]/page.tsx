import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ArrowUpRight,
    ShieldCheck,
    Truck,
} from 'lucide-react';

import {
    fetchProductBySlug,
    fetchCatalogProducts,
    mapCatalogProduct,
} from '@/lib/api/products';
import type { StoreProduct } from '@/lib/api/products';

import {
    Breadcrumbs,
    ProductGrid,
    ProductSpecifications,
} from '@/components/storefront';
import PremiumProductGallery from './PremiumProductGallery';
import ProductHero from './ProductHero';

import './product-premium.css';
import { formatPrice } from '@/lib/format';

type PageProps = {
    params: Promise<{ slug: string }>;
};


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

    if (!product) {
        return { title: 'Товар не найден', robots: { index: false, follow: false } };
    }

    const description = product.description?.trim() ||
        `Характеристики, фотографии и цена ${product.title} в каталоге LEVO Кыргызстан.`;
    const canonical = `/products/${encodeURIComponent(slug)}`;

    return {
        title: product.title,
        description,
        alternates: { canonical },
        openGraph: {
            type: 'website',
            title: product.title,
            description,
            url: canonical,
            images: product.image ? [{ url: product.image, alt: product.title }] : undefined,
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

    if (!product) notFound();

    const categoryName = product.catalog?.name ?? 'Бытовая техника';
    const categorySlug = product.catalog?.slug ?? 'built-in-appliances';
    const images = [
        product.image,
        ...(product.images ?? []).map((image) => image.url),
    ].filter((image): image is string => Boolean(image));
    const uniqueImages = [...new Set(images)];
    const heroImage = product.image ?? '/images/product-placeholder.png';

    const storeProduct: StoreProduct = {
        id: product.id,
        name: product.title,
        slug: product.slug,
        category: categoryName,
        image: heroImage,
        price: Number(product.price ?? 0),
        oldPrice: product.oldPrice != null ? Number(product.oldPrice) : null,
        tag: product.tag,
        description: product.description,
        specs: product.specs ?? [],
    };

    let related: StoreProduct[] = [];
    if (product.catalog?.slug) {
        try {
            const response = await fetchCatalogProducts(product.catalog.slug, 1, 8);
            related = response.items
                .filter((item) => item.id !== product.id)
                .slice(0, 4)
                .map(mapCatalogProduct);
        } catch {
            related = [];
        }
    }

    return (
        <main className="premium-product-page">
            <ProductHero
                title={product.title}
                categoryName={categoryName}
                subtitle={product.subtitle}
                image={heroImage}
                price={product.price}
                oldPrice={product.oldPrice}
            />

            <div className="page-shell premium-product-content" id="product-details">
                <Breadcrumbs
                    items={[
                        { label: 'Каталог', href: '/catalogs' },
                        { label: categoryName, href: `/catalogs/${categorySlug}` },
                        { label: product.title },
                    ]}
                />

                <section className="premium-product" aria-label="Информация о товаре">
                    <div className="premium-product-gallery-wrap">
                        <div className="premium-detail-label"><span>LEVO / DETAILS</span><span>01—03</span></div>
                        <PremiumProductGallery
                            images={uniqueImages.length > 0 ? uniqueImages : ['/images/product-placeholder.png']}
                            name={product.title}
                            product={storeProduct}
                            priceLabel={formatPrice(product.price)}
                        />
                    </div>

                    <div className="premium-product-info">
                        <div className="premium-product-overline">
                            <span>ИНФОРМАЦИЯ О МОДЕЛИ</span>
                            {product.sku && <span>АРТ. {product.sku}</span>}
                        </div>

                        <p className="premium-product-lead">
                            Внимание к деталям. Практичные решения. Комфорт на каждый день.
                        </p>

                        {product.description ? (
                            <p className="premium-product-description">{product.description}</p>
                        ) : (
                            <p className="premium-product-description">
                                Узнайте больше об этой модели и её возможностях у консультанта LEVO.
                            </p>
                        )}

                        <div className="premium-product-benefits">
                            <div className="premium-benefit-icon"><Truck size={20} strokeWidth={1.5} /></div>
                            <div className="premium-benefit-copy">
                                <strong>Доставка</strong>
                                <span>Условия и сроки уточняются при оформлении заказа.</span>
                            </div>
                            <ArrowUpRight className="premium-benefit-arrow" size={17} strokeWidth={1.5} />
                            <div className="premium-benefit-icon"><ShieldCheck size={20} strokeWidth={1.5} /></div>
                            <div className="premium-benefit-copy">
                                <strong>Гарантия</strong>
                                <span>{product.warranty || 'Уточняйте условия гарантии у консультанта.'}</span>
                            </div>
                            <ArrowUpRight className="premium-benefit-arrow" size={17} strokeWidth={1.5} />
                        </div>

                        <div className="premium-product-meta">
                            <span>Модель</span>
                            <span>{product.sku || product.slug || `LV-${product.id}`}</span>
                        </div>
                        <div className="premium-product-meta">
                            <span>Категория</span>
                            <Link href={`/catalogs/${categorySlug}`}>{categoryName}<ArrowUpRight size={14} /></Link>
                        </div>
                    </div>
                </section>

                <section className="premium-specifications" aria-label="Характеристики товара">
                    <div className="premium-section-intro">
                        <span className="eyebrow">02 / ХАРАКТЕРИСТИКИ</span>
                        <h2>Всё важное.<br /><em>Без лишнего.</em></h2>
                        <p>Основные параметры модели — в одном месте, чтобы вам было проще сравнить и выбрать.</p>
                    </div>
                    <ProductSpecifications specs={product.specs ?? []} />
                    {product.description && (
                        <div className="premium-long-description">
                            <span className="eyebrow">О ПРОДУКТЕ</span>
                            <h3>Продумано для вашего дома</h3>
                            <p>{product.description}</p>
                        </div>
                    )}
                </section>

                {related.length > 0 && (
                    <section className="premium-related">
                        <div className="premium-related-heading">
                            <div>
                                <span className="eyebrow">03 / ВЫБОР LEVO</span>
                                <h2>Возможно,<br /><em>вам подойдёт.</em></h2>
                            </div>
                            <Link href={`/catalogs/${categorySlug}`} className="text-link">
                                Смотреть всю категорию <ArrowUpRight size={18} />
                            </Link>
                        </div>
                        <ProductGrid items={related} />
                    </section>
                )}
            </div>
        </main>
    );
}
