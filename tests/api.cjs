/* Unit tests for api/checkout.js — no network, no real Stripe.
   Mocks global.fetch + process.env and asserts the server sources prices
   itself (client-sent prices are ignored) and validates input. */
const handler = require('../api/checkout.js');
const r = []; let failed = 0;
const ok = (n, c) => { r.push((c ? '✓' : '✗') + ' ' + n); if (!c) failed++; };

// Minimal Express-style res mock.
function mockRes() {
  return {
    statusCode: 200, body: null, headers: {},
    status(c) { this.statusCode = c; return this; },
    json(o) { this.body = o; return this; },
    setHeader(k, v) { this.headers[k] = v; },
  };
}
const call = (req) => { const res = mockRes(); return Promise.resolve(handler(req, res)).then(() => res); };

(async () => {
  const realFetch = global.fetch;
  let lastBody = null;
  global.fetch = (url, opts) => { lastBody = opts.body; return Promise.resolve({
    ok: true, json: () => Promise.resolve({ url: 'https://checkout.stripe.com/c/pay/test_123', id: 'cs_test_123' }),
  }); };

  // 1. method guard
  delete process.env.STRIPE_SECRET_KEY;
  let res = await call({ method: 'GET', headers: {} });
  ok('GET is rejected 405', res.statusCode === 405);

  // 2. missing key
  res = await call({ method: 'POST', headers: {}, body: { items: [{ id: 'aurora-core', qty: 1 }] } });
  ok('missing STRIPE_SECRET_KEY → 500', res.statusCode === 500 && /not configured/i.test(res.body.error));

  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';

  // 3. empty cart
  res = await call({ method: 'POST', headers: { host: 'shop.test' }, body: { items: [] } });
  ok('empty cart → 400', res.statusCode === 400);

  // 4. unknown product
  res = await call({ method: 'POST', headers: { host: 'shop.test' }, body: { items: [{ id: 'nope', qty: 1 }] } });
  ok('unknown product → 400', res.statusCode === 400 && /unknown product/i.test(res.body.error));

  // 5. happy path: server sources price, ignores client-sent price
  res = await call({ method: 'POST', headers: { host: 'shop.test' },
    body: { items: [{ id: 'aurora-core', qty: 2, price: 1 /* tampered */ }] } });
  ok('valid cart → 200 with Stripe url', res.statusCode === 200 && /checkout\.stripe\.com/.test(res.body.url));
  ok('uses server price 199.00 → unit_amount 19900 (ignores client price)', /unit_amount%5D=19900/.test(lastBody));
  ok('quantity is forwarded', /quantity%5D=2/.test(lastBody));
  ok('currency comes from config (gbp)', /currency%5D=gbp/.test(lastBody));
  ok('success_url built from host', /success_url=https%3A%2F%2Fshop\.test/.test(lastBody));

  // 6. variant price delta is applied server-side (aurora-pro 449 + 2yr care 99 = 548)
  res = await call({ method: 'POST', headers: { host: 'shop.test' },
    body: { items: [{ id: 'aurora-pro', sel: [1, 0], qty: 1 }] } });
  ok('variant delta applied → 54800', /unit_amount%5D=54800/.test(lastBody));

  // 7. qty is clamped to a sane range
  res = await call({ method: 'POST', headers: { host: 'shop.test' },
    body: { items: [{ id: 'aurora-core', qty: 9999 }] } });
  ok('quantity clamped to 99', /quantity%5D=99/.test(lastBody));

  // 8. Stripe error surfaces as 502
  global.fetch = () => Promise.resolve({ ok: false, json: () => Promise.resolve({ error: { message: 'bad' } }) });
  res = await call({ method: 'POST', headers: { host: 'shop.test' }, body: { items: [{ id: 'aurora-core', qty: 1 }] } });
  ok('Stripe failure → 502', res.statusCode === 502 && res.body.error === 'bad');

  global.fetch = realFetch;
  console.log(r.join('\n'));
  console.log('\n' + (failed ? `\x1b[31m${failed} FAILED\x1b[0m` : '\x1b[32mALL PASS\x1b[0m'));
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(2); });
