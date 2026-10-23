const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');

export type PageViewEvent = {
  path: string;
  title: string;
  referrer?: string;
  sessionId: string;
  occurredAt: string;
};

function getSessionId(): string {
  const key = 'levo-analytics-session';
  let id = window.sessionStorage.getItem(key);
  if (!id) {
    id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * Sends an anonymous page-view event to the backend.
 * Requires POST /analytics/events on the API; a failed request never blocks navigation.
 */
export async function trackPageView(path: string, title: string): Promise<void> {
  if (!API_URL || path.startsWith('/admin') || path.startsWith('/api/')) return;

  const event: PageViewEvent = {
    path,
    title,
    referrer: document.referrer || undefined,
    sessionId: getSessionId(),
    occurredAt: new Date().toISOString(),
  };

  try {
    await fetch(`${API_URL}/analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true,
      credentials: 'omit',
    });
  } catch {
    // Analytics is best-effort and must not affect storefront rendering.
  }
}
