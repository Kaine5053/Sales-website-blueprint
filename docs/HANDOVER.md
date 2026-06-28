# Project Handover — Sales Website Blueprint

**Prepared as a senior-developer handover.** Read this first. It is a complete,
standalone description of what the project is, how it is built, how to run /
test / deploy it, what you must configure to go live, and where to take it next.

| | |
|---|---|
| **Repository** | `kaine5053/sales-website-blueprint` |
| **Active branch** | `claude/github-repo-website-build-k8c1mh` *(all current work; auto-deploys)* |
| **Live site** | https://sales-website-blueprint.vercel.app *(Vercel Git integration)* |
| **Stack** | Vanilla HTML / CSS / JS — **no framework, no build step**, zero runtime dependencies. One optional serverless function for payments. |
| **Status** | Feature-complete and quality-gated. 20 build iterations. All tests green; accessibility at **0 axe violations**. |
| **Last update** | Iteration 20 (interactive setup guide). See `docs/SESSION-LOG.md` for the full history. |

---

## 1. What this is

A **fully re-skinnable, tier-1 product-sales website blueprint**. You open
`index.html` (or serve the folder) and it runs — there is no compile step. Almost
all content and branding is data-driven: edit a few plain JavaScript config files
and the entire site re-themes and re-populates. It is designed to be handed to a
business owner, branded in an afternoon, and deployed as a static site.

It supports **two selling modes** out of the box:

- **Lead-gen (`quote`)** — the default. Visitors build a "quote basket" that
  pre-fills the contact form. No backend, no payment.
