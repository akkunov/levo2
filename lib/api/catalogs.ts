import type {Catalog, CatalogWithCount} from '@/types/catalog';
import type { CatalogProductsResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch<T>(path: string): Promise<T> {
    if (!API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL не задан');
    }

    const response = await fetch(`${API_URL}${path}`);

    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

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