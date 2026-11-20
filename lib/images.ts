/**
 * Vercel's Image Optimization endpoint can return HTTP 402 when the
 * account reaches its transformation quota. Public Cloudflare R2 assets
 * are already served as images, so bypass only those URLs.
 *
 * Keep Next.js optimization for local LCP/hero assets.
 * Longer term: serve pre-sized responsive variants from R2 or an image CDN.
 */
const PUBLIC_R2_HOST = 'pub-70284751a4884f90bf14b3714880cdef.r2.dev';

export function bypassVercelImageOptimizer(src: string | null | undefined): boolean {
    if (!src) return false;
    try {
        const url = new URL(src);
        return url.protocol === 'https:' && url.hostname === PUBLIC_R2_HOST;
    } catch {
        return false;
    }
}
