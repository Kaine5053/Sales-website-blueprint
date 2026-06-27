# Tests

End-to-end + accessibility harnesses for the blueprint. They drive a real
headless Chromium against `index.html` (served from the repo root via `file://`).

## Prerequisites (dev-only — the site itself ships zero dependencies)

```bash
npm install            # installs playwright + axe-core (devDependencies)
npx playwright install chromium   # one-time browser download
```

> In the original Claude Code cloud environment Chromium was pre-installed at
> `/opt/pw-browsers/chromium`; the harnesses try that path first and fall back
> to a normal `chromium.launch()`, so they work locally after the steps above.

## Run

```bash
npm run check       # zero-dependency smoke test (no browser) — scripts/check.mjs
npm run test:e2e    # full regression: 18 flows (catalog, finder, compare, quote…)
npm run test:edge   # edge cases (compare cap, persistence, empty states…)
npm run test:a11y   # axe-core WCAG audit (light + dark + finder modal) — must be 0
npm test            # all of the above
```

Each harness exits non-zero on failure, so they gate CI / pre-deploy.

## What each covers

| File              | Covers |
|-------------------|--------|
| `regression.cjs`  | 18 assertions across every major flow + "no JS console errors". |
| `edge.cjs`        | Compare cap (max 4), favourites/quote persistence across reload, empty states, quiz back, preset persistence, modal re-open. |
| `a11y.cjs`        | axe-core run in light, dark and the finder modal. **Invariant: 0 violations.** |

When you add a feature, add an assertion here and keep `test:a11y` at 0.
