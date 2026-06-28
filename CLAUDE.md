# CLAUDE.md — project guide for AI agents

A **static, zero-dependency product sales website blueprint** (vanilla HTML/CSS/JS).
No framework, no build step. Open `index.html` or serve the folder.

## Architecture (where things live)

- `index.html` — section scaffolding + mount points (`#…-mount`) + modals. Most
  content is rendered into these mounts by JS from the data files.
- `assets/css/` — load order matters: `theme.css` (design tokens) → `base.css`
  → `components.css` → `layout.css` → `features.css`; `print.css` is print-only.
  **All colour/spacing/typography flows from tokens in `theme.css`** — never
  hard-code colours in components.
- `assets/js/`
  - `config.js` → `window.SITE_CONFIG` — brand, currency, nav, hero, pricing,
    testimonials, resources (with article bodies), FAQ, cookies, analytics,
    contact, footer. **This is the main content/branding edit surface.**
  - `products.js` → `window.PRODUCTS` — catalogue. Optional `compareAtPrice`
    (sale) and `stock` ('in'|'low'|'out'). `attrs` tags feed the finder.
  - `questionnaire.js` → `window.QUESTIONNAIRE` + `window.recommendProducts()`
    — the "Help me choose" finder questions and the weighted scoring engine.
    Question `attr` + option `value` must match the tags in `products.js`.
  - `presets.js` → `window.THEME_PRESETS` — industry skins (token overrides).
  - `app.js` — all rendering + interaction (one IIFE). Key pieces: `t`/`esc`/
    `money` helpers, `icon()` SVG library, per-section `renderX()` funcs, the
    quiz wizard, comparison, favourites, quote basket, hash router, theme
    switcher, cookie consent + `track()` analytics, modal focus-trap.
  - `sw.js` + `sw-register.js` — optional offline PWA.

## Conventions / invariants

- **Escape all interpolated data** with `esc()` before putting it in HTML.
- **localStorage** only via `lsGet`/`lsSet`/`store` (never throw in private mode).
- **No nested interactive elements** — cards use the stretched-link pattern
  (a real `<button>` trigger with an `::after` overlay), not `role="button"`
  wrappers around buttons.
- **Accessibility is a gate**: keep axe-core at **0 violations** (light + dark).
  Brand-coloured small text uses `--brand-text`; status labels use
  `--success-strong` / `--warning-strong`.
- `init()` runs each section through `safe()` so one bad config field warns
  instead of breaking the whole page.

## Commands

```bash
npm start          # serve locally (npx serve .) — use http, not file://
npm run check      # zero-dependency smoke test (scripts/check.mjs)
npm test           # check + api + e2e + edge + cart + a11y (needs playwright+axe)
npm run test:a11y  # axe-core audit — MUST stay at 0 violations (light + dark)
```

Browser tests need a one-time `npm install && npx playwright install chromium`
(see `tests/README.md`). CI (`.github/workflows/ci.yml`) runs `npm run check` on
every push/PR. Deploys to Vercel automatically on push (static, config in
`vercel.json`); live at https://sales-website-blueprint.vercel.app.

## Handover / continuing the project

Start with `docs/HANDOVER.md` (full handover) and `docs/SESSION-LOG.md`
(iteration history). Working branch: `claude/github-repo-website-build-k8c1mh`.

## When making changes

1. Prefer editing `config.js` / `products.js` / `questionnaire.js` for content.
2. For new UI, add tokens/classes — don't hard-code colours.
3. After changes run `npm run check`; for behavioural changes, re-verify the
   main flows (catalog, finder, product modal, compare, quote) and re-run an
   axe audit if you touched markup or colours.
