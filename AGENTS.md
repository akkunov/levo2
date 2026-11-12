# AGENTS.md — LEVO storefront engineering and code-review policy

> Applies to the entire `akkunov/levo2` repository. Read this file and `SECURITY.md` before changing code. This is guidance for coding agents and maintainers; it is not a Google Core Web Vitals requirement.

## 1. Product and verified technology

- Product: LEVO KG public storefront and admin UI (`https://levo.kg`). Primary language: Russian; users commonly browse on mobile networks in Kyrgyzstan.
- Repository: **frontend only**. The NestJS/Prisma/PostgreSQL API is a separate project, configured through `NEXT_PUBLIC_API_URL`. Do not assume API or database code exists here.
- Current declared stack (check `package.json` and lockfile before changing): **Next.js 15.5.x, React 19, TypeScript 5.x, TanStack Query 5, Motion 14**, custom CSS (no Tailwind).
- Next.js **App Router**. Use Server Components by default and client components only for client interactivity. Do not introduce a framework, UI kit, state library, or a major-version upgrade without explicit scope and migration plan.
- Default branch at the time of this review: `dev`. Never commit directly to it during an automated refactor; propose changes on a feature branch/PR unless expressly instructed otherwise.

## 2. Project map

| Area | Purpose |
| --- | --- |
| `app/page.tsx` | Landing page, hero, metadata |
| `app/catalogs/`, `app/catalogs/[slug]/` | Catalog and SEO category routes |
| `app/products/[slug]/` | Product pages, hero and gallery |
| `app/admin/` | Admin/manager pages and client-side routing |
| `app/services/` | Service centers and client-loaded Yandex Maps |
| `app/layout.tsx`, `app/providers.tsx` | Global layout, providers, shared chrome |
| `components/storefront/` | Focused public catalog, product cards, grids, navigation, and shopping UI |
| `components/Header.tsx`, `components/Footer.tsx` | Global navigation and footer |
| `components/admin/`, `components/cart/`, `components/theme/` | Admin, shopping cart, themes |
| `hooks/` | TanStack Query hooks |
| `lib/api/` | Typed NestJS API clients |
| `lib/seo/`, `app/sitemap.ts`, `app/robots.ts` | Metadata, schema.org, crawl controls |
| `app/styles/`, `app/globals.css` | Global custom styles and design tokens |
| `public/` | Static images, logos, videos |

Consult `README.md` and actual implementations; README text can become stale.

## 3. Agent workflow — investigate, change, prove

1. **Baseline first:** identify the route, real LCP element, network waterfall, transferred image bytes, render-blocking resources, hydration, and current lab and field metrics. Do not guess a performance root cause based solely on a Lighthouse suggestion.
2. **Inventory impact:** identify affected frontend components, API contracts, SSR/CSR boundaries, cache semantics, admin permissions, SEO and themes.
3. **Prioritize:** critical vulnerabilities and functional breakages, then mobile real-user LCP/FCP, image transfer/caching, accessibility, maintainability. Separate proven findings from hypotheses.
4. **Keep changes scoped and reviewable:** one root cause per PR or coherent change set; explain intent, trade-offs, compatibility and expected measurable impact. Do not change prices, products, URLs, SEO copy or visual design without a reason.
5. **Verify:** run installed project checks, relevant route tests, manual smoke tests and Lighthouse/DevTools comparison. Include before/after data and failures in the report. Never claim tests passed unless executed.
6. **Protect production:** avoid destructive operations, altering database schema, or swapping credentials. Do not deploy, force-push or rewrite history without explicit authorization.

## 4. Performance objectives (mobile first)

Real-user targets at the 75th percentile, evaluated with CrUX over its rolling 28-day window: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**. Track FCP, TTFB and Lighthouse separately. A lab score of 90 does not mean that field Core Web Vitals have passed.

The supplied 2026-11-12 mobile baseline was: **CrUX LCP 5.8 s, FCP 4.8 s, TTFB 0.8 s, CLS 0, INP unavailable; Lighthouse LCP 3.1 s, FCP 0.9 s, TBT 0, CLS 0, performance 90**. Do not confuse lab and field datasets; remeasure on the same URL, device class and network assumptions.

### LCP and images

- Identify the **actual** LCP element and its request chain by route; home, category and product pages can differ.
- Review `app/page.tsx`: the hero uses an externally hosted Unsplash image. Validate network timing and test a properly optimized, first-party image if warranted. Preserve the design.
- Product-card and gallery image optimization has been enabled in the refactor branch. Verify CDN hosts, generated `srcset`, format, image fidelity and transferred bytes before merging.
- Set responsive `sizes` for every `Image` using `fill`. Reserve `priority` (Next.js **15**) for the verified above-the-fold LCP image and avoid blindly prioritizing many offscreen images; use `loading="lazy"` for offscreen media. Do not use deprecated/Next.js 16-only migration advice as if it applied to this repository.
- Pre-compress source assets; use AVIF/WebP when effective; retain meaningful `alt`, set stable aspect ratios and avoid layout shifts.
- Ensure product cards do not unnecessarily download two full-resolution images before user interaction. Preserve desktop hover/mobile touch behavior and test it.
- Check caching headers on static assets, Next image responses and object storage separately; do not apply long-lived immutable caching to versionless or mutable API JSON.
- Review `public/video/` usage before shipping additional assets; do not assume an asset affects LCP merely because it exists in the repository.

### Rendering, data and JavaScript

