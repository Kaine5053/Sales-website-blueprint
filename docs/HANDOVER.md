# Project Handover — Sales Website Blueprint

_Last updated: end of the build session (13 iterations). Read this first when
picking the project up in a fresh session._

---

## 1. What this is

A **static, zero-dependency, fully re-skinnable tier-1 product sales website
blueprint** built in vanilla HTML/CSS/JS — no framework, no build step. Open
`index.html` or serve the folder and it runs. It's designed so that you can
re-brand it for any product or industry by editing a few plain config files.

- **Repo:** `kaine5053/sales-website-blueprint`
- **Working branch:** `claude/sales-website-blueprint-l7h0zv` (all work lives here)
- **Live site:** https://sales-website-blueprint.vercel.app (Vercel Git
  integration — every push to the branch auto-deploys)
- **Latest commit at handover:** iteration 13 (variant/option selectors)

---

## 2. Current status — DONE and verified

The site is feature-complete and quality-gated. Everything below is implemented,
tested (headless browser + axe), committed and deployed:

- Design-token theming (`theme.css`) + **7 industry presets** + light/dark mode
- Searchable / filterable / **sortable** product catalogue with a live results count
- **"Help me choose" guided finder** — weighted recommendation engine with match %
- Product detail modal: features, specs, ratings, related products,
  **variant/option selectors with live pricing**, share + favourite
- **Comparison** (up to 4, side-by-side matrix, print/PDF)
- **Favourites / wishlist** + **recently viewed** (localStorage)
- **Quote basket** (collects products into a pre-filled contact request)
- **Sale pricing** (`compareAtPrice`) + **stock status** (`in`/`low`/`out`)
- **Resources/blog** with an in-modal article reader
- **Multi-currency** + **full UI internationalisation** (`t()` + `config.ui`)
- **Cookie consent** + analytics hook (`track()`, GA4/Plausible/stub)
- **PWA** (manifest + service worker, offline) + **SEO** (JSON-LD, robots, sitemap)
- Styled **404**, hash routing (deep-linkable products), keyboard shortcuts
- **Accessibility: 0 axe violations** (light + dark + modal) — treated as a gate
- **CI** (GitHub Actions runs the smoke test) + **Vercel auto-deploy**

See `docs/SESSION-LOG.md` for the iteration-by-iteration history.

---

## 3. Architecture (where everything lives)

```
index.html              section scaffolding + mount points (#…-mount) + modals
404.html                styled not-found page (absolute asset paths)
assets/css/             theme.css (tokens) → base → components → layout → features
                        ; print.css is print-only
assets/js/
  config.js             window.SITE_CONFIG — brand, currency, ui(i18n), nav, hero,
                        pricing, testimonials, resources, faq, cookies, analytics,
                        contact, footer.  ← MAIN CONTENT/BRANDING EDIT SURFACE
  products.js           window.PRODUCTS — catalogue (price, compareAtPrice, stock,
                        options, attrs, specs, features)
  questionnaire.js      window.QUESTIONNAIRE + window.recommendProducts() (finder)
  presets.js            window.THEME_PRESETS — industry skins (token overrides)
  app.js                ALL rendering + interaction (one IIFE). Helpers: t/esc/money,
                        icon() SVG library, renderX() per section, quiz wizard,
                        compare, favourites, quote, variant options, hash router,
                        theme switcher, cookie consent, modal focus-trap.
  sw.js / sw-register.js  optional offline PWA
scripts/check.mjs       zero-dependency smoke test
tests/                  Playwright + axe harnesses (regression / edge / a11y)
site.webmanifest, robots.txt, sitemap.xml, vercel.json
.github/workflows/ci.yml  runs `npm run check` on push/PR
```

**Token flow:** all colour/spacing/typography come from `theme.css` custom
properties. Components never hard-code colour. Small brand-coloured text uses
`--brand-text`; status labels use `--success-strong`/`--warning-strong`.

---

## 4. Conventions / invariants (don't break these)

- **Escape interpolated data** with `esc()` before putting it in HTML.
- **localStorage** only via `lsGet`/`lsSet`/`store` (never throws in private mode).
- **No nested interactive elements** — cards use the stretched-link pattern
  (a real `<button>` trigger with an `::after` overlay), not `role="button"`
  wrappers around buttons. (axe `nested-interactive` = 0.)
- **Accessibility is a gate:** keep `npm run test:a11y` at **0 violations**
  (light + dark) after any markup/colour change.
- `init()` runs each section through `safe()` so one bad config field warns
  instead of breaking the whole page.
- UI strings the JS renders go through `t('key')` (defaults in `DEFAULT_UI`,
  overridable via `config.ui`).

---

## 5. How to run, test, deploy

```bash
npm start            # serve locally (npx serve .) — use http, not file://
npm run check        # smoke test (no browser)
npm test             # smoke + full e2e regression + edge + axe a11y
```

For the browser tests once, locally: `npm install && npx playwright install chromium`
(see `tests/README.md`).

