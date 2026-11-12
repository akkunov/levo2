# Security Policy — LEVO storefront

This policy covers the **frontend repository** `akkunov/levo2` (Next.js), not the separate NestJS backend or its database. Read `AGENTS.md` for implementation and review conventions.

## Supported code

Security fixes should target the **currently deployed production release** and the maintained `dev` branch. Confirm the exact deployment commit before declaring a release affected or fixed. Historical, unmaintained revisions are not guaranteed support. Do not assume that the default GitHub branch is identical to the production deployment.

## Privately reporting a vulnerability

Please **do not open a public GitHub issue, discussion or pull request containing exploit details, tokens, personal data or a working proof of concept**.

1. Prefer GitHub's **Security → Advisories → Report a vulnerability** flow for this repository, **if private vulnerability reporting is enabled**.
2. If unavailable, contact the repository owner (`akkunov`) using an established private channel and ask for a confidential reporting method. Do not send sensitive exploit details publicly.
3. Include affected path/version/commit, steps to reproduce, expected vs actual behavior, impact, required access, and a minimal **redacted** proof of concept. Remove secrets and any personal information.
4. Allow maintainers to validate, remediate and coordinate disclosure. A response time or bug-bounty payment is **not** promised by this document.

Do not test against production users or data without authorization. No destructive tests, phishing, account takeover, denial-of-service or access to other people's accounts.

## Security model and trust boundaries

- **Browser:** all HTML, scripts and `NEXT_PUBLIC_*` values are public; browser storage and client routes are under user control.
- **Frontend:** Next.js App Router on a public host. Client-side checks and redirects are not an authorization boundary.
- **Backend:** a separate NestJS API that must authenticate requests and enforce `ADMIN`/`MANAGER` roles, input validation, rate limits and business rules.
- **Data and media:** product images are retrieved from remote origins; uploads/admin content and map popups must be considered untrusted.
- **External services:** Yandex Maps and CDNs require restricted keys/origins and explicit resource policies.

## Required protections

### Authentication and authorization

- All private API routes must verify token validity, expiration and user role **server-side**. Do not rely on `app/admin/layout.tsx` redirects for protection.
- `lib/api/client.ts` currently persists `levo_access_token` in `localStorage`; this is vulnerable to token theft if JavaScript injection occurs. Evaluate a coordinated migration to a secure BFF or **HttpOnly + Secure + SameSite** cookie session. Such a migration must include a CSRF policy, backend changes, safe CORS and logout/session invalidation; do not change storage in isolation.
- Avoid access tokens or credentials in URLs, logs, source maps, client errors or analytics events. Clear tokens on explicit logout, but do not treat clearing browser storage as server-side token revocation.
- Use rate limiting, account lockout/backoff where appropriate and audit logs for sensitive API endpoints; review on backend.

### Inputs, output encoding and XSS

- Treat API content, contact fields, form input, query strings and third-party data as untrusted. Prefer React text escaping; do not interpolate unescaped data into HTML.
- In `app/services/page.tsx`, map popup `balloonContent` is constructed from HTML strings. Escape untrusted fields or use an API-safe rendering strategy before consuming dynamic/backend data.
- Avoid `dangerouslySetInnerHTML` for user-provided data. For JSON-LD, serialize safely (for example escape `<` as `\\u003c` in generated script content) and verify the actual output.
- Assess CSP using Report-Only where feasible; test Next.js, required maps scripts, image CDNs and deployment behavior. No unreviewed broad `unsafe-inline` or `*` source policies.

### Remote images, SSRF and uploads

- `next.config.ts` currently permits arbitrary image hostnames and HTTP via wildcard `images.remotePatterns`. Narrow it to known, required **HTTPS** origins (object-storage/CDN/approved external media) after an asset inventory. Do not allow untrusted URL schemes or internal IP ranges through image proxies.
- Validate URL inputs before passing them to proxy/image endpoints. Consider image size limits, content type, redirects and image optimization resource usage.
- In the backend, require role authorization for uploads; validate actual magic bytes, allowlisted media types, dimensions, file size and safe generated filenames. Do not trust file extensions or client-provided MIME headers.
- Do not expose private object-storage write credentials or signed upload keys in the frontend.

### Secrets, configuration and dependencies

- Never commit `.env`, `.env.local`, private keys, session secrets, production JWTs, API credentials or database connection strings. Use deployment secrets for confidential values and rotation procedures for exposures.
- `NEXT_PUBLIC_*` variables are not secrets. Any browser-visible Yandex Maps key must be locked down to approved origins and provider quotas.
- Keep Next.js, React and dependencies patched within supported versions. Review advisories, `npm audit`, GitHub Dependabot/secret scanning when available; verify functionality after upgrades.
- Use least-privilege deployment tokens, branch protection and PR review for sensitive changes. Do not publish production credentials in CI logs.

### HTTP, cookies, requests and logs

- Serve production exclusively over HTTPS; evaluate effective HSTS, secure cookies, frame protections, Referrer-Policy, COOP and CSP without breaking third-party integrations.
- Keep backend CORS origin allowlists exact. Do not set credentialed CORS to a wildcard. Check both `https://levo.kg` and only those additional origins that are actually required.
- Do not cache personalized/admin/API auth responses in public/shared caches. Separate immutable static-asset caches from dynamic product data and user sessions.
- Avoid recording passwords, tokens, personally identifiable details or full user-supplied request bodies in analytics, telemetry or console logs.

## Security review checklist for a PR

- [ ] No secrets, tokens, PII or real production data added.
- [ ] Server-side authorization unchanged or strengthened; API roles reviewed.
- [ ] Untrusted data safely validated and encoded; no new XSS sink.
- [ ] External image/script origins limited; no unsafe new proxy access.
- [ ] Cookie, CORS, CSRF and cache semantics reviewed for auth changes.
- [ ] Upload rules and error paths checked when relevant.
- [ ] Dependencies audited; vulnerabilities triaged, not silently ignored.
- [ ] Relevant tests/build executed, with results and residual risks documented.

## Disclosure and remediation

Triage by exploitability and customer impact; prioritize credential leakage, privilege escalation, injection and sensitive-data exposure. Fix privately, rotate exposed credentials, assess logs and affected sessions, then publish a proportionate advisory after mitigation when appropriate. This policy is guidance: it does not assert that every security control listed above is already implemented.
