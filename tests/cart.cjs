/* Cart + Stripe-checkout flow (commerce.mode='cart').
   Serves the repo over HTTP and rewrites config.js to enable cart mode, then
   drives add-to-cart, qty, the drawer, an axe scan, and a stubbed checkout. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const axeSrc = fs.readFileSync(require.resolve('axe-core'), 'utf8');
const ROOT = process.cwd();
const r = []; let failed = 0;
const ok = (n, c) => { r.push((c ? '✓' : '✗') + ' ' + n); if (!c) failed++; };
const TYPES = { '.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json','.xml':'application/xml','.txt':'text/plain' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = path.join(ROOT, p);
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  let body = fs.readFileSync(fp);
  if (p.endsWith('/config.js')) body = Buffer.from(String(body).replace("mode: 'quote'", "mode: 'cart'"));
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(fp)] || 'application/octet-stream' });
  res.end(body);
});

(async () => {
  await new Promise((res) => server.listen(0, res));
  const port = server.address().port;
  const base = `http://localhost:${port}`;
  const errors = [];
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
  const p = await b.newContext({ viewport: { width: 1280, height: 900 } }).then((c) => c.newPage());
  p.on('pageerror', (e) => errors.push('JS: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_/.test(m.text())) errors.push(m.text().slice(0, 140)); });

  await p.goto(base + '/index.html', { waitUntil: 'load' });
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(400);

  ok('cart mode active', await p.evaluate(() => window.SITE_CONFIG.commerce.mode === 'cart'));
  ok('cart button in header', !!(await p.$('#cart-button')));
  await p.evaluate(() => document.querySelector('#products').scrollIntoView()); await p.waitForTimeout(200);
  ok('product cards have add-to-cart', (await p.$$('[data-add-cart]')).length > 0);

  // add from a card
  await (await p.$$('[data-add-cart]'))[0].click(); await p.waitForTimeout(150);
  ok('badge shows 1 after add', (await p.$eval('#cart-button .cart-button__count', (n) => n.textContent)) === '1');

  // add the same product again → qty merges to 2
  await (await p.$$('[data-add-cart]'))[0].click(); await p.waitForTimeout(150);
  ok('badge shows 2 after re-add (qty merge)', (await p.$eval('#cart-button .cart-button__count', (n) => n.textContent)) === '2');

  // open the cart drawer
  await p.click('#cart-button'); await p.waitForTimeout(300);
  ok('cart drawer opens', (await p.$eval('#cart-modal', (m) => m.getAttribute('aria-hidden'))) === 'false');
  ok('one cart line with qty 2', (await p.$$('.cart-line')).length === 1 && (await p.$eval('.qty-val', (n) => n.textContent)) === '2');

  // axe scan of the open drawer
  await p.addScriptTag({ content: axeSrc });
  const v = await p.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations
    .filter((x) => x.impact === 'serious' || x.impact === 'critical'));
  ok('cart drawer axe: 0 serious/critical', v.length === 0);
  if (v.length) console.log('  axe:', v.map((x) => x.id).join(', '));

  // qty stepper: increase to 3, then decrease to 1
  await p.click('.cart-line__qty [data-delta="1"]'); await p.waitForTimeout(120);
  ok('qty increments to 3', (await p.$eval('.qty-val', (n) => n.textContent)) === '3');
  await p.click('.cart-line__qty [data-delta="-1"]'); await p.click('.cart-line__qty [data-delta="-1"]'); await p.waitForTimeout(120);
  ok('qty decrements to 1', (await p.$eval('.qty-val', (n) => n.textContent)) === '1');

  // checkout error path first (a failed call re-enables the button so we can
  // then exercise the success path; the real success path navigates away).
  await p.route('**/api/checkout', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'nope' }) }));
  await p.click('[data-cart-checkout]'); await p.waitForTimeout(300);
  ok('failed checkout does not redirect', (await p.evaluate(() => location.hash)) === '');
  ok('cart still has the item after failed checkout', (await p.$$('.cart-line')).length === 1);
  ok('checkout button re-enabled after failure', !(await p.$eval('[data-cart-checkout]', (n) => n.disabled)));

  // success path: stub a hash-only redirect URL so window.location.assign()
  // updates location without a full navigation (keeps the test context alive).
  let postedBody = null;
  await p.unroute('**/api/checkout');
  await p.route('**/api/checkout', (route) => {
    postedBody = route.request().postDataJSON();
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ url: '#stripe-checkout-stub' }) });
  });
  await p.click('[data-cart-checkout]'); await p.waitForTimeout(300);
  ok('checkout POSTs cart items {id,qty}', !!postedBody && Array.isArray(postedBody.items) && postedBody.items[0].qty === 1 && !!postedBody.items[0].id);
  ok('checkout redirects to returned URL', (await p.evaluate(() => location.hash)) === '#stripe-checkout-stub');

  // success return: ?checkout=success clears the cart
  await p.goto(base + '/?checkout=success', { waitUntil: 'load' }); await p.waitForTimeout(400);
  ok('checkout=success clears the cart', (await p.evaluate(() => window.SITE_CONFIG && JSON.parse(localStorage.getItem('cart') || '[]').length)) === 0);
  ok('checkout=success strips the query param', !/checkout=/.test(await p.evaluate(() => location.search)));

  ok('no JS errors during cart tests', errors.length === 0);
  console.log(r.join('\n'));
  if (errors.length) console.log('\nERRORS:\n' + errors.join('\n'));
  console.log('\n' + (failed ? `\x1b[31m${failed} FAILED\x1b[0m` : '\x1b[32mALL PASS\x1b[0m'));
  await b.close(); server.close();
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('FATAL', e.message); server.close(); process.exit(2); });
