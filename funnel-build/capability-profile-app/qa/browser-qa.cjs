const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const baseUrl = process.env.PURETRONICS_QA_URL || 'http://127.0.0.1:5173/puretronics-funnel-build/';
const screenshots = path.join(__dirname, 'screenshots');
fs.mkdirSync(screenshots, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const report = { baseUrl, viewports: [], consoleErrors: [], failedResponses: [], interactions: {} };
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1024, height: 900 }, { width: 1440, height: 900 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
    page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push({ viewport: viewport.width, text: message.text() }); });
    page.on('response', (response) => { if (response.status() >= 400) report.failedResponses.push({ viewport: viewport.width, status: response.status(), url: response.url() }); });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length, families: [...document.querySelectorAll('.family-toggle-grid button')].length, fontHeading: getComputedStyle(document.querySelector('h1')).fontFamily, fontBody: getComputedStyle(document.body).fontFamily }));
    if (viewport.width !== 1024) await page.screenshot({ path: path.join(screenshots, `capability-profile-${viewport.width}.png`), fullPage: true });
    report.viewports.push({ ...viewport, ...metrics, noHorizontalOverflow: metrics.scrollWidth <= metrics.clientWidth });
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /I know a product or model/i }).click();
  await page.getByLabel('Product or model name').fill('AX-400');
  await page.getByRole('heading', { name: 'Pneumatic Brake' }).waitFor();
  report.interactions.modelSearch = await page.locator('.result-list').innerText();
  await page.getByRole('button', { name: 'View details' }).click();
  report.interactions.drawerTitle = await page.getByRole('dialog').getByRole('heading', { level: 2 }).innerText();
  await page.keyboard.press('Escape');
  report.interactions.drawerClosed = await page.getByRole('dialog').count() === 0;
  await page.goto(`${baseUrl}#/booking-placeholder`, { waitUntil: 'networkidle' });
  const placeholderText = await page.locator('body').innerText();
  report.interactions.bookingBoundary = {
    heading: await page.getByRole('heading').innerText(),
    noProductContext: !/P13|Pneumatic Brake|Tension \/ Braking|AX-400/.test(placeholderText),
    fieldCount: await page.locator('input, select, textarea').count(),
  };
  await page.close();
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'browser-qa-results.json'), JSON.stringify(report, null, 2));
  process.stdout.write(JSON.stringify(report, null, 2));
  if (report.consoleErrors.length || report.failedResponses.length || report.viewports.some((item) => !item.noHorizontalOverflow) || !report.interactions.drawerClosed || !report.interactions.bookingBoundary.noProductContext || report.interactions.bookingBoundary.fieldCount !== 0) process.exitCode = 1;
})().catch((error) => { console.error(error); process.exit(1); });
