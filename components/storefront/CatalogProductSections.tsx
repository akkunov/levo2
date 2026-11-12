'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/use-featured-products';
import { useNewArrivals } from '@/hooks/use-new-arrivals';
import { GridSkeleton } from '@/components/ui/CatalogSkeleton';
import { ProductGrid } from './ProductGrid';

export function CatalogProductSections() {
    const {
        data: newArrivals = [],
        isPending: newPending,
        isError: newError,
    } = useNewArrivals();

    const {
        data: featuredProducts = [],
        isPending: featuredPending,
        isError: featuredError,
    } = useFeaturedProducts();

    const newIds = new Set(newArrivals.map((product) => product.id));

    const popularProducts = featuredProducts.filter(
        (product) => !newIds.has(product.id),
    );

    return (
        <>
            <section className="new-arrivals">
                <div className="section-heading-row">
                    <div>
            <span className="eyebrow">
              <Sparkles size={15} /> СВЕЖИЕ ПОСТУПЛЕНИЯ
            </span>
                        <h2>Новинки</h2>
                        <p className="new-arrivals-description">
                            Новые модели техники для вашего дома.
                        </p>
                    </div>

                    <Link href="/catalogs/new" className="text-link">
                        Все новинки <ArrowRight size={17} />
                    </Link>
                </div>

                {newPending ? (
                    <GridSkeleton count={4} variant="product" />
                ) : newError ? (
                    <p>Не удалось загрузить новинки.</p>
                ) : (
                    <ProductGrid items={newArrivals} />
                )}
            </section>

            <section className="catalog-products">
                <div className="section-heading-row">
                    <h2>Популярное</h2>
                    <span>Подборка LEVO</span>
                </div>

                {featuredPending ? (
                    <GridSkeleton count={8} variant="product" />
                ) : featuredError ? (
                    <p>Не удалось загрузить товары.</p>
                ) : (
                    <ProductGrid items={popularProducts} />
                )}
            </section>
        </>
    );
}