**Deploy:** push to `claude/sales-website-blueprint-l7h0zv` → Vercel auto-deploys.
Static site, config in `vercel.json` (clean URLs + asset caching).

---

## 6. Known limitations / caveats

- **Forms are backend-ready, demo by default** — set `contact.endpoint` and/or
  `footer.newsletter.endpoint` in `config.js` and the forms POST their fields as
  multipart `FormData` (Formspree/Basin/Web3Forms/Netlify/your API), with a
  busy/disabled state and retry-on-failure. Leave the endpoints `''` and they
  stay toast-only demos. No secrets in the repo — only the endpoint URL.
  (Done — iteration 15.)
- **Variant options now carry into the quote** — the chosen configuration and its
  computed price travel from the detail modal into the quote chip and the
  prefilled contact message. Distinct configurations of the same product are
  separate quote lines; identical ones dedupe. (Done — iteration 14.)
- **Payment is Stripe-ready, off by default** — `commerce.mode` is `'quote'`
  (lead-gen). Set it to `'cart'` and the buy-now flow + `api/checkout.js` (Stripe
  Checkout) activate; needs `STRIPE_SECRET_KEY` in the host env (never the repo).
  Server sources all prices from `products.js`, so client price-tampering can't
  work. (Done — iteration 19; see README "Selling".)
- **Analytics** is a no-op stub until you set `analytics.provider`/`id` in config
  AND the visitor accepts cookies. With cart mode + a third-party analytics
  script, add its origin to `script-src` in the CSP (`vercel.json`).
- **Images are gradient SVG placeholders** in `assets/img/` — swap for real assets.
- **Live-URL verification gap (environment-specific):** the original build ran in
  a sandbox whose network policy blocked outbound to `vercel.app`, so the live
  URL couldn't be auto-tested from inside it — verification was done against the
  exact committed code (byte-for-byte what Vercel serves). If the public URL ever
  shows a login wall, that's Vercel Deployment Protection (Project → Settings →
  Deployment Protection → disable/limit).

---

## 7. Suggested next steps (in priority order)

1. **Real product/CMS data** + real imagery.
2. **Live stock** behind the static `stock` field (a configurable stock endpoint).
3. Optional: self-host fonts, add more presets, more finder questions, order
   confirmation emails (Stripe webhook → email), variant-level Stripe Price IDs.

_Done in iteration 14: variant options now carry into the quote basket — chosen
configuration + computed price flow into the chip and prefilled message; distinct
configs are separate lines, identical ones dedupe; old id-array quotes migrate._

_Done in iteration 15: forms are backend-ready — `contact.endpoint` /
`footer.newsletter.endpoint` in config POST FormData to any form service, with a
busy state and retry-on-failure; empty endpoints keep the toast-only demo._

_Done in iteration 16: catalogue pagination — `catalog.pageSize` gates a "Show
more" button (resets on filter/sort, focus moves to first new card, live
"Showing X of N" hint); defaults to 6 so it activates as the catalogue grows._

_Done in iteration 17: richer demo catalogue (12 products, 4 per tier) with new
gradient images and varied pricing/stock/options — activates pagination on the
home page and exercises sort/filter/compare more fully._

_Done in iteration 18: production hardening — full security-header set + CSP
(`script-src 'self'`; inline onerror handlers replaced by a delegated one),
canonical/og/twitter tags + generated og.png. Smoke guards against inline
handlers; verified zero CSP violations against the real headers._

_Done in iteration 19: cart + Stripe Checkout (`commerce.mode='cart'`) —
add-to-cart (carrying variants), cart drawer with qty, and a price-authoritative
`api/checkout.js` serverless function (server sources prices, env-only secret).
`tests/api.cjs` + `tests/cart.cjs` cover it. Default mode stays `'quote'`._

_Done in iteration 20: interactive setup guide — a floating checklist that
auto-detects unreplaced placeholders (brand, products, imagery, contact, domain,
form endpoint, + optional payments/analytics), shows progress, and points to the
exact file/field to edit. Hides once essentials are done; `setup.enabled` flag._

---

## 8. Continuing in a fresh session

1. Clone/pull the repo and check out `claude/sales-website-blueprint-l7h0zv`.
2. Read `CLAUDE.md` (agent guide) and this file.
3. `npm install && npx playwright install chromium`, then `npm test` to confirm a
   green baseline before changing anything.
4. Prefer editing `config.js` / `products.js` / `questionnaire.js` for content;
   add tokens/classes for new UI (never hard-code colour).
5. After changes: `npm run check`, re-run the relevant harness, and keep
   `test:a11y` at 0. Commit, push (auto-deploys).

---

## 9. Note on this handover / "folder on your machine"

This project was built in a **remote cloud container**, not on your local
machine — so these documents are stored **in the repo** (under `docs/` and the
project root) and pushed to GitHub. To get them onto your machine, clone or pull
the branch; they'll be at `<your-clone>/docs/` and the project root. Inside the
build container the project path is `/home/user/Sales-website-blueprint`.
