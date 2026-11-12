'use client';

import { useQuery } from '@tanstack/react-query';
import {
    fetchCatalogs,
    fetchCatalogBySlug,
} from '@/lib/api/catalogs';
import type { CatalogWithCount } from '@/types/catalog';

export function useCatalogs(initialData?: CatalogWithCount[]) {
    return useQuery({
        queryKey: ['catalogs'],
        queryFn: fetchCatalogs,
        initialData,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

export function useCatalog(slug: string) {
    return useQuery({
        queryKey: ['catalog', slug],
        queryFn: () => fetchCatalogBySlug(slug),
        enabled: Boolean(slug),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}