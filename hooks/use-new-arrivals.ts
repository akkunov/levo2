'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNewArrivals } from '@/lib/api/products';

export function useNewArrivals() {
    return useQuery({
        queryKey: ['products', 'new-arrivals'],
        queryFn: fetchNewArrivals,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}