
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import {
    fetchCatalogProducts,
    mapCatalogProduct,
} from '@/lib/api/products';

import { ProductGrid } from '@/components/storefront/ProductGrid';

type Props = {
    catalogSlug: string;
    productId: number;
};

export default async function RelatedProducts({
                                                  catalogSlug,
                                                  productId,
                                              }: Props) {
    let items;

    try {
        const response = await fetchCatalogProducts(
            catalogSlug,
            1,
            8
        );

        items = response.items
            .filter((item) => item.id !== productId)
            .slice(0, 4)
            .map(mapCatalogProduct);
    } catch {
        return null;
    }

    if (items.length === 0) return null;

    return (
        <section className="premium-related">
            <div className="premium-related-heading">
                <div>
          <span className="eyebrow">
            03 / ВЫБОР LEVO
          </span>

                    <h2>
                        Возможно,
                        <br />
                        <em>вам подойдёт.</em>
                    </h2>
                </div>

                <Link
                    href={`/catalogs/${catalogSlug}`}
                    className="text-link"
                >
                    Смотреть всю категорию
                    <ArrowUpRight size={18} />
                </Link>
            </div>

            <ProductGrid items={items} />
        </section>
    );
}
