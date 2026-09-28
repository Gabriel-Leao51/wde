# WDE Shop — design direction

Phase C (sessions 14–30) of the test repo's `ROADMAP.md` redesigns WDE to look like a real online store. This file records the direction, and `public/styles/tokens.css` puts it into practice. Open `docs/design/specimen.html` in a browser to see every token rendered.

## Direction in one line

**A bright, warm-neutral general store**: white product surfaces, stone-grey structure, one confident orange for actions. Product photos carry the colour, and the UI stays out of their way.

The current app is a dark, amber-on-brown theme. The redesign flips to a light theme by default, with a proper dark theme alongside it (see [Dark mode](#dark-mode)). It keeps orange as the one thread of continuity with the old identity, deepened until white text on it passes WCAG AA. That same orange works unchanged in both themes.

## References

WDE sells across six departments: Electronics, Gaming, Furniture, Home, Office and Sports. No single store covers that mix, so each reference supplies one layer. These are patterns taken from using the stores, not values copied from their CSS; no brand colours or assets are reused.

| Store                             | What we take                                                                                                                                                                                                              | Where it lands                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **IKEA** (furniture/home)         | Price as the loudest thing on a card: bold, large, tabular numerals. The product name sits under a small uppercase category label. Cards have no chrome, just a photo on a light well. Department tiles on the home page. | Product card (19), home page tiles (18), `--color-price`       |
| **Best Buy** (electronics/gaming) | A dense but scannable listing: a left filter sidebar with facet groups, a result count and sort above the grid, and an unmistakable add-to-cart button. The cart has a sticky order-summary panel beside the line items.  | Listing parts 1–2 (19–20), cart summary (22), `--color-action` |
| **Muji** (home/office)            | Restraint. Warm off-white and stone neutrals instead of blue-greys, generous whitespace, few colours, and small letter-spaced uppercase labels for structure instead of heavy borders.                                    | Neutral ramp, `--letter-spacing-wide` eyebrows, spacing scale  |

## Tokens

All in `public/styles/tokens.css`, in two layers. **Primitives** (`--color-neutral-500`, `--color-brand-600`) are raw values. **Semantic aliases** (`--color-text-muted`, `--color-action`) are what component CSS uses. Components never reference a primitive directly, so a future dark theme only remaps the aliases.

- **Colour.**
  - Warm "stone" neutrals `0–900`, a brand orange ramp `50–900`, and success/warning/danger/info pairs for status badges.
  - Contrast was measured, not eyeballed, and the ratios are in comments next to each value. Body text is 17.2:1. Muted text (`neutral-600`) is 6.8:1. The CTA is white on `brand-600`, 5.2:1. Links (`brand-700`) are 6.8:1, and input borders (`neutral-400`) are 3.6:1, which meets WCAG 1.4.11's 3:1 for non-text UI.
  - `brand-500` fails AA for text and is marked decorative-only.
- **Primary vs secondary actions.**
  - Orange means "move toward buying": Add to cart, Checkout, the hero CTA. Everything else primary-ish (Save, Log in, admin actions) uses the near-black secondary button, and Cancel/Back use a ghost button.
  - This keeps orange rare enough to mean something.
- **Type.**
  - One family, **Inter Variable**, self-hosted (see below).
  - Scale from 12 to 36px in fixed rem steps, plus one fluid `--font-size-5xl` (36→56px) reserved for the home hero.
  - Weights 400/500/600/700. Headings from `2xl` up get `-0.02em` tracking, and uppercase eyebrows and table headers get `+0.06em`.
  - Prices use `font-variant-numeric: tabular-nums` so columns of prices align.
- **Spacing.**
  - A 4px grid, `--space-0-5` (2px) to `--space-24` (96px).
  - `--space-1/2/4/6/8` keep the old `base.css` names and values, so untouched page CSS keeps working while pages are redesigned one at a time.
- **Radii.** `sm` 4 (badges), `md` 8 (buttons, inputs), `lg` 12 (cards), `xl` 16 (hero, modals), `full` (pills, cart count). They are soft but not bubbly, so the store reads as "retail", not "app".
- **Shadows.**
  - Four elevations, tinted from `neutral-900` rather than pure black so they stay warm on the stone background.
  - Cards are flat with a 1px border at rest and only lift (`--shadow-md`) on hover.
- **Layout.**
  - `--container-max` 1280px for header, listing and footer; `--container-narrow` 640px for auth cards and forms.
  - `--control-height` 44px, so every button and input meets the touch-target size.
  - Breakpoints are 640/768/1024/1280. They're listed as a comment because custom properties can't be used inside `@media`.
- **Motion and layers.**
  - Three durations and one ease-out curve, all zeroed under `prefers-reduced-motion`.
  - A small z-index scale: dropdown < header < overlay < modal < toast.
- **Focus.** A 2px blue (`info-600`) outline plus a soft ring. Blue is deliberately not the brand orange, so focus is never confused with the CTA colour.

## Font: Inter Variable, self-hosted

- **Why Inter:**
  - Excellent tabular numerals (prices, order totals, admin tables).
  - A variable weight axis, so a single 48 KB file covers every weight we use.
  - Full Latin-1 coverage, which includes Portuguese (`ã`, `ç`, `é`) for the `pt` locale.
  - Neutral enough to sit under product photography.
- **Source.** The `latin-wght-normal` subset from the `@fontsource-variable/inter` 5.3.0 npm package, copied to `public/fonts/inter/` together with its licence (`OFL.txt`, SIL Open Font License 1.1, which permits bundling and redistribution).
- **Why self-hosted.** Replacing the Google Fonts `Montserrat` request removes a third-party call on every page view (a privacy and performance win), and it makes the visual-regression baselines independent of an external CDN.
- **`@font-face`.** It lives at the top of `tokens.css` with `font-display: swap` and a URL relative to the stylesheet, so it resolves both when the app serves it and when the specimen is opened from disk.

## Product images

Decided in session 14, implemented in session 15.

**Where things stand.** All 24 seed products use Unsplash photos, fetched into `product-data/images/` as square WebP. The old SVG placeholder generator and the 3 unknown-provenance files are gone. The catalogue lives in `scripts/seed-products.js` (names, prices, PT translations, image file); `scripts/seed.js` only inserts it.

**Licence.**

- Only photos under the free **Unsplash License** or **Pexels License** are used. Both allow commercial use and modification without attribution.
- **Unsplash+** photos are excluded, since they come under a different, paid licence.
- Neither licence grants trademark or model rights. So: no photos where a third-party logo or brand is legible, and no photos where a recognisable person is the subject.
- We credit every photographer anyway (see Manifest below).

**Selection criteria.**

- The photo shows **one clear product** that can be cropped to 1:1 without losing it.
- It has a **soft, mid-tone or neutral background**: studio, tabletop or lightly styled. Pure-white cutouts and busy lifestyle scenes are both out.
- One consistent look across the catalogue matters more than any single "best" photo.
- The mid-tone background rule exists because of dark mode. White cutouts glare against a dark page, and mid-tone backgrounds sit comfortably in both themes, so no CSS filter on product photos is needed.
- **Photo first, name second.** Session 15 also rewrites the seed names and prices, so each product is named after what the chosen photo actually shows. A generic photo isn't forced to fit an old name.

**Curation workflow.**

1. Claude searches Unsplash and Pexels in the browser pane and records candidates in the manifest.
2. Claude builds a **contact sheet**: a local HTML page that previews every candidate from its source CDN, with name, department and credit.
3. The user approves or swaps photos on the contact sheet **before anything is downloaded or committed**.

**Manifest: `product-data/image-sources.json`.**

- One entry per product: `slug`, `file` (`<slug>.webp`), `source` (`unsplash` | `pexels`), `pageUrl`, `downloadUrl`, `photographer`, `photographerUrl`, `license`, and an optional `crop` focal point (for example `"north"` or `{ left, top }`) for photos where a centred square crop misses the product.
- This file is both the licence record and the credits list. The README's credits section and a footer "Photo credits" link (session 18) are generated from it.

**Fetch script: `scripts/fetch-product-images.js`**, run as `npm run images:fetch`.

- It downloads each `downloadUrl` at ≥1600px from the source CDN.
- It then processes the image locally with **`sharp`** (a devDependency; the Docker image runs `npm ci --omit=dev`, so it stays out of the image): cover-crop to 1:1 (honouring `crop`), resize to **800×800**, encode as **WebP at quality ~80**, and strip EXIF/metadata. That gives roughly 40–90 KB per file.
- 800px covers a ~290px grid card at 2× and the detail page. A second `srcset` size is only added if a later performance check asks for it.
- The script is idempotent: it skips files that already exist, and `--force` re-fetches.
- No API keys are involved: it only fetches known CDN URLs for photos already approved.

**Committed, not hotlinked.**

- The output WebPs are committed to `product-data/images/`.
- The script is **not** run by the seed, Docker or CI. It's a one-off maintenance tool.
- Why:
  - Visual-regression baselines need byte-identical images on every run.
  - CI shouldn't depend on a third-party CDN.
  - Hotlinked photos can disappear.
  - It matches the no-third-party-requests stance taken for the font.

**Impact on tests (session 15 must handle these).**

- The fixed seed product `000000000000000000000001` keeps its id, but it gets a new photo, name and price. That changes the product-detail visual baseline, which must be regenerated via the `visual-baselines` skill.
- The test repo must be grepped for seed titles and prices hardcoded outside Mongo lookups before renaming anything.

## Dark mode

Decided in session 14. Built in from session 16, not retrofitted.

**Trigger: the system preference, overridable by the user.**

- With no choice made, the page follows `prefers-color-scheme`. This path needs no JavaScript.
- A **theme menu in the header** (session 17) offers **System / Light / Dark**. It reuses the language dropdown's disclosure pattern and marks the current choice with `aria-checked`.
  - It has three options because a two-state toggle can't get back to "follow the system".
- The choice is stored in a plain **`theme` cookie** (`light` | `dark`; `Path=/`, one year, `SameSite=Lax`), and choosing System deletes it.
  - The server-side session is deliberately not used. The test suite shares one server session per saved login, and a theme stored there would leak between tests. A cookie belongs to the browser context.
- The menu's JS sets the cookie and flips the attribute immediately, with no reload.
- On each request, a small middleware reads the cookie from `req.headers.cookie`. It accepts only `light` or `dark` and exposes the value as `res.locals.theme`. `head.ejs` then renders `<html data-theme="…">`, so the first paint is already the right theme with no flash.

**Mechanism: `color-scheme` + `light-dark()`, one line per alias.**

```css
:root {
  color-scheme: light dark;
}
:root[data-theme="light"] {
  color-scheme: light;
}
:root[data-theme="dark"] {
  color-scheme: dark;
}
:root {
  --color-bg: light-dark(var(--color-neutral-0), #141311); /* … */
}
```

- Each semantic alias holds both of its values in one place, and there's no duplicated `@media` + `[data-theme]` block to keep in sync.
- `color-scheme` also switches native form controls and scrollbars.
- Shadows use `light-dark()` in their colour part.
- `light-dark()` needs Chrome 123+, Firefox 120+ or Safari 17.5+. Every Playwright browser qualifies, and older browsers fall back to the light values, which is acceptable here.
- Components still reference only semantic aliases. **A primitive used directly in page CSS is a dark-mode bug.**

**Dark palette** (values planned now, added to `tokens.css` in session 16). Contrast was measured the same way as the light set:

| Alias                         | Dark value                                                                                                     | Check                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `bg`                          | `#141311`                                                                                                      | text 16.5:1                                  |
| `bg-subtle`                   | `#1b1a17`                                                                                                      |                                              |
| `surface`                     | `#1f1d1b`                                                                                                      | text 14.9:1                                  |
| `surface-muted` (image wells) | `#2a2825`                                                                                                      |                                              |
| `text` / `price`              | `#f3f1ed`                                                                                                      |                                              |
| `text-muted`                  | `#b5b0a7`                                                                                                      | 7.8:1 on surface                             |
| `text-subtle`                 | `#8f8a81`                                                                                                      | 4.9:1 on surface                             |
| `border`                      | `#34312d`                                                                                                      |                                              |
| `border-strong`               | `#77726a`                                                                                                      | 3.5:1 on surface (non-text ≥3)               |
| `action` / `action-hover`     | unchanged: `brand-600` / `brand-700`                                                                           | white text 5.2:1 / 6.8:1; 3.6:1 against `bg` |
| `action-secondary`            | `#f3f1ed`, with `#1c1b19` text                                                                                 | 15.3:1 (inverts: light button)               |
| `link`                        | `brand-300` `#f9a24f`                                                                                          | 8.3:1 on surface                             |
| `accent-subtle`               | `#2b1d12`                                                                                                      |                                              |
| `focus-ring`                  | `#60a5fa`                                                                                                      | 7.3:1 on bg                                  |
| status badges (text / bg)     | success `#86efac`/`#0f2a1a`, warning `#fcd34d`/`#2d2006`, danger `#fca5a5`/`#2f1210`, info `#93c5fd`/`#0f1d3a` | all ≥ 9:1                                    |

- **Elevation in the dark** comes from surface lightness (`bg` < `surface` < `surface-muted`) plus borders, because shadows barely read on dark backgrounds. Shadows stay, but switch to `rgb(0 0 0 / 0.4–0.6)`.

**Testing.**

- The system path is tested with `test.use({ colorScheme: 'dark' })`.
- The override path sets the `theme` cookie via `context.addCookies`.
- Session 17 adds theme-menu tests: the choice applies without a reload, persists across navigation, and System clears the cookie.
- **Dark visual baselines cover one page per template**, not every page: home, listing, product detail, cart and login, each added in the session that redesigns that page. That keeps the baseline count and CI time in check.

## Rollout

Session 16 linked `tokens.css` from `head.ejs`, so every page now renders with the new tokens; the sections below say what each session did or will do.

- **Session 15** swaps in the product photos, as described above.
- **Session 16** (done) linked `tokens.css` from `views/shared/includes/head.ejs` and drops the Google Fonts `<link>`. It converts the aliases to `light-dark()` with the dark values above, adds the `theme` cookie middleware and the `data-theme` attribute, and rewrites `base.css` on top of the semantic aliases.
- **Session 17** adds the theme menu to the new header.
- **From then on**, each page moves over in its own session (17–27), following the roadmap's redesign loop: change the page, **check it in both themes**, run the suite, fix locators, then regenerate that page's baseline(s) in the Linux Playwright image. Commit and check CI.

### Session 16 notes

- `base.css` is rewritten on the semantic aliases only: reset, Inter type scale, links, focus ring, inputs/selects, badges, alerts, and three buttons: `.btn` (near-black, inverts in dark), `.btn-alt` (ghost) and `.btn-buy` (orange, only on Add to cart and Checkout).
- The other stylesheets were moved off the old `--color-gray-*`/`--color-primary-*` names mechanically (no layout changes), so no legacy alias layer exists. Each page's own redesign session replaces its temporary `bg-subtle` panels.
- `middlewares/theme.js` reads the `theme` cookie (`light` | `dark`, anything else ignored) into `res.locals.theme`. It runs before the session and CSRF middleware, so even error pages get `data-theme`.
- Quill's snow theme gets overrides in `forms.css` so the admin product editor follows the theme.
