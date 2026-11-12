'use client';

import { useCatalogs } from '@/hooks/use-catalogs';
import { useFeaturedProducts } from '@/hooks/use-featured-products';

export function CatalogSummary() {
    const { data: catalogs = [] } = useCatalogs();
    const { data: products = [] } = useFeaturedProducts();

    const parentCategories = catalogs.length

    return (
        <div className="catalog-summary">
            <span>{parentCategories} категорий</span>
            <span>{products.length} популярных товаров</span>
        </div>
    );
}
