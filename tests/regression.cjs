// Reusable full regression harness. Exits non-zero on any failure.
const { chromium } = require('playwright');
const ROOT = process.cwd();
const results = []; let failed = 0;
const ok  = (n, c) => { results.push((c?'✓':'✗')+' '+n); if(!c) failed++; };
(async () => {
  const errors = [];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(()=>chromium.launch());
  const ctx = await browser.newContext({ viewport:{width:1280,height:900} });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type()==='error' && !/ERR_CONNECTION_CLOSED|Failed to load resource/.test(m.text())) errors.push(m.text().slice(0,140)); });
  page.on('pageerror', e => errors.push('JS: '+e.message));
  const url = 'file://'+ROOT+'/index.html';
  await page.goto(url, { waitUntil:'load' });
  await page.evaluate(()=>localStorage.clear());
  await page.reload({ waitUntil:'load' }); await page.waitForTimeout(600);

  ok('home renders 6 products', (await page.$$('.product-card')).length===6);
  ok('JSON-LD present', (await page.$$('script[type="application/ld+json"]')).length===2);

  // search
  await page.fill('#catalog-search','titan'); await page.waitForTimeout(250);
  ok('search filters to 1', (await page.$$('.product-card')).length===1);
  await page.fill('#catalog-search',''); await page.waitForTimeout(250);

  // category filter
  await page.click('[data-category="Enterprise"]'); await page.waitForTimeout(200);
  ok('Enterprise filter shows 2', (await page.$$('.product-card')).length===2);
  await page.click('[data-category="All"]'); await page.waitForTimeout(200);

  // finder full flow
  await page.click('[data-action="open-quiz"]'); await page.waitForTimeout(300);
  await page.click('[data-quiz-next]'); await page.waitForTimeout(150);
  await page.click('[data-quiz-option="medium"]'); await page.waitForTimeout(400);
  await page.click('[data-quiz-option="high"]'); await page.waitForTimeout(400);
  await page.click('[data-quiz-option="expert"]'); await page.waitForTimeout(400);
  await page.click('[data-quiz-option="performance"]'); await page.click('[data-quiz-option="support"]'); await page.waitForTimeout(150);
  await page.click('[data-quiz-next]'); await page.waitForTimeout(400);
  const top = await page.$eval('.quiz-pick', n=>n.textContent).catch(()=>'');
  ok('finder returns a top match', /Top match/i.test(top));
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);

  // product modal + deep link hash
  await (await page.$$('.product-card'))[0].click(); await page.waitForTimeout(300);
  ok('product modal opens', (await page.$eval('#product-modal',m=>m.getAttribute('aria-hidden')))==='false');
  ok('related products present', (await page.$$('.pd-related-card')).length===3);
  ok('hash updates on open', /#product\//.test(await page.evaluate(()=>location.hash)));
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  ok('hash clears on close', (await page.evaluate(()=>location.hash))==='');

  // favourite + filter
  await (await page.$$('[data-fave]'))[0].click(); await page.waitForTimeout(150);
  ok('fave count = 1', (await page.$eval('#fave-count',n=>n.textContent))==='1');
  await page.click('[data-faves-only]'); await page.waitForTimeout(250);
  ok('faves filter shows 1', (await page.$$('.product-card')).length===1);
  await page.click('[data-faves-only]'); await page.waitForTimeout(200);

  // compare
  const tg = await page.$$('[data-compare]');
  await tg[0].click(); await tg[1].click(); await page.waitForTimeout(200);
  await page.click('#compare-open'); await page.waitForTimeout(400);
  ok('compare table 3 cols', (await page.$$('.compare-table thead th')).length===3);
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);

  // quote
  await (await page.$$('.product-card'))[0].click(); await page.waitForTimeout(250);
  await page.click('[data-product-request]'); await page.waitForTimeout(350);
  ok('quote basket has 1 chip', (await page.$$('.quote-chip')).length===1);

  // variant carries into the quote: open a configured product, pick a non-default
  // priced option, request it → the chip shows that option label.
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);
  let configured=false;
  for (const c of (await page.$$('.product-card'))){
    await c.click(); await page.waitForTimeout(200);
    if ((await page.$$('.pd-opt__choice')).length>=2){
      await page.click('.pd-opt__choice[data-opt="0"][data-choice="1"]'); await page.waitForTimeout(150);
      await page.click('[data-product-request]'); await page.waitForTimeout(300);
      configured=true; break;
    }
    await page.keyboard.press('Escape'); await page.waitForTimeout(120);
  }
  ok('configured product carries option into quote', configured && (await page.$$('.quote-chip__opts')).length>=1);

  // resources article
  await page.evaluate(()=>document.querySelector('#resources').scrollIntoView()); await page.waitForTimeout(250);
  await (await page.$$('[data-resource]'))[0].click(); await page.waitForTimeout(300);
  ok('article opens', (await page.$eval('#article-modal',m=>m.getAttribute('aria-hidden')))==='false');
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);

  // theme preset + dark mode
  await page.click('#theme-fab'); await page.waitForTimeout(150);
  await page.click('[data-preset="luxury"]'); await page.waitForTimeout(200);
  ok('luxury preset hue applied', (await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--brand-h').trim()))==='38');
  await page.click('#theme-panel label.switch'); await page.waitForTimeout(200);
  ok('dark mode active', (await page.evaluate(()=>document.documentElement.getAttribute('data-theme')))==='dark');

  // mobile viewport: nav drawer
  await page.setViewportSize({width:390,height:780}); await page.waitForTimeout(200);
  await page.click('#nav-toggle'); await page.waitForTimeout(300);
  ok('mobile drawer opens', (await page.$eval('#mobile-drawer',d=>d.getAttribute('data-open')))==='true');

  ok('no JS errors', errors.length===0);

  console.log(results.join('\n'));
  if (errors.length) console.log('\nERRORS:\n'+errors.join('\n'));
  console.log('\n'+(failed? `\x1b[31m${failed} FAILED\x1b[0m` : '\x1b[32mALL PASS\x1b[0m'));
  await browser.close();
  process.exit(failed?1:0);
})().catch(e=>{console.error('FATAL',e.message);process.exit(2);});
