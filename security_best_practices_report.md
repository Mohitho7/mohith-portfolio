# Security Best Practices Report

## Executive Summary

This review found two critical deployment blockers and several high-impact hardening gaps in the admin/auth surface. The critical issues are now fixed in code: the app no longer ships with seeded default admin credentials, and production now refuses to boot without `NEXTAUTH_SECRET`.

The largest remaining checks are operational rather than code-level: verify edge/CDN rate limiting or WAF controls in front of the app, and rerun a full `next build` on a machine/path that is not locking `.next\trace`.

## Critical

### SEC-001: Hardcoded seeded admin credentials
Status: Fixed

Impact: Anyone who knew or guessed the shipped seed credentials could take over the admin panel after deployment.

Evidence:
- `prisma/seed.ts:7`
- `prisma/seed.ts:10`
- `prisma/seed.ts:23`

Fix:
- Admin seeding now requires `ADMIN_SEED_USERNAME` and `ADMIN_SEED_PASSWORD`.
- If those env vars are absent, the seed script skips admin creation instead of installing a predictable account.

### SEC-002: Production auth secret fallback
Status: Fixed

Impact: A fallback auth secret makes session/JWT protection predictable and unsafe for production deployment.

Evidence:
- `src/lib/auth.ts:8`
- `src/lib/auth.ts:10`
- `src/lib/auth.ts:68`

Fix:
- Production now throws at startup if `NEXTAUTH_SECRET` is missing.
- Secure cookies and bounded session lifetimes were also made explicit.

## High

### SEC-003: Cookie-authenticated admin mutations lacked explicit CSRF-style request enforcement
Status: Fixed

Impact: Authenticated state-changing routes were relying on session cookies plus middleware, but not on strict same-origin request validation.

Evidence:
- `src/lib/api-security.ts:75`
- `src/lib/api-security.ts:88`
- `src/lib/api-security.ts:107`
- `src/lib/admin-fetch.ts:5`
- `src/app/api/blogs/route.ts:26`

Fix:
- Added centralized admin request guards that require:
  - a valid server-side session
  - `X-Requested-With: XMLHttpRequest`
  - trusted `Origin`
  - trusted `Sec-Fetch-Site`
  - `application/json` for JSON mutations
- Updated admin mutation calls to send the required headers consistently.

### SEC-004: Several write endpoints trusted raw request bodies too directly
Status: Fixed

Impact: Over-posting, invalid payloads, and unsafe URL schemes could be persisted or used to mutate content unexpectedly.

Evidence:
- `src/lib/validations.ts:8`
- `src/lib/validations.ts:38`
- `src/app/api/blogs/route.ts:34`
- `src/app/api/projects/[id]/route.ts:28`

Fix:
- Added centralized safe URL validation for public links/assets/navigation targets.
- Enforced schema validation across the previously loose blog/project/skill/testimonial/timeline/category routes.
- Added CUID validation for route params before delete/update operations.

### SEC-005: Unauthenticated blog API callers could read unpublished posts
Status: Fixed

Impact: Draft or unpublished content could be exposed through the API even though the public UI only displayed published posts.

Evidence:
- `src/app/api/blogs/route.ts:13`
- `src/app/api/blogs/route.ts:17`

Fix:
- Unauthenticated `GET /api/blogs` now returns only published posts.
- Authenticated admin sessions still receive the full list.

### SEC-006: Unsafe admin-managed links could reach the public UI
Status: Fixed

Impact: Admin-configured links could have used unexpected schemes or unsafe new-tab behavior.

Evidence:
- `src/lib/validations.ts:27`
- `src/components/HeroSection.tsx:109`
- `src/components/ContactSection.tsx:35`
- `src/app/projects/page.tsx:46`

Fix:
- Navigation fields now allow only anchors, internal paths, or `http/https`.
- Public external links now use `rel="noopener noreferrer"`.
- Public project/contact rendering now filters unsafe URLs before rendering.

## Medium

### SEC-007: Security header baseline was incomplete
Status: Fixed

Impact: Missing CSP and related headers reduce browser-enforced mitigation coverage against XSS, clickjacking, and document isolation issues.

Evidence:
- `next.config.ts:19`
- `next.config.ts:22`
- `next.config.ts:36`
- `next.config.ts:67`

Fix:
- Added a centralized CSP baseline.
- Added `Referrer-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `Origin-Agent-Cluster`, and stronger `Permissions-Policy`.
- Disabled `X-Powered-By`.
- Added `no-store` for `/admin/*` and `/api/auth/*`.

### SEC-008: Admin pages were still touching Prisma before page-level auth completed
Status: Fixed

Impact: Middleware was the primary guard, but page code still performed protected data access before checking the session.

Evidence:
- `src/lib/admin-session.ts:8`
- `src/app/admin/layout.tsx:9`
- `src/app/admin/page.tsx:10`

Fix:
- Added a shared admin page session guard that redirects unauthenticated users before protected page queries run.
- Applied it across the admin layout and admin pages.

## Remaining Verification Items

### OPS-001: Edge rate limiting / WAF not visible in app code
Status: Not visible in repo

This repository does not show an upstream reverse proxy, CDN ruleset, or WAF configuration. Before deployment, verify:
- IP-based throttling for `/api/auth/*`
- generic request rate limiting for `/api/*`
- malformed request / body-size handling at the edge

### OPS-002: Full local Next production build could not be completed in this workspace
Status: Environment issue

The local environment blocked `next build` with `EPERM` on `.next\trace`. A TypeScript compile check succeeded with:

`node .\node_modules\typescript\bin\tsc --noEmit --incremental false`

Before deploy, rerun a clean production build from a path that does not have the current `.next` file lock behavior.

### OPS-003: Repo-wide lint baseline is not clean
Status: Pre-existing

`npm run lint` still reports many pre-existing issues, especially `any` usage and some JSX text escaping problems outside the security changes. These are not all security bugs, but they do reduce confidence in automated gating and should be cleaned up separately.
