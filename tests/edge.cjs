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

  ok('no JS errors during edge tests', errors.length===0);
  console.log(r.join('\n')); if(errors.length) console.log('\nERRORS:\n'+errors.join('\n'));
  console.log('\n'+(f?`\x1b[31m${f} FAILED\x1b[0m`:'\x1b[32mALL PASS\x1b[0m'));
  await b.close(); process.exit(f?1:0);
})().catch(e=>{console.error('FATAL',e.message);process.exit(2);});
