'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics/client';

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const path = query ? `${pathname}?${query}` : pathname;
    void trackPageView(path, document.title);
  }, [pathname, query]);

  return null;
}
