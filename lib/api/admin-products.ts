import { apiFetch } from './client';
import type { ApiProduct } from './products';

export interface CreateProductDto {
    title: string;
    sku?: string;
    slug?: string;
    price?: number;
    oldPrice?: number;
    description?: string;
    image?: string;
    tag?: string;
    warranty?: string;
    subtitle?: string;
    specs?: string[];
    catalogId: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface AdminProductsResponse {
    items: ApiProduct[];
    total: number;
    page: number;
    limit: number;
}

export function fetchAdminProducts(
    page = 1,
    limit = 20,
    search = '',
) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (search.trim()) {
        params.set('search', search.trim());
    }

    return apiFetch<AdminProductsResponse>(
        `/products?${params.toString()}`,
    );
}

export function createProduct(dto: CreateProductDto) {
    return apiFetch<ApiProduct>('/products/admin', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
}

export function updateProduct(
    id: number,
    dto: UpdateProductDto,
) {
    return apiFetch<ApiProduct>(`/products/admin/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dto),
    });
}

export function deleteProduct(id: number) {
    return apiFetch<void>(`/products/admin/${id}`, {
        method: 'DELETE',
    });
}

export async function fetchAdminProductById(id: number) {
    const limit = 100;
    let page = 1;

    while (true) {
        const result = await fetchAdminProducts(page, limit);

        const product = result.items.find((item) => item.id === id);

        if (product) {
            return product;
        }

        if (page * limit >= result.total || result.items.length === 0) {
            throw new Error(`Товар с ID ${id} не найден`);
        }

        page += 1;
    }
}
