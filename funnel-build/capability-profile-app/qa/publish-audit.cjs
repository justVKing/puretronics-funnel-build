const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const baseUrl = process.argv[2] || 'http://127.0.0.1:4174/puretronics-funnel-build/';
const tag = baseUrl.includes('github.io') ? 'public' : 'local';
const baseOrigin = new URL(baseUrl).origin;
const out = path.resolve(__dirname, 'publish');
fs.mkdirSync(out, { recursive: true });
const report = { baseUrl, date: new Date().toISOString(), checks: [], accessibility: [], consoleErrors: [], failedRequests: [], responsive: [], assets: [] };
const forbidden = /\b(?:P(?:0[1-9]|1[0-3])(?:[A-Z](?:-C\d+)?)?|PF0[1-5]|LS\d+|V4|governed|placeholder|staging|review build|source record|source authority|evidence status|publication status|Product Database|working copy|dummy children|frozen hierarchy)\b/i;
function check(label, condition, details) { report.checks.push({ label, passed: Boolean(condition), details }); assert.ok(condition, label + ': ' + JSON.stringify(details)); }
async function language(page, state) {
  const text = await page.locator('body').innerText();
  const match = text.match(forbidden);
  check('Customer language: ' + state, !match, match ? text.slice(Math.max(0, match.index - 90), match.index + 200) : undefined);
}
async function axe(page, state) {
  if (!await page.evaluate(() => Boolean(window.axe))) await page.addScriptTag({ path: require.resolve('axe-core') });
  const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa','wcag22aa'] } })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })));
  report.accessibility.push({ state, violations });
  check('Accessibility: ' + state, !violations.length, violations);
}
async function shot(page, name, fullPage = false) { await page.screenshot({ path: path.join(out, `${tag}-${name}.png`), fullPage }); }
async function watchPage(context, viewport) {
  const page = await context.newPage();
  page.on('pageerror', e => report.consoleErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  // The approved contact destination is a separate site; only the audited
  // capability profile origin contributes to this site's network verdict.
  page.on('requestfailed', r => { if (r.url().startsWith(baseOrigin)) report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }); });
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(baseOrigin)) report.failedRequests.push({ url: r.url(), status: r.status() }); });
  if (viewport) await page.setViewportSize(viewport);
  return page;
}
async function overflow(page, label) {
  const sizes = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
  report.responsive.push({ state: label, ...sizes });
  check('No horizontal overflow: ' + label, sizes.document <= sizes.width, sizes);
}
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PURETRONICS_QA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    for (const width of [390,768,1024,1440]) {
      const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion: 'reduce' });
      const page = await watchPage(context);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await language(page, `landing-${width}`); await overflow(page, `landing-${width}`); await axe(page, `landing-${width}`);
      await shot(page, `landing-${width}`, true);
      for (const [view, label] of [['navigator','Solution Navigator'],['line','Production-Line Map'],['matrix','Capability Matrix'],['compare','Comparison Workbench']]) {
        await page.getByRole('tab', { name: new RegExp(label) }).click();
        if (view === 'matrix') {
          check('Matrix default totals', (await page.locator('.coverage-metrics').innerText()).replace(/\s+/g,' ').trim() === '12 Requirement Paths 13 Products 5 Product Families');
          check('All Five Product Families label', await page.locator('.coverage-toolbar select').first().locator('option:checked').innerText() === 'All Five Product Families');
        }
        if (view === 'compare') await page.locator('.comparison-product-select select').selectOption('P08');
        await page.locator('.explorer-tabs').evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top - 85));
        await language(page, `${view}-${width}`); await overflow(page, `${view}-${width}`); await axe(page, `${view}-${width}`);
        await shot(page, `${view}-${width}`);
      }
      await context.close();
    }
    const context = await browser.newContext({ viewport: { width:1440,height:1000 }, permissions:['clipboard-read','clipboard-write'], reducedMotion:'reduce' });
    const page = await watchPage(context);
    await page.goto(baseUrl, { waitUntil:'networkidle' });
    await page.keyboard.press('Tab');
    check('Keyboard skip link', await page.getByRole('link', { name:'Skip to main content' }).evaluate(el => el === document.activeElement));
    await page.getByRole('tab', { name:/Solution Navigator/ }).focus();
    await page.keyboard.press('End');
    check('Tab End selects Workbench', await page.getByRole('tab', { name:/Comparison Workbench/ }).getAttribute('aria-selected') === 'true');
    await page.keyboard.press('Home');
    await page.getByRole('button', { name:/I Know a Product or Model/i }).click();
    await page.getByRole('searchbox', { name:'Product or Model Name' }).fill('LASER-2030H');
    check('Exact model ranks first', /LASER-H/.test(await page.locator('.result-card').first().innerText()));
    await page.getByRole('tab', { name:/Capability Matrix/ }).click();
    check('Shared search retained', await page.locator('.coverage-toolbar input').inputValue() === 'LASER-2030H');
    await page.getByRole('button', { name:'Clear Filters' }).click();
    await page.getByRole('tab', { name:/Production-Line Map/ }).click();
    await page.locator('g[aria-label^="Preheating and Other Pre-Extrusion Preparation"]').click();
    check('Stage dialog unique', await page.getByRole('dialog').count() === 1);
    await axe(page,'stage dialog');
    await page.getByRole('dialog').getByRole('button', { name:/View Product Details/ }).first().click();
    check('Product replaces stage dialog', await page.getByRole('dialog').count() === 1);
    await axe(page,'product dialog'); await language(page,'product dialog');
    const close = page.getByRole('button',{name:'Close details'}); await close.focus(); await page.keyboard.press('Shift+Tab');
    check('Dialog traps reverse Tab', await page.getByRole('dialog').evaluate(el => el.contains(document.activeElement)));
    await page.keyboard.press('Escape'); check('Escape closes dialog', await page.getByRole('dialog').count() === 0);
    check('Focus restored outside closed dialog', await page.evaluate(() => document.activeElement !== document.body));
    await page.getByRole('button', {name:'Clear Filters'}).click();
    await page.getByRole('tab', { name:/Solution Navigator/ }).click();
    await page.getByRole('button', { name:/I Know a Product or Model/i }).click();
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname,'../src/data/v4Catalog.generated.json')));
    for (const product of raw.records.filter(r=>/^P\d{2}$/.test(r.id))) {
      await page.getByRole('searchbox', { name:'Product or Model Name' }).fill(product.name);
      const button = page.getByRole('button',{name:'View details',exact:true}).first();
      await button.click();
      await page.getByRole('dialog').locator('details').evaluateAll(els=>els.forEach(el=>el.open=true));
      await language(page,'expanded '+product.name); await axe(page,'expanded '+product.name); await overflow(page,product.name);
      await page.keyboard.press('Escape');
    }
    await page.getByRole('tab', { name:/Comparison Workbench/ }).click();
    for (const product of ['P01','P02','P03','P04','P05','P07','P08','P10','P12','P13']) {
      await page.locator('.comparison-product-select select').selectOption(product);
      await language(page,'compare '+product);
    }
    await page.locator('.comparison-product-select select').selectOption('P12');
    await page.getByRole('radio',{name:'Capacity Options',exact:true}).check();
    check('All 24 loadcell capacities', await page.locator('.model-choice-grid input').count()===24);
    await page.getByRole('tab', {name:/Capability Matrix/}).click();
    await page.getByRole('tab', {name:/Comparison Workbench/}).click();
    check('Capacity comparison survives view switch', await page.getByRole('radio',{name:'Capacity Options',exact:true}).isChecked());
    await page.getByLabel('Show Differences Only').check(); await language(page,'capacity differences');
    // Start from a clean browser session for the complete MCQ flow.
    await page.evaluate(()=>sessionStorage.clear()); await page.reload({waitUntil:'networkidle'});
    await page.locator('.mcq-builder').locator('input:not([type="radio"]):not([type="checkbox"]), textarea, [contenteditable]').count().then(count=>check('No write-in review controls',count===0));
    await page.getByRole('radio',{name:'Inline Insulation-Fault Detection',exact:true}).check();
    await page.locator('.builder-sections > details').evaluateAll(els=>els.forEach(el=>el.open=true));
    await page.getByRole('radio',{name:'Acute / High-Frequency Sine-Wave AC',exact:true}).check();
    await page.getByRole('radio',{name:'Above 20 kV to 25 kV',exact:true}).check();
    await page.getByRole('button',{name:'Build My Review Brief',exact:true}).click();
    check('Known technical contradiction excludes', await page.locator('.fit-status').innerText()==='Excluded by a Known Requirement');
    await page.locator('.brief-preview details').evaluateAll(els=>els.forEach(el=>el.open=true));
    await language(page,'application brief'); await axe(page,'application brief');
    await page.getByRole('button',{name:'Copy Brief',exact:true}).click();
    const clipboard=await page.evaluate(()=>navigator.clipboard.readText());
    check('Copied brief includes exclusion',clipboard.includes('Excluded by a Known Requirement')&&!forbidden.test(clipboard));
    await page.evaluate(()=>{window.__printed=0; window.print=()=>{window.__printed++};});
    await page.getByRole('button',{name:'Print or Save Brief',exact:true}).click();
    check('Print action called',await page.evaluate(()=>window.__printed===1));
    await page.emulateMedia({media:'print'}); await page.pdf({path:path.join(out,`${tag}-application-brief.pdf`),format:'A4',printBackground:true});
    await shot(page,'brief-print',true); await page.emulateMedia({media:'screen'});
    await page.getByRole('button',{name:'Edit Answers',exact:true}).click();
    check('Edit returns to answers',await page.locator('.mcq-builder').count()===1);
    await page.getByRole('button',{name:'Build My Review Brief',exact:true}).click();
    await shot(page,'brief-1440',true);
    await page.getByRole('button',{name:'Start a New Brief',exact:true}).click();
    await page.getByRole('button',{name:'Yes, Reset',exact:true}).click();
    check('Reset clears carried scope',await page.locator('.imported-products').count()===0);
    const anchors=await page.locator('a[href^="#"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')));
    check('All page anchors resolve',await page.evaluate(hrefs=>hrefs.every(h=>h==='#'||document.getElementById(h.slice(1))),anchors),anchors);
    const assets=await page.evaluate(()=>[...new Set([...document.querySelectorAll('img[src],script[src],link[href]')].map(e=>e.src||e.href).filter(u=>u.startsWith(location.origin)&&!u.endsWith('/')))]);
    for(const url of assets){const r=await context.request.get(url);report.assets.push({url,status:r.status()});check('Direct asset '+url,r.ok());}
    const booking=await page.locator('.header-cta').getAttribute('href');
    if (/^https:\/\//.test(booking)) {
    const beforeUrl = page.url();
    await page.locator('.header-cta').click(); await page.waitForLoadState('domcontentloaded');
    check('Customer destination loaded', page.url()!==beforeUrl && !page.url().includes('placeholder'),page.url());
    check('No context in destination URL', !/[?#]/.test(page.url()),page.url());
    await page.goBack({waitUntil:'networkidle'});
    check('Booking clears saved context',await page.evaluate(()=>{
      const raw=sessionStorage.getItem('puretronics-capability-profile:v4');
      if(!raw) return true;
      try {
        const state=JSON.parse(raw).state;
        return !state || (!state.selectedProducts?.length && !state.reviewFamilyIds?.length && !Object.keys(state.readinessAnswers||{}).length && !Object.keys(state.navigatorAnswers||{}).length);
      } catch { return false; }
    }));
    } else { report.externalBlocker = 'No approved booking URL or application-review contact fallback. CTA honestly leads to brief preparation.'; check('No placeholder destination', booking === '#prepare'); }
    check('No console errors',report.consoleErrors.length===0,report.consoleErrors);
    check('No failed page requests',report.failedRequests.length===0,report.failedRequests);
    await context.close();
  } finally { await browser.close(); fs.writeFileSync(path.join(out,`${tag}-report.json`),JSON.stringify(report,null,2)); }
  console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
