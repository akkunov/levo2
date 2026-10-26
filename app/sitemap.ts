
import type { MetadataRoute } from 'next';
import {
    fetchCatalogs,
    fetchCatalogProducts,
} from '@/lib/api/catalogs';
import { siteConfig } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: siteConfig.url,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteConfig.url}/catalogs`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteConfig.url}/contacts`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${siteConfig.url}/services`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    let catalogs;

    try {
        catalogs = await fetchCatalogs();
    } catch (error) {
        console.error('[sitemap] Failed to fetch catalogs:', error);
        throw error;
    }

    const validCatalogs = catalogs.filter(
        (catalog) => Boolean(catalog.slug),
    );

    const categoryRoutes: MetadataRoute.Sitemap =
        validCatalogs.map((catalog) => ({
            url: `${siteConfig.url}/catalogs/${catalog.slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

    const productRoutes: MetadataRoute.Sitemap = [];

    // Загружаем каталоги последовательно,
    // чтобы не создавать лишнюю нагрузку на API и БД.
    for (const catalog of validCatalogs) {
        const limit = 100;
        let page = 1;
        let total = Infinity;
        let loaded = 0;

        try {
            while (loaded < total) {
                const response = await fetchCatalogProducts(
                    catalog.slug,
                    page,
                    limit,
                );

                const items = response.items;

                if (page === 1) {
                    total = response.total;
                }

                if (items.length === 0) {
                    break;
                }

                for (const product of items) {
                    if (!product.slug) {
                        console.warn(
                            `[sitemap] Product without slug in catalog "${catalog.slug}"`,
                            product,
                        );
                        continue;
                    }

                    productRoutes.push({
                        url: `${siteConfig.url}/products/${product.slug}`,
                        lastModified: now,
                        changeFrequency: 'weekly',
                        priority: 0.6,
                    });
                }

                loaded += items.length;

                if (loaded >= total || items.length < limit) {
                    break;
                }

                page++;
            }

            console.info(
                `[sitemap] Catalog "${catalog.slug}": ${loaded}/${total} products loaded`,
            );
        } catch (error) {
            console.error(
                `[sitemap] Failed to fetch products for "${catalog.slug}"`,
                error,
            );
        }
    }

    const result = [
        ...staticRoutes,
        ...categoryRoutes,
        ...productRoutes,
    ];

    console.info('[sitemap] Total URLs:', result.length);
    console.info('[sitemap] Product URLs:', productRoutes.length);

    return result;
}
