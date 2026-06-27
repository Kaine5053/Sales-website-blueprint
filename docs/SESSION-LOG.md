# Session Log — iteration history

Chronological record of what each iteration delivered. Every iteration was
verified in a headless browser (and, from iteration 9, axe-core) before commit,
and pushed to `claude/sales-website-blueprint-l7h0zv` (auto-deploys to Vercel).

| # | Commit | Summary |
|---|--------|---------|
| 1 | `f42d229` | Foundation: design-token system + dark mode, config/products/questionnaire data files, catalogue with search/filter + detail modal, the "Help me choose" finder + weighted recommendation engine, hero/features/pricing/testimonials/FAQ/contact/footer, responsive + accessible, README. |
| 2 | `225c9c8` | **Industry theme presets** (7 skins) with a live switcher; **product comparison** (tray + side-by-side matrix); JSON-LD structured data; `?`/`/` keyboard shortcuts. |
| 3 | `14f1abf` | Shareable **deep-linkable product pages** (hash routing + share); **favourites/wishlist**; **recently viewed**; related products; **resources/blog** section; **print** stylesheet. |
| 4 | `2e832ee` | **Accessibility hardening** (focus-trap, aria-live); **quote basket** (prefills contact form); **cookie consent** + analytics hook (`track()`). |
| 5 | `6337dc8` (+`f241c69`,`6e9fa3e`) | **PWA** (manifest + service worker, offline); SEO files (robots, sitemap, favicon); styled **404**; `defer` scripts; zero-dep **smoke test**; `package.json`; `vercel.json`. |
| 6 | `6660001` | **CI** (GitHub Actions smoke test); openable **resource articles**; **multi-currency** (`currency` in config). |
| 7 | `d71c219` | **Sale/discount pricing** (`compareAtPrice`); **stock status** badges; **footer newsletter**. |
| 8 | `11bf2bd` | **Bug-fix & hardening** from a code review: quiz auto-advance race, double `closeModal`, out-of-stock notify flow, safe `localStorage`, `safe()` boot guard. |
| 9 | `a6fbcd5` | **Accessibility pass → 0 axe violations** (light + dark + modal): stretched-link cards (no nested-interactive), contrast tokens (`--brand-text`, `--success-strong`, `--warning-strong`), heading order, landmark, keyboard. |
| 10 | `a0b9807` | Added **`CLAUDE.md`** agent guide. |
| 11 | `f24186f` | Catalogue **sort controls** (price/rating/reviews) + live **results count**. |
| 12 | `75468cf` | **Full UI internationalisation**: `t()` helper + `DEFAULT_UI`, every JS-rendered string overridable via `config.ui` (verified with a French override). |
| 13 | `2d5e68e` | **Product variant/option selectors** with live price recompute (e.g. care plan, capacity). |
| 14 | `fa6dcc5` | **Variant options carry into the quote basket**: quote lines now store the chosen option indices + show the configured option labels and computed price in the chip and prefilled message; distinct configs are separate lines, identical ones dedupe; old id-array quotes migrate forward. New regression assertion covers it. |
| 15 | `a035ec4` | **Configurable form backend**: `contact.endpoint` / `footer.newsletter.endpoint` in config make the contact + newsletter forms POST `FormData` to any form service (Formspree/Basin/Web3Forms/Netlify/custom), with a disabled “Sending…” state and retry-on-failure; empty endpoints keep the toast-only demo. Two new edge assertions (success POST + clear, failure keeps form intact). |
| 16 | `e92fade` | **Catalogue pagination / "Show more"**: `catalog.pageSize` in config gates how many products render before a "Show more (+N)" button; filtering/sorting resets to page 1, "Show more" never re-filters, focus moves to the first newly revealed card, and a "Showing X of N" hint stays live. Defaults to 6 (the demo fits one page; activates automatically as the catalogue grows). Four new edge assertions. |
| 17 | `215b493` | **Richer demo catalogue**: doubled the catalogue from 6 → 12 products (4 per tier: Essentials/Professional/Enterprise) with six new gradient placeholder images, varied pricing, sale/stock states, options (storage/capacity/nodes) and ratings — which activates the new "Show more" pagination on the home page and exercises sort/filter more fully. Finder attrs matched to the questionnaire; tests updated for the new counts. |
| 18 | _this commit_ | **Production hardening**: full security-header set in `vercel.json` (CSP with `script-src 'self'`, HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy); converted all inline `onerror=` handlers to one delegated capture-phase image-fallback handler so the CSP needs no `'unsafe-inline'` for scripts; added canonical + og:url/og:image + twitter tags and a generated branded `og.png` (1200×630). New smoke guard fails on any inline `on*=` handler; new edge test for the fallback handler; verified zero CSP violations by serving the page over HTTP with the real headers. |

## Verification approach used throughout
- `scripts/check.mjs` — smoke test (asset references, JS syntax, data globals).
- `tests/regression.cjs` — 18 end-to-end assertions + "no JS console errors".
- `tests/edge.cjs` — edge cases (compare cap, persistence, empty states…).
- `tests/a11y.cjs` — axe-core; **invariant: 0 violations** in light + dark + modal.
- Visual spot-checks via headless screenshots after UI changes.

## Deployment
Vercel Git integration connected to the repo; pushes to the working branch
deploy automatically to https://sales-website-blueprint.vercel.app.
