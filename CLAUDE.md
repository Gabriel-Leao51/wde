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

## Known, intentionally-tracked bugs

Several real bugs in this app are documented and covered by regression tests in the companion test repo (`docs/bugs/BUG-*.md`), e.g. broken admin authorization, missing security headers, a hardcoded session secret. Don't "fix" security/auth behavior here without checking that repo first — some of it is deliberately left in place as a demonstrated finding until the test repo's roadmap says otherwise.

## Redesign (Phase C of the test repo's roadmap)

The visual redesign of this app (real product photos, rebuilt `base.css` design tokens, new page layouts) is driven from the test repo's `ROADMAP.md`, using its Playwright suite as the regression net. Expect page-by-page changes staged against that plan rather than ad hoc.
