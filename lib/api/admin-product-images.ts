
import { apiFetch } from '@/lib/api/client';

export interface UploadedProductImage {
    id: number;
    url: string;
    alt?: string | null;
    sortOrder: number;
}

export interface ProductPosterUploadResult {
    productId: number;
    image: string | null;
    key: string;
}

export interface ProductGalleryUploadResult {
    productId: number;
    count: number;
    images: UploadedProductImage[];
}

export function uploadProductPoster(
    productId: number,
    file: File,
): Promise<ProductPosterUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    return apiFetch<ProductPosterUploadResult>(
        `/admin/products/${productId}/poster`,
        {
            method: 'POST',
            body: formData,
        },
    );
}

export function uploadProductImages(
    productId: number,
    files: File[],
): Promise<ProductGalleryUploadResult> {
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));

    return apiFetch<ProductGalleryUploadResult>(
        `/admin/products/${productId}/images`,
        {
            method: 'POST',
            body: formData,
        },
    );
}

export function deleteProductPoster(productId: number) {
    return apiFetch<{ deleted: boolean; productId?: number }>(
        `/admin/products/${productId}/poster`,
        { method: 'DELETE' },
    );
}

export function deleteProductImage(
    productId: number,
    imageId: number,
) {
    return apiFetch<{ deleted: boolean; id: number }>(
        `/admin/products/${productId}/images/${imageId}`,
        { method: 'DELETE' },
    );
}

export function reorderProductImages(
    productId: number,
    images: Array<{ id: number; sortOrder: number }>,
) {
    return apiFetch<{ updated: number; productId: number }>(
        `/admin/products/${productId}/images/reorder`,
        {
            method: 'PATCH',
            body: JSON.stringify(images),
        },
    );
}

export function setProductHeroImage(
    productId: number,
    imageId: number,
) {
    return apiFetch(
        `/admin/products/${productId}/hero`,
        {
            method: 'PATCH',
            body: JSON.stringify({ imageId }),
        },
    );
}
