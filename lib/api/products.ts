import {CatalogProduct} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

async function request<T>(path: string): Promise<T> {
    if (!API_URL) {
        throw new Error('Не задан NEXT_PUBLIC_API_URL');
    }

    const response = await fetch(`${API_URL}${path}`);

    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
    }

    return response.json() as Promise<T>;
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
export function mapCatalogProduct(
    product: CatalogProduct,
): StoreProduct {
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
export async function fetchFeaturedProducts(): Promise<StoreProduct[]> {
    const response = await request<ProductsResponse>(
        '/products/featured',
    );

    return response.items.map(mapProduct);
}

export async function fetchCatalogProducts(
    slug: string,
    page = 1,
    limit = 12,
) {
    const response = await request<ProductsResponse>(
        `/catalogs/${encodeURIComponent(slug)}/products?page=${page}&limit=${limit}`,
    );

    return {
        ...response,
        items: response.items.map(mapProduct),
    };
}

export async function fetchProductBySlug(
    slug: string,
): Promise<CatalogProduct | null> {
    try {
        return await request<CatalogProduct>(
            `/products/${encodeURIComponent(slug)}`,
        );
    } catch {
        return null;
    }
}

export async function fetchNewArrivals(): Promise<StoreProduct[]> {
    const response = await request<ProductsResponse>(
        '/products?page=1&limit=4&sort=newest',
    );

    return response.items.map(mapProduct);
}
