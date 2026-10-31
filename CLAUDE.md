# WDE Shop (app)

E-commerce demo app (Express/EJS, vanilla JS/CSS, MongoDB). Stays JavaScript — the companion test suite (`../wde_automation_typescript`, formerly `../wde_automacao`) is what's migrating to Playwright/TypeScript. See that repo's `ROADMAP.md` for the full plan.

## Running locally

```bash
cp .env.example .env
# set STRIPE_KEY to a test key (sk_test_...)
docker compose up --build
```

- App: `http://localhost:3000`
- MongoDB: `127.0.0.1:27017`
- Mailpit (SMTP capture + REST API): UI/API at `127.0.0.1:8025`, SMTP at `127.0.0.1:1025`

The `seed` service populates the database automatically on first run. To reset to fresh seed data: `docker compose down -v && docker compose up --build`.

## Test credentials

Never paste credential values into code, commits, or chat. They're defined in the test suite's fixtures (`../wde_automation_typescript`, ported from the Python suite's `test_data/users.json`) — reference that, don't hardcode new ones here.

## Security fixes (2026-10-31)

The bugs earlier tracked as deliberate findings are fixed, and the test repo's specs assert the secure behaviour (no more `test.fail()`): admin routes check `req.baseUrl` (BUG-AUTH-001/002); helmet and no `x-powered-by` (BUG-SEC-002); the CSRF token is a hidden field in the product form, with `middlewares/admin-multipart.js` parsing the multipart body before csurf (BUG-SEC-003); session cookie is HttpOnly, SameSite=Lax and `secure: 'auto'` (BUG-SEC-004); `NODE_ENV=production` in the Dockerfile plus a null-safe nav partial (BUG-INFO-001); the session secret comes from `SESSION_SECRET`, or a random per-process value when unset (BUG-SEC-005). Behind an HTTPS proxy set `TRUST_PROXY=1`.

## Redesign (Phase C of the test repo's roadmap)

The visual redesign of this app (real product photos, rebuilt `base.css` design tokens, new page layouts) is driven from the test repo's `ROADMAP.md`, using its Playwright suite as the regression net. Expect page-by-page changes staged against that plan rather than ad hoc.
