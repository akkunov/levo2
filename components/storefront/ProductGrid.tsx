'use client';

import { useState } from 'react';
import { useFeaturedProducts } from '@/hooks/use-featured-products';
import type { StoreProduct } from '@/lib/api/products';
import { ProductCard } from './ProductCard';

export function ProductGrid({items,}: { items?: StoreProduct[]; }) {
    const [activePosterId, setActivePosterId] = useState<number | null>(null);
    const {
        data: featuredProducts = [],
        isPending,
        isError,
    } = useFeaturedProducts(items === undefined);

    const productsToShow = items ?? featuredProducts;

    if (!items && isPending) return <p>Загрузка товаров...</p>;
    if (!items && isError) return <p>Не удалось загрузить товары. Попробуйте позже.</p>;
    if (productsToShow.length === 0) return <p>Пока нет товаров для отображения.</p>;

    return (
        <div className="product-grid">
            {productsToShow.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    activePosterId={activePosterId}
                    onActivate={setActivePosterId}
                />
            ))}
        </div>
    );
}
