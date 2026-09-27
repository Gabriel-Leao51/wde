# WDE Shop — design direction

Phase C (sessions 14–30) of the test repo's `ROADMAP.md` redesigns WDE to look like a real online store. This file records the direction, and `public/styles/tokens.css` puts it into practice. Open `docs/design/specimen.html` in a browser to see every token rendered.

## Direction in one line

**A bright, warm-neutral general store**: white product surfaces, stone-grey structure, one confident orange for actions. Product photos carry the colour, and the UI stays out of their way.

The current app is a dark, amber-on-brown theme. The redesign flips to a light theme (see the roadmap Decisions). It keeps orange as the one thread of continuity with the old identity, deepened until white text on it passes WCAG AA.

## References

WDE sells across six departments: Electronics, Gaming, Furniture, Home, Office and Sports. No single store covers that mix, so each reference supplies one layer. These are patterns taken from using the stores, not values copied from their CSS; no brand colours or assets are reused.

| Store                     | What we take                                                                                                                                                                                                                                                                      | Where it lands                                               |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **IKEA** (furniture/home) | Price as the loudest thing on a card: bold, large, tabular numerals. The product name sits under a small uppercase category label. Cards have no chrome, just a photo on a light well. Department tiles on the home page.                                                          | Product card (19), home page tiles (18), `--color-price`     |
| **Best Buy** (electronics/gaming) | A dense but scannable listing: a left filter sidebar with facet groups, a result count and sort above the grid, and an unmistakable add-to-cart button. The cart has a sticky order-summary panel beside the line items.                                                   | Listing parts 1–2 (19–20), cart summary (22), `--color-action` |
| **Muji** (home/office)    | Restraint. Warm off-white and stone neutrals instead of blue-greys, generous whitespace, few colours, and small letter-spaced uppercase labels for structure instead of heavy borders.                                                                                               | Neutral ramp, `--letter-spacing-wide` eyebrows, spacing scale |

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

## Rollout

`tokens.css` is **not linked from any page yet**, which is deliberate: this session changes nothing that renders, so every Playwright visual baseline stays valid. Session 16 links it from `views/shared/includes/head.ejs`, drops the Google Fonts `<link>`, and rewrites `base.css` on top of the semantic aliases. From then on, each page moves over in its own session (17–27), following the roadmap's redesign loop: change the page, run the suite, fix locators, regenerate that page's baseline in the Linux Playwright image, commit, check CI.
