# Sales Website Blueprint

A clean, professional, **tier-one product sales website** built as a fully-working,
re-skinnable blueprint. Zero dependencies, no build step — open `index.html` and it runs.
Re-brand it for any product or industry by editing a few plain config files.

![status](https://img.shields.io/badge/status-blueprint-blue) ![stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-informational) ![deps](https://img.shields.io/badge/dependencies-none-success)

---

## ✨ What's included

- **Polished, modern landing page** — sticky header with mega-menu, gradient hero with floating proof cards, animated stat counters, scroll-reveal animations.
- **Product catalogue** — searchable, filterable grid that reads from a single data file.
- **Product detail view** — rich modal with features, specs, ratings and CTAs.
- **"Unsure?" guided finder** — a multi-step questionnaire that scores your catalogue and recommends the best-matched products, with a "why it matched" explanation and a match %.
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
├── assets/
│   ├── css/
│   │   ├── theme.css        ← 🎨 DESIGN TOKENS — start here to re-skin
│   │   ├── base.css         ← reset, typography, helpers
│   │   ├── components.css   ← buttons, cards, badges, modal, forms…
│   │   └── layout.css       ← section layouts + responsive rules
│   ├── js/
│   │   ├── config.js        ← 📝 SITE CONTENT — brand, nav, copy, contact
│   │   ├── products.js      ← 📦 YOUR CATALOGUE — products + match attributes
│   │   ├── questionnaire.js ← ❓ FINDER — questions + recommendation engine
│   │   └── app.js           ← rendering & interactions (rarely needs editing)
│   └── img/                 ← placeholder SVGs (swap for real photos)
└── README.md
```

---

## 🚀 Quick start

No tooling required. Either:

- **Double-click `index.html`**, or
- Serve it locally for nicer URLs:
  ```bash
  npx serve .        # or: python3 -m http.server
  ```

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
Brand name & logo, announcement bar, nav links, hero copy, features,
pricing plans, testimonials, FAQ, contact details and footer. All plain strings.

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

## 🔌 Going to production — wiring up the forms

The contact and newsletter forms are front-end only (they show a success toast).
To make them real, point them at your backend or a form service (Formspree,
Basin, Netlify Forms, your own API) inside `app.js` → `initEvents()`.

Suggested next integrations:
- Analytics (GA4, Plausible, Fathom)
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
