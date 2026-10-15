import {CatalogProduct} from "@/types";
import { apiFetch } from './client';
import { fetchCatalogProducts as fetchCatalogProductsBySlug } from './catalogs';

export { fetchCatalogProductsBySlug as fetchCatalogProducts };

export interface ApiProduct {
    id: number;
    title: string;
    slug: string | null;
    price: number | string | null;
    oldPrice: number | string | null;
    image: string | null;
    tag: string | null;
    description: string | null;
    specs: string[];
    catalog?: {
        name: string;
        slug: string;
    } | null;
    images?: {
        url: string;
        alt?: string | null;
    }[];
}

export interface StoreProduct {
    id: number;
    name: string;
    slug: string | null;
    category: string;
    image: string;
    price: number;
    oldPrice: number | null;
    tag: string | null;
    description: string | null;
    specs: string[];
}

interface ProductsResponse {
    items: ApiProduct[];
    total: number;
    page: number;
    limit: number;
}

function mapProduct(product: ApiProduct): StoreProduct {
    return {
        id: product.id,
        name: product.title,
        slug: product.slug,
        category: product.catalog?.name ?? 'Бытовая техника',
        image:
            product.image ??
            product.images?.[0]?.url ??
            '/images/product-placeholder.png',
        price: Number(product.price ?? 0),
        oldPrice:
            product.oldPrice != null ? Number(product.oldPrice) : null,
        tag: product.tag,
        description: product.description,
        specs: product.specs ?? [],
    };
}

export const mapCatalogProduct = mapProduct;

async function fetchProductsList(path: string): Promise<StoreProduct[]> {
    const response = await apiFetch<ProductsResponse>(path);
    return response.items.map(mapProduct);
}

export async function fetchFeaturedProducts(): Promise<StoreProduct[]> {
    return fetchProductsList('/products/featured');
}

export async function fetchProductBySlug(
    slug: string,
): Promise<CatalogProduct | null> {
    try {
        return await apiFetch<CatalogProduct>(
            `/products/${encodeURIComponent(slug)}`,
        );
    } catch {
        return null;
    }
}

export async function fetchNewArrivals(): Promise<StoreProduct[]> {
    return fetchProductsList('/products?page=1&limit=4&sort=newest');
}