- **E-commerce (`cart`)** — a buy-now cart that checks out via **Stripe Checkout**
  (Stripe's hosted, PCI-compliant payment page) using one serverless function.

---

## 2. Feature inventory (all implemented, tested, deployed)

**Catalogue & discovery**
- Searchable / filterable / **sortable** catalogue (12 demo products, 3 tiers)
- **Pagination** — "Show more" gated by `catalog.pageSize`
- **"Help me choose" guided finder** — a weighted recommendation engine that
  scores products against the visitor's answers and returns a ranked match %
- Product detail modal: features, specs, ratings, related products,
  **variant/option selectors with live price recompute**, share, favourite
- **Comparison** (up to 4, side-by-side matrix, print/PDF)
- **Favourites/wishlist** + **recently viewed** (localStorage)

**Commerce**
- **Quote basket** → pre-fills the contact form; carries chosen variants + prices
- **Cart + Stripe Checkout** (`commerce.mode:'cart'`) → add-to-cart, qty steppers,
  slide-in drawer, server-authoritative pricing via `api/checkout.js`
- **Sale pricing** (`compareAtPrice`) + **stock status** (`in`/`low`/`out`)

**Content, brand & i18n**
- Design-token theming (`theme.css`) + **7 industry presets** + light/dark mode
- **Multi-currency** + **full UI internationalisation** (`t()` + `config.ui`)
- Resources/blog with an in-modal article reader; hero, pricing, testimonials,
  FAQ, stats, trust logos, footer, announcement bar — all config-driven

**Platform & quality**
- **Interactive setup guide** — auto-detecting onboarding checklist for owners
- **Backend-ready forms** — contact + newsletter POST to a configurable endpoint
- **Cookie consent** + analytics hook (`track()`; GA4 / Plausible / stub)
- **PWA** (manifest + service worker, offline) + **SEO** (JSON-LD, canonical,
  Open Graph + Twitter cards, generated `og.png`, robots, sitemap)
- Styled **404**, hash routing (deep-linkable products), keyboard shortcuts
- **Security headers + Content-Security-Policy** (`vercel.json`)
- **Accessibility: 0 axe violations** across light, dark, finder, cart & setup
  modals — treated as a hard gate
- **CI** (GitHub Actions runs the smoke test) + **Vercel auto-deploy**

---

## 3. Architecture & file map

```
index.html                Section scaffolding, mount points (#…-mount), all modals
404.html                  Styled not-found page (absolute asset paths)

assets/css/               Load order matters (set in index.html):
  theme.css               → design tokens (colour/space/type) + dark-mode values
  base.css                → element/reset styles
  components.css          → buttons, cards, modals, badges …
  layout.css              → page sections, grid, header/footer
  features.css            → cart, quote, compare, cookie, setup guide, theme panel
  print.css               → print-only (print/PDF of comparisons)

assets/js/
  config.js   → window.SITE_CONFIG   ⟵ MAIN CONTENT / BRANDING EDIT SURFACE
  products.js → window.PRODUCTS       (catalogue + commerce fields + finder attrs)
  questionnaire.js → window.QUESTIONNAIRE + window.recommendProducts()  (finder)
  presets.js  → window.THEME_PRESETS  (industry skins = token overrides)
  app.js      → ALL rendering + interaction, one IIFE. Key pieces:
                t()/esc()/money() helpers, icon() SVG library, per-section
                renderX(), quiz wizard, compare, favourites, quote, cart+checkout,
                setup guide, hash router, theme switcher, cookie consent +
                track(), modal focus-trap, delegated event handling.
  sw.js / sw-register.js  Optional offline PWA

api/checkout.js           Vercel serverless function — creates a Stripe Checkout
                          Session. Server-authoritative pricing. (cart mode only.)

scripts/check.mjs         Zero-dependency smoke test (also CI)
tests/                    Playwright + axe harnesses (see §7)
.github/workflows/ci.yml  Runs `npm run check` on every push/PR
site.webmanifest, robots.txt, sitemap.xml, vercel.json, package.json
docs/HANDOVER.md (this file), docs/SESSION-LOG.md
CLAUDE.md                 Guide for AI agents working on the repo
```

**Token flow:** every colour/space/typography value originates in `theme.css`
custom properties. Components never hard-code colour. Small brand-coloured text
uses `--brand-text`; status labels use `--success-strong` / `--warning-strong`
(these are the contrast-checked tokens — use them, not raw brand/semantic hues).

---

## 4. The configuration surface (`assets/js/config.js`)

`window.SITE_CONFIG` is where you brand and populate the site. Top-level keys:

| Key | Controls |
|---|---|
| `currency` | symbol, ISO `code`, `locale` — re-currencies the whole site |
| `ui` | i18n overrides for any JS-rendered string (see `DEFAULT_UI` in `app.js`) |
| `setup` | the interactive setup guide (`enabled: true/false`) |
| `commerce` | `mode: 'quote' \| 'cart'` and `checkoutEndpoint` |
| `catalog` | `pageSize` for "Show more" pagination (0 = show all) |
| `brand` | name, tagline, inline `logoSvg` |
| `announcement` | top bar (`show`, text, link) |
| `nav`, `headerCta` | header navigation + primary CTA |
| `hero`, `trustLogos`, `stats` | hero block, trust strip, stat counters |
| `features`, `pricing`, `testimonials`, `faq`, `resources`, `ctaBand` | the marketing sections |
| `cookies` | consent banner copy + behaviour |
| `analytics` | `provider` (`stub`/`ga4`/`plausible`) + `id` |
| `contact` | heading, email, phone, address, **`endpoint`** (form backend) |
| `footer` | about, columns, socials, legal, **newsletter** (incl. its `endpoint`) |

Two more data files:

- **`products.js`** (`window.PRODUCTS`): each product has `id`, `name`,
  `category`, `price`, `priceUnit`, `image`, `rating`, `reviews`, `features`,
  `specs`, and **`attrs`** (the tags the finder scores on). Optional commerce
  fields: `compareAtPrice` (sale), `stock` (`in`/`low`/`out`), `options`
  (variant groups with `priceDelta`), `badges`, and `stripePriceId` (cart mode).
- **`questionnaire.js`** (`window.QUESTIONNAIRE` + `recommendProducts()`): the
  finder questions and weighted scoring. A question's `attr` + option `value`
  **must match the tags** used in each product's `attrs`.

---

## 5. Commerce & payments

### Mode A — `quote` (default, no backend)
Visitors add products to a quote basket; it pre-fills the contact form with the
selected items, their variants and prices. Submitting goes through the same
configurable form endpoint as the contact form (see §6).

### Mode B — `cart` (Stripe Checkout)
Set `commerce: { mode: 'cart' }`. This activates add-to-cart buttons, the header
cart button, the cart drawer (qty steppers, subtotal) and the checkout flow.

**How checkout works**
1. Browser POSTs the cart `{ items: [{ id, sel, qty }] }` to
   `commerce.checkoutEndpoint` (default `/api/checkout`).
2. `api/checkout.js` (Vercel serverless) looks every item up in the **same
   `products.js`** the site renders from (evaluated server-side), **recomputes
   the price itself** — including variant deltas — and creates a Stripe Checkout
   Session. **It never trusts client-sent prices or names**, so price-tampering
   in the browser has no effect.
3. The function returns `{ url }`; the browser redirects to Stripe's hosted page.
4. After payment Stripe returns the buyer to `/?checkout=success` (cart is
   cleared) or `/?checkout=cancelled` (cart kept).

**To enable in production**
- In your host's **environment variables** (never in the repo):
  - `STRIPE_SECRET_KEY` — required (`sk_live_…` / `sk_test_…`)
  - `CHECKOUT_BASE_URL` — optional absolute site URL for the redirect (defaults
    to the request host)
- Optional: add `stripePriceId: 'price_…'` to products to bill pre-created
  Stripe Prices. Without one, the `products.js` price is used as inline
  `price_data`, so it works immediately.
- `vercel.json` already bundles `assets/js/**` with the function (`includeFiles`)
  so the catalogue is available at runtime.

> Not yet included (clear next steps if you go transactional): order-confirmation
> emails via a Stripe **webhook**, and **variant-level** Stripe Price IDs.

---

## 6. Forms (contact + newsletter)

Backend-agnostic and demo-by-default. Set `contact.endpoint` and/or
`footer.newsletter.endpoint`:

- **Empty `''`** → front-end demo (success toast only).
- **A URL** → the form POSTs its fields as multipart `FormData` (compatible with
  Formspree / Basin / Web3Forms / Netlify Forms / your own API). The contact form
  also includes a `products` field carrying the current quote. While in flight the
  submit button disables and shows "Sending…"; on failure the form is left intact
  for retry. **No keys live in the repo — only the endpoint URL.**

---

## 7. Security model

`vercel.json` applies a hardened header set to every route:

- **Content-Security-Policy** with `script-src 'self'` (no inline scripts — this
  is the main XSS mitigation). Image fallbacks are done via a single delegated
  handler, not inline `onerror`, specifically so the CSP needs no
  `'unsafe-inline'` for scripts. The policy allows Google Fonts, `https:` images
  (host real product imagery anywhere) and `https:` connections (your form
  endpoint / Stripe). **If you add a third-party analytics script (GA4,
  Plausible), add its origin to `script-src`.**
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  and a restrictive `Permissions-Policy`.

Other defences: all interpolated data is escaped via `esc()`; localStorage access
is wrapped (`store`/`lsGet`/`lsSet`) so it never throws in private mode; the
checkout function is server-authoritative on price. `npm run check` **fails the
build** if an inline `on*=` handler is reintroduced (it would be CSP-blocked).

---

## 8. Conventions / invariants (do not break)

- **Escape interpolated data** with `esc()` before inserting into HTML.
- **localStorage only via `lsGet`/`lsSet`/`store`** (never throws in private mode).
- **No inline event handlers** — use delegation (CSP compatibility; smoke-gated).
- **No nested interactive elements** — cards use the stretched-link pattern (a
  real `<button>` trigger with an `::after` overlay), not `role="button"` wrappers.
- **Accessibility is a gate** — keep `npm run test:a11y` at **0 violations** after
  any markup/colour change.
- `init()` wraps each section in `safe()` so one bad config field warns instead of
  breaking the whole page.
- JS-rendered strings go through `t('key')` (defaults in `DEFAULT_UI`).

---

## 9. Running, testing, deploying

```bash
npm start          # serve locally (npx serve .) — use http://, not file://
npm run check      # zero-dependency smoke test (also runs in CI)
npm test           # full suite: check + api + e2e + edge + cart + a11y
```

One-time, for the browser tests locally:
`npm install && npx playwright install chromium` (see `tests/README.md`).

**Test matrix** (`npm test` runs all six):

| Stage | File | Covers |
|---|---|---|
| `check` | `scripts/check.mjs` | asset refs, JS/JSON validity, data globals, **no inline handlers** |
| `test:api` | `tests/api.cjs` | checkout function: validation, **price-tamper resistance**, qty clamp, Stripe error mapping (mocked, no network) |
| `test:e2e` | `tests/regression.cjs` | ~20 flows: catalogue, finder, modal, compare, quote, pagination, routing, "no JS errors" |
| `test:edge` | `tests/edge.cjs` | compare cap, persistence, empty states, form backend, pagination, image fallback, setup guide |
| `test:cart` | `tests/cart.cjs` | full cart flow over HTTP (cart-mode), qty, checkout success/error/return, **drawer axe scan** |
| `test:a11y` | `tests/a11y.cjs` | axe-core — **0 violations** in light, dark, finder, **cart**, **setup** |

**Deploy:** push to `claude/github-repo-website-build-k8c1mh` → Vercel
auto-deploys. Static site config (clean URLs, asset caching, headers, function
bundling) is in `vercel.json`.

---

## 10. Go-live checklist for the owner

The in-app **"Set up your site"** guide (bottom-right of the running site) tracks
most of this automatically. In short:

1. **Brand** — `config.js → brand` (name, tagline, `logoSvg`).
2. **Products** — replace the demo entries in `products.js` (prices, specs,
   `attrs`). Keep `attrs` values aligned with `questionnaire.js`.
3. **Imagery** — swap the gradient SVGs in `assets/img/` for real photos; update
   each product `image`; replace `og.png` with a 1200×630 share image.
4. **Contact details** — `config.js → contact`.
5. **Domain / SEO** — replace the blueprint domain in `index.html`
   (canonical + og tags), `sitemap.xml`, `robots.txt`.
6. **Lead delivery** — set `contact.endpoint` (and newsletter endpoint).
7. **Payments (optional)** — `commerce.mode:'cart'` + `STRIPE_SECRET_KEY` env.
8. **Analytics (optional)** — `analytics.provider`/`id` + add the script origin
   to the CSP in `vercel.json`.

---

## 11. Known limitations / caveats

- **Stock is a static label**, not a live check — the `stock` field is set per
  product in `products.js`. Real-time availability needs a stock source (a clear
  next step is a configurable stock endpoint, mirroring the form/checkout pattern).
- **Images are gradient SVG placeholders** — replace with real assets.
- **Payments** require your Stripe account + a host that runs serverless
  functions (Vercel does). No order-confirmation email yet (needs a webhook).
- **Analytics** is a no-op until configured *and* the visitor accepts cookies.
- **Live-URL verification gap (environment-specific):** the build ran in a cloud
  container whose network policy could block outbound to `vercel.app`, so the
  public URL wasn't always auto-testable from inside it — verification was done
  against the exact committed code (byte-for-byte what Vercel serves). If the
  public URL ever shows a login wall, that's Vercel **Deployment Protection**
  (Project → Settings → Deployment Protection → disable/limit).

---

## 12. Suggested next steps (priority order)

1. **Real product/CMS data** + real imagery (the biggest visual lift).
2. **Live stock checker** — a configurable endpoint that returns availability,
   falling back to the static `stock` field.
3. **Order-confirmation emails** — a Stripe **webhook** → transactional email,
   plus variant-level Stripe Price IDs if you want Stripe to own all amounts.
4. Optional polish: self-host fonts (removes the Google Fonts request), more
   theme presets, more finder questions.

---

## 13. Build history

The project was built in **20 verified iterations**; each was checked in a
headless browser (and, from iteration 9, axe-core) before commit and push.
`docs/SESSION-LOG.md` has the full per-iteration table. Headline arc:

- **1–13** — foundation: tokens/dark-mode, catalogue + finder, compare,
  favourites, quote, resources, PWA/SEO, CI, sale/stock, a11y→0, i18n,
  sort, variant selectors.
- **14** — variant options carry into the quote.
- **15** — configurable form backend.
- **16** — catalogue pagination.
- **17** — richer 12-product catalogue.
- **18** — production hardening (security headers + CSP + SEO/og).
- **19** — cart + Stripe Checkout (server-authoritative).
- **20** — interactive setup guide.

---

## 14. Continuing in a fresh session

1. Clone/pull and check out `claude/github-repo-website-build-k8c1mh`.
2. Read `CLAUDE.md` (agent guide) and this file.
3. `npm install && npx playwright install chromium`, then `npm test` for a green
   baseline before changing anything.
4. Prefer editing `config.js` / `products.js` / `questionnaire.js` for content;
   add tokens/classes for new UI (never hard-code colour).
5. After changes: `npm run check`, re-run the relevant harness, keep
   `test:a11y` at 0, then commit and push (auto-deploys).

---

## 15. Where these files live

This project was built in a **remote cloud container**, not on your local
machine, so this document and everything else is stored **in the Git repo** and
pushed to GitHub. To get it onto your machine, clone or pull the branch — this
file is at `docs/HANDOVER.md`, the history at `docs/SESSION-LOG.md`, and the
agent guide at `CLAUDE.md`. Inside the build container the project path is
`/home/user/Sales-website-blueprint`.
