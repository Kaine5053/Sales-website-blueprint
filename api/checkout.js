/* ============================================================================
   POST /api/checkout — create a Stripe Checkout Session (Vercel Serverless Fn).
   ----------------------------------------------------------------------------
   The browser POSTs a cart: { items: [{ id, sel?: number[], qty }] }. This
   function looks every product up in the SAME products.js the site renders from
   (single source of truth — evaluated server-side), recomputes the price from
   the server's data (NEVER trusts client-sent prices/names), and asks Stripe to
   create a hosted Checkout Session. It returns { url } for the browser to
   redirect to.

   Setup (in your Vercel project — NOT in the repo):
     • STRIPE_SECRET_KEY   – required; your Stripe secret key (sk_live_… / sk_test_…)
     • CHECKOUT_BASE_URL   – optional; absolute site URL for the success/cancel
                             redirects. Defaults to the request's own host.

   Optional per product (products.js): `stripePriceId: 'price_…'` to bill a
   pre-created Stripe Price. Products without one (or any variant that changes
   the price) fall back to inline price_data built from the server-side price,
   so the demo works before you create any Stripe Prices.
   ============================================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Evaluate a browser data file (assets/js/*.js that assigns window.X) in a
// sandbox and return that global. Cached across warm invocations.
let _cache = null;
function loadCatalogue() {
  if (_cache) return _cache;
  const root = path.join(__dirname, '..', 'assets', 'js');
  const sandbox = { window: {}, self: {} };
  sandbox.self = sandbox.window;
  for (const file of ['config.js', 'products.js']) {
    const code = fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInNewContext(code, sandbox, { timeout: 1000 });
  }
  const cfg = sandbox.window.SITE_CONFIG || {};
  const products = sandbox.window.PRODUCTS || [];
  const byId = new Map(products.map((p) => [p.id, p]));
  _cache = { currency: (cfg.currency && cfg.currency.code) || 'USD', byId };
  return _cache;
}

// Server-side price for a configured line — base + selected option deltas.
function linePrice(p, sel) {
  let total = Number(p.price) || 0;
  (p.options || []).forEach((g, gi) => {
    const c = g.choices[(sel || [])[gi]];
    if (c) total += Number(c.priceDelta) || 0;
  });
  return total;
}
function optionLabels(p, sel) {
  return (p.options || [])
    .map((g, gi) => { const c = g.choices[(sel || [])[gi]]; return c ? c.label : null; })
    .filter(Boolean);
}

// Flatten a nested object into Stripe's form-encoded bracket notation.
function toForm(obj, prefix, out) {
  out = out || [];
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const name = prefix ? `${prefix}[${key}]` : key;
    if (val !== null && typeof val === 'object') toForm(val, name, out);
    else out.push(`${encodeURIComponent(name)}=${encodeURIComponent(val)}`);
  }
  return out;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: 'Checkout is not configured (missing STRIPE_SECRET_KEY).' });
  }

  try {
    // Vercel parses JSON bodies for Node functions, but accept a raw string too.
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const items = (body && Array.isArray(body.items)) ? body.items : [];
    if (!items.length) return res.status(400).json({ error: 'Cart is empty.' });

    const { currency, byId } = loadCatalogue();

    const lineItems = [];
    for (const raw of items) {
      const p = byId.get(raw && raw.id);
      if (!p) return res.status(400).json({ error: `Unknown product: ${raw && raw.id}` });
      const qty = Math.max(1, Math.min(99, Math.floor(Number(raw.qty) || 1)));
      const sel = Array.isArray(raw.sel) ? raw.sel : [];
      const labels = optionLabels(p, sel);
      const customised = labels.length > 0 && linePrice(p, sel) !== Number(p.price);

      // Prefer a pre-created Stripe Price when present and the line is not a
      // price-changing variant; otherwise build inline price_data server-side.
      if (p.stripePriceId && !customised) {
        lineItems.push({ price: p.stripePriceId, quantity: qty });
      } else {
        lineItems.push({
          quantity: qty,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: Math.round(linePrice(p, sel) * 100),
            product_data: { name: p.name + (labels.length ? ` (${labels.join(', ')})` : '') },
          },
        });
      }
    }

    const base = (process.env.CHECKOUT_BASE_URL || `https://${req.headers.host}`).replace(/\/$/, '');
    const params = {
      mode: 'payment',
      success_url: `${base}/?checkout=success`,
      cancel_url: `${base}/?checkout=cancelled`,
      line_items: lineItems,
    };

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: toForm(params).join('&'),
    });
    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      const msg = (session && session.error && session.error.message) || 'Stripe error';
      return res.status(502).json({ error: msg });
    }
    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    return res.status(500).json({ error: 'Checkout failed. Please try again.' });
  }
};
