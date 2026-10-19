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

export interface CreateCatalogDto {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: number | null;
}

export type UpdateCatalogDto = Partial<CreateCatalogDto>;

export function createCatalog(dto: CreateCatalogDto) {
    return apiFetch<Catalog>('/catalogs/admin', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
}

export function updateCatalog(id: number, dto: UpdateCatalogDto) {
    return apiFetch<Catalog>(`/catalogs/admin/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dto),
    });
}

export function deleteCatalog(id: number) {
    return apiFetch<void>(`/catalogs/admin/${id}`, {
        method: 'DELETE',
    });
}
