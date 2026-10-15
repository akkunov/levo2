'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedProducts } from '@/lib/api/products';

export function useFeaturedProducts(enabled = true) {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: fetchFeaturedProducts,
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}
