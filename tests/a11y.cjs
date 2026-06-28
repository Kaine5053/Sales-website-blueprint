const { chromium } = require('playwright');
const axePath = require.resolve('axe-core');
const fs = require('fs');
const ROOT = process.cwd();
const axeSrc = fs.readFileSync(axePath, 'utf8');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
  const p=await b.newPage({viewport:{width:1280,height:900}});
  const scan = async (label) => {
    await p.addScriptTag({ content: axeSrc });
    const res = await p.evaluate(async () => await window.axe.run(document, { resultTypes:['violations'] }));
    const v = res.violations.filter(x=>x.impact!=='minor'); // show moderate+ 
    console.log(`\n=== ${label}: ${res.violations.length} violations (${v.length} moderate+) ===`);
    res.violations.forEach(x=>{
      console.log(`  [${x.impact}] ${x.id} — ${x.help} (${x.nodes.length} node(s))`);
      console.log(`      e.g. ${x.nodes[0].target.join(' ')}`);
    });
  };
  await p.goto('file://'+ROOT+'/index.html',{waitUntil:'load'}); await p.waitForTimeout(600);
  await scan('Home (light)');
  // dark mode
  await p.evaluate(()=>document.documentElement.setAttribute('data-theme','dark')); await p.waitForTimeout(200);
  await scan('Home (dark)');
  // open quiz modal
  await p.evaluate(()=>document.documentElement.setAttribute('data-theme','light'));
  await p.click('[data-action="open-quiz"]'); await p.waitForTimeout(300);
  await scan('Finder modal');
  // setup guide modal (launcher is visible on the unconfigured demo)
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  await p.click('#setup-launcher'); await p.waitForTimeout(300);
  await scan('Setup guide modal');
  await b.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
