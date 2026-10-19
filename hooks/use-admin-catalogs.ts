'use client';

import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import {
    createCatalog,
    updateCatalog,
    deleteCatalog,
    type CreateCatalogDto,
    type UpdateCatalogDto,
} from '@/lib/api/catalogs';

export function useAdminCatalogs() {
    const queryClient = useQueryClient();

    const refreshCatalogs = async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['catalogs'] }),
            queryClient.invalidateQueries({ queryKey: ['catalog'] }),
            queryClient.invalidateQueries({ queryKey: ['catalog-products'] }),
        ]);
    };

    const createMutation = useMutation({
        mutationFn: (dto: CreateCatalogDto) => createCatalog(dto),
        onSuccess: refreshCatalogs,
    });

    const updateMutation = useMutation({
        mutationFn: ({
                         id,
                         dto,
                     }: {
            id: number;
            dto: UpdateCatalogDto;
        }) => updateCatalog(id, dto),
        onSuccess: refreshCatalogs,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCatalog(id),
        onSuccess: refreshCatalogs,
    });

    return {
        createCatalog: createMutation.mutateAsync,
        updateCatalog: updateMutation.mutateAsync,
        deleteCatalog: deleteMutation.mutateAsync,

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}