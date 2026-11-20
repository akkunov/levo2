'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

type OnCatalogReady = (pathname: string) => void;

const CatalogReadyContext = createContext<OnCatalogReady | null>(null);

function isCatalogDetailRoute(pathname: string): boolean {
    return /^\/catalogs\/[^/]+\/?$/.test(pathname);
}

function scrollToTopImmediately() {
    // Explicit "instant" overrides html { scroll-behavior: smooth }.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

/**
 * Next.js 15 can preserve a previous scroll offset when its first Page
 * element overlaps the viewport, especially during streamed navigation.
 *
 * Reset *forward* navigation to catalog detail pages only. Browser Back /
 * Forward and initial loads should keep native scroll restoration.
 *
 * When the async server page finishes streaming, a CatalogContentReady
 * signal reconciles scroll again in case content insertion moved the page.
 */
export function CatalogScrollProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const previousPath = useRef(pathname);
    const historyDestination = useRef<string | null>(null);
    const pendingForwardCatalog = useRef<string | null>(null);

    useEffect(() => {
        const onPopState = () => {
            historyDestination.current = window.location.pathname;
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    useLayoutEffect(() => {
        if (previousPath.current === pathname) return;

        previousPath.current = pathname;
        const isHistoryNavigation = historyDestination.current === pathname;
        historyDestination.current = null;
        pendingForwardCatalog.current = null;

        if (isHistoryNavigation || !isCatalogDetailRoute(pathname)) return;

        pendingForwardCatalog.current = pathname;
        scrollToTopImmediately();
    }, [pathname]);

    const onCatalogReady = useCallback<OnCatalogReady>((readyPath) => {
        if (pendingForwardCatalog.current !== readyPath) return;

        pendingForwardCatalog.current = null;
        scrollToTopImmediately();
        // Run after Next.js' own focus/scroll work for this streamed commit.
        window.requestAnimationFrame(() => {
            if (window.location.pathname === readyPath) scrollToTopImmediately();
        });
    }, []);

    return (
        <CatalogReadyContext.Provider value={onCatalogReady}>
            {children}
        </CatalogReadyContext.Provider>
    );
}

/** Render inside the resolved /catalogs/[slug] page, not its loading fallback. */
export function CatalogContentReady() {
    const pathname = usePathname();
    const onReady = useContext(CatalogReadyContext);

    useLayoutEffect(() => {
        onReady?.(pathname);
    }, [onReady, pathname]);

    return null;
}
