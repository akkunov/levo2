'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics/client';

export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    void trackPageView(pathname, document.title);
  }, [pathname]);

  return null;
}
