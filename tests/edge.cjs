const { chromium } = require('playwright');
const ROOT=process.cwd(); const r=[]; let f=0;
const ok=(n,c)=>{r.push((c?'✓':'✗')+' '+n); if(!c)f++;};
(async()=>{
  const errors=[];
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
  const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
  p.on('pageerror',e=>errors.push('JS: '+e.message));
  p.on('console',m=>{if(m.type()==='error'&&!/ERR_CONNECTION_CLOSED|Failed to load resource/.test(m.text()))errors.push(m.text().slice(0,140));});
  await p.goto('file://'+ROOT+'/index.html',{waitUntil:'load'});
  await p.evaluate(()=>localStorage.clear()); await p.reload({waitUntil:'load'}); await p.waitForTimeout(500);
  await p.evaluate(()=>document.querySelector('#products').scrollIntoView()); await p.waitForTimeout(200);

  // compare cap at 4: click all 6 compare toggles
  const tg=await p.$$('[data-compare]');
  for(const t of tg){ await t.click(); await p.waitForTimeout(40); }
  const sel=await p.$eval('#compare-count',n=>n.textContent);
  ok('compare caps at 4 (got "'+sel+'")', /4 selected/.test(sel));

  // favourites + quote persist across reload
  await (await p.$$('[data-fave]'))[0].click(); await p.waitForTimeout(80);
  await (await p.$$('.product-card'))[0].click(); await p.waitForTimeout(250);
  await p.click('[data-product-request]'); await p.waitForTimeout(250);
  await p.reload({waitUntil:'load'}); await p.waitForTimeout(500);
  ok('faves persist across reload', (await p.$eval('#fave-count',n=>n.textContent))==='1');
  ok('quote persists across reload', (await p.$$('.quote-chip')).length===1);

  // search empty state
  await p.fill('#catalog-search','zzzzz'); await p.waitForTimeout(250);
  ok('empty state shows help button', !!(await p.$('.empty-state [data-action="open-quiz"]')));
  await p.fill('#catalog-search',''); await p.waitForTimeout(150);

  // quiz: open, restart resets answers, back navigation
  await p.click('[data-action="open-quiz"]'); await p.waitForTimeout(200);
  await p.click('[data-quiz-next]'); await p.waitForTimeout(150);
  await p.click('[data-quiz-option="personal"]'); await p.waitForTimeout(400);
  await p.click('[data-quiz-back]'); await p.waitForTimeout(200); // back to intro? step 0 -> -1 path
  const qstep = await p.$('.quiz__question') ? 'rendered' : 'missing';
  ok('quiz back keeps a valid screen', qstep==='rendered');
  await p.keyboard.press('Escape');

  // theme preset persists across reload
  await p.click('#theme-fab'); await p.waitForTimeout(120);
  await p.click('[data-preset="eco"]'); await p.waitForTimeout(150);
  await p.reload({waitUntil:'load'}); await p.waitForTimeout(500);
  ok('preset persists across reload', (await p.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--brand-h').trim()))==='142');

  // double-open compare modal doesn't duplicate print handler (sanity: open/close/open)
  await p.evaluate(()=>document.querySelector('#products').scrollIntoView()); await p.waitForTimeout(150);
  const t2=await p.$$('[data-compare]'); await t2[0].click(); await t2[1].click(); await p.waitForTimeout(120);
  await p.click('#compare-open'); await p.waitForTimeout(200); await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  await p.click('#compare-open'); await p.waitForTimeout(200);
  ok('compare reopens cleanly', (await p.$eval('#compare-modal',m=>m.getAttribute('aria-hidden')))==='false');
  await p.keyboard.press('Escape');

  // pagination / "show more": shrink the page size and confirm it reveals the rest
  await p.evaluate(()=>document.querySelector('#products').scrollIntoView()); await p.waitForTimeout(120);
  await p.evaluate(()=>{ window.SITE_CONFIG.catalog.pageSize=6; });
  await p.click('[data-category="All"]'); await p.waitForTimeout(150);
  ok('pagination shows first page of 6', (await p.$$('#product-grid .product-card')).length===6);
  ok('load-more button present', !!(await p.$('[data-load-more]')));
  await p.click('[data-load-more]'); await p.waitForTimeout(150);
  ok('load-more reveals the rest (12)', (await p.$$('#product-grid .product-card')).length===12);
  ok('load-more hides when exhausted', !(await p.$('[data-load-more]')));

  // configurable form backend: success path POSTs to the endpoint + clears form
  await p.evaluate(()=>{
    window.__fetchCalls=[];
    window.SITE_CONFIG.contact.endpoint='https://example.test/submit';
    window.fetch=(url,opts)=>{ window.__fetchCalls.push({url,hasBody:!!(opts&&opts.body)}); return Promise.resolve({ok:true,json:()=>Promise.resolve({})}); };
  });
  await p.evaluate(()=>document.querySelector('#contact').scrollIntoView()); await p.waitForTimeout(120);
  await p.fill('#cf-name','Test User'); await p.fill('#cf-email','t@e.com'); await p.fill('#cf-message','hi');
  await p.click('#contact-form [type="submit"]'); await p.waitForTimeout(200);
  const call=await p.evaluate(()=>window.__fetchCalls[0]);
  ok('contact endpoint POSTs to configured URL', !!call && call.url==='https://example.test/submit' && call.hasBody);
  ok('contact form resets after successful POST', (await p.$eval('#cf-name',n=>n.value))==='');

  // failure path leaves the form intact so the visitor can retry
  await p.evaluate(()=>{ window.fetch=()=>Promise.resolve({ok:false,status:500}); });
  await p.fill('#cf-name','Retry Me'); await p.fill('#cf-email','r@e.com'); await p.fill('#cf-message','again');
  await p.click('#contact-form [type="submit"]'); await p.waitForTimeout(200);
  ok('contact form kept intact after failed POST', (await p.$eval('#cf-name',n=>n.value))==='Retry Me');

  // interactive setup guide: the demo still has every placeholder, so the
  // launcher shows "Set up your site (6)" and all essentials read as "to do".
  ok('setup launcher visible on unconfigured demo', (await p.$eval('#setup-launcher', (n) => n.hidden)) === false);
  await p.click('#setup-launcher'); await p.waitForTimeout(250);
  ok('setup modal opens', (await p.$eval('#setup-modal', (m) => m.getAttribute('aria-hidden'))) === 'false');
  ok('setup lists all tasks (6 essential + 2 optional)', (await p.$$('.setup-item')).length === 8);
  ok('setup progressbar tracks 6 essentials', (await p.$eval('.setup-progress', (n) => n.getAttribute('aria-valuemax'))) === '6');
  // brand is still "Northwind" → that task must read as not-done regardless of test order
  ok('unreplaced brand reads as to-do', (await p.$eval('.setup-item', (n) => n.classList.contains('is-done'))) === false);
  await p.click('[data-setup-dismiss]'); await p.waitForTimeout(150);
  ok('dismiss hides the launcher + persists', (await p.$eval('#setup-launcher', (n) => n.hidden)) === true
    && (await p.evaluate(() => localStorage.getItem('setup-dismissed'))) === '1');

  // image fallback now runs via a delegated capture-phase handler (CSP-safe,
  // no inline onerror): a broken image with data-imgfallback should be hidden
  const fb = await p.evaluate(()=> new Promise((resolve)=>{
    const img=document.createElement('img');
    img.setAttribute('data-imgfallback','hide');
    img.addEventListener('error', ()=> setTimeout(()=>resolve(img.style.visibility),60));
    img.src='/this-image-does-not-exist-'+Math.random().toString(36).slice(2)+'.png';
    document.body.appendChild(img);
  }));
  ok('delegated image fallback hides broken img', fb==='hidden');

  ok('no JS errors during edge tests', errors.length===0);
  console.log(r.join('\n')); if(errors.length) console.log('\nERRORS:\n'+errors.join('\n'));
  console.log('\n'+(f?`\x1b[31m${f} FAILED\x1b[0m`:'\x1b[32mALL PASS\x1b[0m'));
  await b.close(); process.exit(f?1:0);
})().catch(e=>{console.error('FATAL',e.message);process.exit(2);});
