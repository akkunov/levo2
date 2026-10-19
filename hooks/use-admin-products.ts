'use client';

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    fetchAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    type CreateProductDto,
    type UpdateProductDto,
} from '@/lib/api/admin-products';

export function useAdminProducts(
    page = 1,
    limit = 20,
    search = '',
) {
    const queryClient = useQueryClient();

    const productsQuery = useQuery({
        queryKey: ['admin', 'products', page, limit, search],
        queryFn: () => fetchAdminProducts(page, limit, search),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const createMutation = useMutation({
        mutationFn: (dto: CreateProductDto) => createProduct(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['admin', 'products'],
            });
            queryClient.invalidateQueries({
                queryKey: ['products'],
            });
            queryClient.invalidateQueries({
                queryKey: ['catalog-products'],
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
                         id,
                         dto,
                     }: {
            id: number;
            dto: UpdateProductDto;
        }) => updateProduct(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['admin', 'products'],
            });
            queryClient.invalidateQueries({
                queryKey: ['products'],
            });
            queryClient.invalidateQueries({
                queryKey: ['catalog-products'],
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['admin', 'products'],
            });
            queryClient.invalidateQueries({
                queryKey: ['products'],
            });
            queryClient.invalidateQueries({
                queryKey: ['catalog-products'],
            });
        },
    });

    return {
        products: productsQuery.data?.items ?? [],
        total: productsQuery.data?.total ?? 0,
        isLoading: productsQuery.isLoading,
        error: productsQuery.error,

        createProduct: createMutation.mutateAsync,
        updateProduct: updateMutation.mutateAsync,
        deleteProduct: deleteMutation.mutateAsync,

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}