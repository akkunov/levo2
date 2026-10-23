import type { MetadataRoute } from 'next';
import { fetchCatalogs, fetchCatalogProducts } from '@/lib/api/catalogs';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: siteConfig.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
        { url: `${siteConfig.url}/catalogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${siteConfig.url}/contacts`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${siteConfig.url}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ];

    try {
        const catalogs = await fetchCatalogs();
        const categoryRoutes: MetadataRoute.Sitemap = catalogs
            .filter((catalog) => Boolean(catalog.slug))
            .map((catalog) => ({
                url: `${siteConfig.url}/catalogs/${catalog.slug}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.7,
            }));

        const productRouteGroups = await Promise.all(
            catalogs.filter((catalog) => Boolean(catalog.slug)).map(async (catalog) => {
                try {
                    const response = await fetchCatalogProducts(catalog.slug, 1, 100);
                    return response.items.filter((product) => Boolean(product.slug)).map((product) => ({
                        url: `${siteConfig.url}/products/${product.slug}`,
                        lastModified: now,
                        changeFrequency: 'weekly' as const,
                        priority: 0.6,
                    }));
                } catch {
                    return [];
                }
            }),
        );

        return [...staticRoutes, ...categoryRoutes, ...productRouteGroups.flat()];
    } catch {
        return staticRoutes;
    }
}
