import type {Catalog, CatalogWithCount} from '@/types/catalog';
import type { CatalogProductsResponse } from '@/types/product';
import { apiFetch } from './client';

export function fetchCatalogs() {
    return apiFetch<CatalogWithCount[]>('/catalogs');
}

export async function fetchCatalogBySlug(
    slug: string,
): Promise<Catalog> {
    return apiFetch<Catalog>(
        `/catalogs/${encodeURIComponent(slug)}`,
    );
}

export function fetchCatalogProducts(
    slug: string,
    page = 1,
    limit = 12,
) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    return apiFetch<CatalogProductsResponse>(
        `/catalogs/${encodeURIComponent(slug)}/products?${params}`,
    );
}