/**
 * Recover original public R2 image URLs from legacy saved Next.js
 * /_next/image?url=... links.
 *
 * Some catalog records contain Vercel's generated transformation URLs
 * (sometimes nested multiple times) rather than the source R2 URL.
 * Feeding those links back into next/image causes repeated optimization,
 * and Vercel may return HTTP 402 when its Image Optimization quota is met.
 *
 * Unwrap ONLY trusted LEVO optimizer hosts and the known public R2 host.
 * Never treat a foreign /_next/image URL as a trusted redirect.
 */
const PUBLIC_R2_HOST = 'pub-70284751a4884f90bf14b3714880cdef.r2.dev';

const LEVO_IMAGE_HOSTS = new Set([
    'levo.kg',
    'www.levo.kg',
    'levo2-ten.vercel.app',
]);

export function normalizeImageUrl(src: string | null | undefined): string {
    if (!src) return '';

    let current = src.trim();

    // Bounded to prevent cycles and untrusted indefinite URL nesting.
    for (let depth = 0; depth < 5; depth += 1) {
        let proxy: URL;
        try {
            proxy = new URL(current, 'https://levo.kg');
        } catch {
            break;
        }

        const trustedProxy = (
            proxy.pathname === '/_next/image' &&
            proxy.protocol === 'https:' &&
            LEVO_IMAGE_HOSTS.has(proxy.hostname)
        );
        if (!trustedProxy) break;

        const original = proxy.searchParams.get('url');
        if (!original || original === current) break;

        let originalUrl: URL;
        try {
            originalUrl = new URL(original, 'https://levo.kg');
        } catch {
            break;
        }

        // Allow only another LEVO optimization layer, the public R2 origin
        // or a known local image path, not arbitrary remote URLs.
        const isPublicR2 = (
            originalUrl.protocol === 'https:' &&
            originalUrl.hostname === PUBLIC_R2_HOST
        );
        const isNestedLevoProxy = (
            originalUrl.protocol === 'https:' &&
            LEVO_IMAGE_HOSTS.has(originalUrl.hostname) &&
            originalUrl.pathname === '/_next/image'
        );
        const isLocalImage = (
            original.startsWith('/') &&
            !original.startsWith('//') &&
            (originalUrl.pathname.startsWith('/images/') ||
                originalUrl.pathname.startsWith('/uploads/') ||
                originalUrl.pathname.startsWith('/noPoster'))
        );

        if (!isPublicR2 && !isNestedLevoProxy && !isLocalImage) break;

        current = isPublicR2 ? originalUrl.href : original;
    }

    return current;
}

export function bypassVercelImageOptimizer(src: string | null | undefined): boolean {
    const normalized = normalizeImageUrl(src);

    if (!normalized) return false;

    try {
        const url = new URL(normalized);
        return url.protocol === 'https:' && url.hostname === PUBLIC_R2_HOST;
    } catch {
        return false;
    }
}

/** Keeps API and SEO data pointing to original photos, not cached proxies. */
export function normalizeCatalogImages<T extends import('@/types/catalog').Catalog>(
    catalog: T,
): T {
    return {
        ...catalog,
        image: catalog.image ? normalizeImageUrl(catalog.image) : null,
        ...(catalog.children ? {
            children: catalog.children.map(normalizeCatalogImages),
        } : {}),
    } as T;
}

export function normalizeProductImages<T extends {
    image: string | null;
    images?: Array<{ url: string }>;
}>(product: T): T {
    return {
        ...product,
        image: product.image ? normalizeImageUrl(product.image) : null,
        ...(product.images ? {
            images: product.images.map((image) => ({
                ...image,
                url: normalizeImageUrl(image.url),
            })),
        } : {}),
    } as T;
}
