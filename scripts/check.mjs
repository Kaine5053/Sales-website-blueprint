#!/usr/bin/env node
/* ============================================================================
   Smoke test — no dependencies, no browser. Run with: node scripts/check.mjs
   Verifies:
     1. Every JS file parses (node --check).
     2. JSON files are valid (manifest, vercel.json).
     3. Every local asset referenced from index.html / 404.html exists on disk.
     4. The data files define their expected globals.
   Exits non-zero on any failure so it can gate CI or a SessionStart hook.
   ============================================================================ */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const pass = (m) => console.log('  \x1b[32m✓\x1b[0m ' + m);
const fail = (m) => { console.log('  \x1b[31m✗ ' + m + '\x1b[0m'); failures++; };

/* 1. JS syntax ---------------------------------------------------------- */
console.log('\nJavaScript syntax:');
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
walk(join(root, 'assets/js')).filter((f) => f.endsWith('.js')).concat([join(root, 'sw.js')])
  .forEach((file) => {
    try { execSync(`node --check "${file}"`, { stdio: 'pipe' }); pass(file.replace(root + '/', '')); }
    catch (e) { fail(file.replace(root + '/', '') + ' — ' + String(e.stderr || e).split('\n')[0]); }
  });

/* 2. JSON validity ------------------------------------------------------ */
console.log('\nJSON files:');
['site.webmanifest', 'vercel.json'].forEach((f) => {
  const p = join(root, f);
  if (!existsSync(p)) return fail(f + ' — missing');
  try { JSON.parse(readFileSync(p, 'utf8')); pass(f); }
  catch (e) { fail(f + ' — ' + e.message); }
});

/* 3. Referenced local assets exist -------------------------------------- */
console.log('\nReferenced assets exist:');
for (const html of ['index.html', '404.html']) {
  const src = readFileSync(join(root, html), 'utf8');
  const refs = [...src.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1])
    .filter((u) => !/^(https?:|data:|mailto:|tel:|#)/.test(u));
  const unique = [...new Set(refs)];
  unique.forEach((ref) => {
    const clean = ref.replace(/^\//, '').split(/[?#]/)[0];
    existsSync(join(root, clean)) ? pass(`${html} → ${ref}`) : fail(`${html} → ${ref} (not found)`);
  });
}

/* 4. Data files define expected globals --------------------------------- */
console.log('\nData globals:');
const sandboxChecks = [
  ['assets/js/config.js', 'SITE_CONFIG', (v) => v && v.brand && v.nav],
  ['assets/js/products.js', 'PRODUCTS', (v) => Array.isArray(v) && v.length > 0],
  ['assets/js/questionnaire.js', 'QUESTIONNAIRE', (v) => v && Array.isArray(v.questions)],
  ['assets/js/presets.js', 'THEME_PRESETS', (v) => Array.isArray(v) && v.length > 0],
];
for (const [file, name, ok] of sandboxChecks) {
  try {
    const code = readFileSync(join(root, file), 'utf8');
    const win = {};
    // eslint-disable-next-line no-new-func
    new Function('window', 'self', code)(win, win);
    ok(win[name]) ? pass(`${name} defined in ${file}`) : fail(`${name} invalid in ${file}`);
  } catch (e) { fail(`${file} — ${e.message}`); }
}

/* Cross-check: every product image referenced exists -------------------- */
console.log('\nProduct images:');
try {
  const win = {};
  new Function('window', 'self', readFileSync(join(root, 'assets/js/products.js'), 'utf8'))(win, win);
  (win.PRODUCTS || []).forEach((p) => {
    existsSync(join(root, p.image)) ? pass(`${p.id} → ${p.image}`) : fail(`${p.id} → ${p.image} (missing)`);
  });
} catch (e) { fail('products image check — ' + e.message); }

console.log('');
if (failures) { console.error(`\x1b[31m${failures} check(s) failed.\x1b[0m\n`); process.exit(1); }
console.log('\x1b[32mAll checks passed.\x1b[0m\n');
