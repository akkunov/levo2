import 'server-only';

import type { CatalogWithCount } from '@/types/catalog';
import type { ApiProduct, StoreProduct } from '@/lib/api/products';
import { mapCatalogProduct } from '@/lib/api/products';

// Server-side read-only API access for SEO-relevant homepage content.
// Using a short ISR TTL avoids a network request for every visit and
// leaves the hero independently streamable via Suspense.
const REVALIDATE_SECONDS = 300;

async function fetchPublic<T>(path: string): Promise<T | null> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
    if (!baseUrl) return null;

    try {
        const response = await fetch(`${baseUrl}${path}`, {
            next: { revalidate: REVALIDATE_SECONDS },
            signal: AbortSignal.timeout(5_000),
        });
        if (!response.ok) return null;
        return await response.json() as T;
    } catch (error) {
        console.warn('[home] Public content request failed:', path, error);
        return null;
    }
}

export async function fetchHomeCatalogs(): Promise<CatalogWithCount[] | null> {
    const catalogs = await fetchPublic<CatalogWithCount[]>('/catalogs');
    return Array.isArray(catalogs) ? catalogs : null;
}

export async function fetchHomeFeaturedProducts(): Promise<StoreProduct[] | null> {
    const response = await fetchPublic<{ items: ApiProduct[] }>('/products/featured');
    if (!response || !Array.isArray(response.items)) return null;
    return response.items.map(mapCatalogProduct);
}