- Keep public SEO content server rendered; prefer server-side catalog/product data for initial HTML. Use React Query for interactive/refetching needs, not as a reason to deliver an empty storefront then fetch everything after hydration.
- Public API fetches may use explicitly justified revalidation. **Never cache auth/session responses, admin mutations or user-specific data in a shared cache.** Preserve endpoint contracts and pagination.
- Split large client modules by responsibility only when it reduces coupling or shipped JS. Avoid unnecessary imports/providers in the root layout.
- Audit CSS imported globally from `app/globals.css`; move clearly route-specific styles closer to their routes when safe and measure changed critical CSS. Avoid gratuitous CSS churn.
- Use compositor-friendly `transform` and `opacity` animations; reduce above-the-fold animation delays; honor `prefers-reduced-motion`. Avoid hiding essential content until animations finish.
- Keep Yandex Maps scripts scoped to the services route; load once and clean up map instances. Never load map JS globally just for preloading.
- Preserve compatibility with small screens, slow 4G, keyboard navigation and both color themes.

## 5. Architecture, TypeScript and API contracts

- Use strict TypeScript; no broad `any`, non-null assertions or `@ts-ignore` without justification. Prefer small typed functions and named domain types.
- Route components should remain focused. Extract shared behaviors without building abstract layers solely for stylistic reasons.
- Put API transport, error normalization and URL construction in `lib/api/`. Validate and encode URL segments (`encodeURIComponent`); treat backend responses as untrusted at the browser boundary.
- Handle loading/error/empty/not-found states. Distinguish true 404 responses from transient API outages: do not mask all errors as `notFound()`.
- Keep client-only browser features isolated from Server Components. No unguarded access to `window`, `document`, `localStorage` or `sessionStorage` during server render.
- Preserve URLs, canonical tags, `robots`, sitemap, semantic headings and JSON-LD. Do not generate invented prices, stock status, ratings or schema properties.
- Keep admin RBAC enforced in NestJS API on **every protected endpoint**. Client redirects in `app/admin/layout.tsx` are UX, **not** security enforcement.
- Never silently modify public API types to hide a backend mismatch. Document and coordinate backend changes explicitly.

## 6. Security invariants

- Follow `SECURITY.md`; treat all API responses, filenames, query parameters, CMS content and third-party callbacks as untrusted.
- Never commit `.env*`, credentials, private keys, JWTs or customer data. Public `NEXT_PUBLIC_*` variables are visible in browser bundles and cannot contain secrets. Public map API keys must be constrained by allowed origins and provider limits.
- Review token handling in `lib/api/client.ts`: access tokens are stored in `localStorage` today. Treat this as a risk under XSS; plan any migration to HttpOnly/Secure/SameSite cookies together with backend CORS/CSRF/session changes. Do **not** switch authentication modes in an isolated frontend-only refactor.
- `next.config.ts` currently allows wildcard image hosts including HTTP. Replace with a minimal, audited HTTPS domain allowlist, test all current image sources, and avoid permitting intranet or arbitrary destinations.
- Do not render unescaped content in HTML strings or `dangerouslySetInnerHTML`. In `app/services/page.tsx`, check HTML escaping before interpolating API-controlled map popup content.
- Require server-side authentication, authorization, input validation, upload size/type/content checks and rate limiting in the NestJS backend. A frontend UI validation check is not sufficient.
- Maintain headers without blindly applying a blocking CSP: account for Next.js inline scripts, image origins, Yandex Maps and other real dependencies; roll out and verify incrementally.

## 7. Accessibility and design

- Preserve visual identity, CSS tokens from `app/styles/00-tokens.css`, responsive breakpoints, light/dark themes and content in Russian.
- Use semantic interactive elements, meaningful focus indicators, labels, keyboard support, good text contrast and minimum-touch-target considerations.
- Review `components/Header.tsx` for desktop navigation accessibility: `aria-hidden={!menuOpen}` can mark a visible desktop nav as hidden to assistive technology.
- Honor reduced-motion preferences and avoid disabling accessibility to improve synthetic Lighthouse scores.

## 8. Required checks and evidence

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
npm audit --omit=dev
```

These are checks to **attempt**, not claims that they currently pass. The repository currently defines `dev`, `build`, `start`, and `lint` scripts; do not claim existing unit or e2e test scripts without adding them. Verify ESLint 9 configuration before relying on `npm run lint`; if the command fails, report and fix configuration rather than skipping checks.

Manually test: home; catalogs; category route; product details/gallery; mobile nav; cart; admin login/role restrictions; services map; SEO metadata/robots/sitemap; desktop/mobile light and dark themes. Verify HTTP statuses and API error handling.

Every code-review outcome must contain:

- **Findings by severity**, file paths and reproduction/verification steps.
- **Changes**: small, reasoned diffs and impact analysis.
- **Security and compatibility**: auth, API, SEO, accessibility risks.
- **Performance**: before/after traces, transfer sizes, LCP image and render delay, lab conditions; field metrics as they become available.
- **Verification**: exact commands executed, pass/fail and manual tests. Clearly distinguish unverified assumptions.

## 9. Immediate review backlog (not yet fixed)

1. Verify image optimization / LCP chain in home and product routes (`unoptimized`, hero URLs and first-paint behavior).
2. Reduce permissive `images.remotePatterns`; ensure legitimate CDN sources remain functional.
3. Audit persistent JWT handling, admin access and API enforcement in the separate backend.
4. Check that the unified `/noPoster.jpg` placeholder and all product/category image URLs load correctly.
5. Audit client-fetched above-the-fold content and route-level CSS/JS impact.
6. Verify desktop menu accessibility and compare mobile motion/contrast after refactoring.
7. Maintain GitHub Actions checks for TypeScript, ESLint, build, and CSS inventory. Add route smoke tests and comparable Lighthouse measurements before release.
