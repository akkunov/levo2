import type { MetadataRoute } from 'next';
import { categories, products } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = [
        '',
        '/catalogs',
        '/contacts',
    ].map((route) => ({
        url: `https://levo.kg${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const categoryRoutes = categories.map((category) => ({
        url: `https://levo.kg/catalogs/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const productRoutes = products.map((product) => ({
        url: `https://levo.kg/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

