import type { MetadataRoute } from 'next';

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

    return [...staticRoutes];
}

