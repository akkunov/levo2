'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCatalogProducts } from '@/lib/api/catalogs';

export function useCatalogProducts(
    slug: string,
    page = 1,
    limit = 12,
) {
    return useQuery({
        queryKey: ['catalog-products', slug, page, limit],
        queryFn: () => fetchCatalogProducts(slug, page, limit),
        enabled: Boolean(slug),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}