
import type { CatalogProduct } from '@/types/product';
import { siteConfig } from '@/lib/site';

export function createProductSchema(
    product: CatalogProduct,
) {
    const url = `${siteConfig.url}/products/${encodeURIComponent(
        product.slug!,
    )}`;

    const images = [
        product.image,
        ...(product.images ?? []).map((image) => image.url),
    ].filter((value): value is string => Boolean(value));

    const price =
        product.price == null
            ? null
            : Number(product.price);

    const hasValidPrice =
        price !== null &&
        Number.isFinite(price) &&
        price >= 0;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${url}#product`,
        name: product.title,
        url,

        description:
            product.description ||
            product.subtitle ||
            product.title,

        image: [...new Set(images)],

        brand: {
            '@type': 'Brand',
            name: 'LEVO',
        },

        ...(product.sku
            ? { sku: product.sku }
            : {}),

        ...(hasValidPrice
            ? {
                offers: {
                    '@type': 'Offer',
                    url,
                    priceCurrency: 'KGS',
                    price,
                    seller: {
                        '@type': 'Organization',
                        name: 'LEVO KG',
                    },
                },
            }
            : {}),
    };
}
