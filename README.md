# Sales Website Blueprint

A clean, professional, **tier-one product sales website** built as a fully-working,
re-skinnable blueprint. Zero dependencies, no build step — open `index.html` and it runs.
Re-brand it for any product or industry by editing a few plain config files.

![status](https://img.shields.io/badge/status-blueprint-blue) ![stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-informational) ![deps](https://img.shields.io/badge/dependencies-none-success)

---

## ✨ What's included

- **Polished, modern landing page** — sticky header with mega-menu, gradient hero with floating proof cards, animated stat counters, scroll-reveal animations.
- **Product catalogue** — searchable, filterable, **sortable** grid (price, rating, most-reviewed) with a live results count, reading from a single data file.
- **Product detail view** — rich modal with features, specs, ratings, related products and CTAs.
- **Variant/option selectors** — give a product an `options` list (e.g. care plan, capacity) and the detail view renders selectable choices that adjust the price live.
- **"Unsure?" guided finder** — a multi-step questionnaire that scores your catalogue and recommends the best-matched products, with a "why it matched" explanation and a match %.
- **Industry theme presets** — a live switcher (bottom-right) with 7 ready-made skins (SaaS, Industrial, Luxury, Healthcare, Eco, Finance, Bold) that re-skin the whole site by swapping design tokens only. Pick one as your production default.
- **Side-by-side product comparison** — select up to 4 products and compare price, rating, specs and features in a clear matrix that highlights the best value and top-rated picks.
- **Keyboard shortcuts** — press <kbd>?</kbd> to open the finder, <kbd>/</kbd> to jump to search.
- **SEO structured data** — JSON-LD (Organization + Product) injected automatically for rich search results.
- **Shareable, deep-linkable products** — every product has its own URL (`#product/<id>`); opening one updates the address bar, the browser back button works, and a Share button copies the link (or uses the native share sheet on mobile).
- **Favourites / wishlist** — a heart on every card saves products to `localStorage`, with a live count in the header and a one-tap "Favourites" filter.
- **Recently viewed** — a rail of the products a visitor has looked at, remembered across visits.
- **Related products** — each product view suggests relevant alternatives (same category first, then nearest price).
- **Resources / blog section** — config-driven cards for guides and articles.
- **Print / PDF** — a print stylesheet renders a clean comparison sheet (great for sharing a shortlist internally).
- **Quote basket** — "Request this product" / "Choose" collects items into a *Your selection* panel on the contact form, auto-filling the subject and message so a buyer can request a quote for several products at once.
- **Cookie consent + analytics hook** — a configurable consent banner; analytics (GA4 / Plausible / no-op stub) load **only after** the visitor accepts. A single `track()` helper records events (add-to-quote, lead submit, newsletter) so you can wire any provider in one place.
- **Accessibility hardening** — modal focus-trap (Tab stays inside, focus returns on close), polite screen-reader announcements for dialogs and finder steps, full keyboard operation and reduced-motion support.
- **Installable PWA + offline** — a web manifest and service worker cache the site so it loads offline and can be installed to a home screen / desktop.
- **SEO & crawl files** — `robots.txt`, `sitemap.xml`, web manifest, favicon/app icon, plus the JSON-LD from earlier.
- **Styled 404 page** — an on-brand not-found page served for any unknown URL.
- **Zero-dependency smoke test** — `npm run check` validates JS syntax, JSON, every referenced asset, the data globals and product images (great for CI or a pre-deploy gate).
- **One-click deploy** — `vercel.json` makes it import-ready on Vercel; pushing to the connected branch auto-deploys.
- **Multi-currency** — set `currency` (symbol, ISO code, locale) once in `config.js` and every price, the quote basket and the SEO data re-currency automatically (locale-aware separators).
- **Internationalised UI** — every button/label the JS renders goes through a `t()` helper with English defaults; override any string (or all, for another language) via `config.ui` — no code changes. Verified with a full French override.
- **Readable resource articles** — the blog cards open an on-brand article reader with byline and full body, all from `config.js`.
- **CI** — a GitHub Actions workflow runs the smoke test on every push/PR, so broken references never reach production.
- **Sale & stock** — add `compareAtPrice` to a product for an automatic strike-through + "Save X%" badge, and `stock: 'in' | 'low' | 'out'` for a colour-coded stock badge (out-of-stock swaps the CTA to "Notify me").
- **Footer newsletter** — a config-driven email capture in the footer (wired to the same `track()`/toast flow as the contact form).
- **Trust-building sections** — logos strip, stats band, "why us" features, pricing tiers, testimonials, FAQ, CTA band, contact form.
- **Light & dark mode** — automatic (follows OS) with a manual toggle, remembered across visits.
- **Fully responsive** — mobile drawer nav, fluid type, adapts from phone to widescreen.
- **Accessible** — semantic HTML, ARIA, keyboard support, focus management, skip link, reduced-motion support.
- **SEO & social ready** — meta tags, Open Graph, sensible document structure.

---

## 🗂 Project structure

```
.
├── index.html              ← page structure & section mount points
├── 404.html                ← styled not-found page
├── site.webmanifest        ← PWA manifest (installable)
├── sw.js                   ← service worker (offline cache)
├── robots.txt · sitemap.xml← crawl/SEO files
├── vercel.json             ← static-deploy config (clean URLs, caching)
├── package.json            ← npm start / npm run check
├── scripts/check.mjs       ← zero-dependency smoke test
├── assets/
│   ├── css/
│   │   ├── theme.css        ← 🎨 DESIGN TOKENS — start here to re-skin
│   │   ├── base.css         ← reset, typography, helpers
│   │   ├── components.css   ← buttons, cards, badges, modal, forms…
│   │   ├── layout.css       ← section layouts + responsive rules
│   │   ├── features.css     ← theme switcher, comparison, favourites, resources
│   │   └── print.css        ← clean print / PDF output (loaded media="print")
│   ├── js/
│   │   ├── config.js        ← 📝 SITE CONTENT — brand, nav, copy, contact
│   │   ├── products.js      ← 📦 YOUR CATALOGUE — products + match attributes
│   │   ├── questionnaire.js ← ❓ FINDER — questions + recommendation engine
│   │   ├── presets.js       ← 🎨 INDUSTRY THEME PRESETS — the live switcher
│   │   └── app.js           ← rendering & interactions (rarely needs editing)
│   └── img/                 ← placeholder SVGs (swap for real photos)
└── README.md
```

---

## 🚀 Quick start

No tooling required. Either:

- **Double-click `index.html`**, or
- Serve it locally for nicer URLs (recommended — the service worker, manifest and
  absolute-path 404 only work over http):
  ```bash
  npm start          # = npx serve .   (or: python3 -m http.server)
  npm run check      # run the zero-dependency smoke test
  ```

> Tip: open via a local server, not `file://`, so the PWA features and the
> styled 404 resolve correctly.

---

## 🎨 Re-skinning for a new product / industry

Most re-brands take **three edits**:

### 1. Colours, fonts, feel — `assets/css/theme.css`
The whole palette derives from one accent colour expressed in HSL:
```css
--brand-h: 222;   /* hue        — change this for a new accent  */
--brand-s: 89%;   /* saturation */
--brand-l: 55%;   /* lightness  */
```
Also here: fonts (`--font-sans`, `--font-display`), corner roundness
(`--radius-base` — set `0px` for sharp/industrial, `20px` for soft/friendly),
spacing, shadows and the dark theme.

### 2. Words, brand, navigation — `assets/js/config.js`
Brand name & logo, **currency** (symbol/code/locale), announcement bar, nav links,
hero copy, features, pricing plans, testimonials, resources/blog articles, FAQ,
contact details, cookie consent, analytics and footer. All plain strings.

### 3. Your products — `assets/js/products.js`
Add one object per product. Images go in `assets/img/`.

---

## ❓ How the "Help me choose" finder works

The finder is driven entirely by data — **no code changes needed** to retune it.

1. Each **question** in `questionnaire.js` has an `attr` (e.g. `budget`) and options,
   each option carrying a `value` (e.g. `low`) and a `weight`.
2. Each **product** in `products.js` has an `attrs` map of the tags it satisfies:
   ```js
   attrs: { useCase: ['business'], budget: ['mid','high'], priority: ['performance'] }
   ```
3. When a user answers, the engine adds the question's `weight` to every product
   whose tags include the chosen value, then ranks by score (tie-broken by rating
   and review count) and shows the top matches with a match % and reasons.

**To customise:** edit the questions/options/weights and make sure each option
`value` lines up with a tag you used in `products.js`. That's the whole contract.

> Industry examples: for **insurance** ask cover level & risk; for **software**
> ask team size & integrations; for **furniture** ask room & style. Just rename
> the attributes consistently in both files.

---

## 🎨 Industry theme presets

Open the **Theme** switcher (bottom-right) to flip between 7 industry skins live.
Each is just a set of design-token overrides in `assets/js/presets.js`:

```js
{
  id: 'healthcare', name: 'Healthcare', desc: '…', swatch: ['#0ea5a5', '#0284c7'],
  vars: { '--brand-h': '184', '--brand-s': '72%', '--brand-l': '38%', '--radius-base': '18px' },
}
```

The switcher is a **showcase**. For production, pick the preset you want, paste its
`vars` into `theme.css` as the defaults, and delete the switcher markup/script if
you don't want users changing it. Add your own preset by copying a block and
changing the values.

## ⚖️ Product comparison

Each product card has a **Compare** toggle. Selecting 2–4 products opens a
side-by-side matrix (price, rating, specs, feature presence) that auto-highlights
the lowest price and top-rated options. It reads straight from `products.js` —
add a spec or feature to a product and it appears in the table automatically.

## 🔌 Going to production — wiring up the forms

The contact and newsletter forms are front-end only (they show a success toast).
To make them real, point them at your backend or a form service (Formspree,
Basin, Netlify Forms, your own API) inside `app.js` → `initEvents()`.

**Analytics** is already wired to a single `track()` helper in `app.js` and gated
behind cookie consent. Set `analytics.provider` and `analytics.id` in `config.js`
to `'ga4'` (with a `G-XXXX` id) or `'plausible'` (with your domain); leave it as
`'stub'` to keep it a no-op that still logs to `window.dataLayer`.

Suggested next integrations:
- A real product/CMS backend or headless commerce
- Live chat / support widget
- Payment / checkout flow

---

## ♿ Accessibility & performance notes

- Keyboard: product cards and finder options are fully operable; `Esc` closes modals.
- Motion: respects `prefers-reduced-motion`.
- Colour: dark mode roles are remapped centrally; components never hard-code colour.
- Performance: no frameworks, lazy-loaded images, deferred work via `IntersectionObserver`.

---

## 📄 Licence

Use it, adapt it, ship it. Replace the placeholder brand, copy and imagery with your own.
