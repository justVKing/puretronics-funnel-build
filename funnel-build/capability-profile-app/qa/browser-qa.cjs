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
  await page.getByRole('tab', { name: /Comparison Workbench/i }).click();
  const productSelect = page.locator('.comparison-product-select select');
  await productSelect.selectOption('P08');
  const p08Table = page.locator('.comparison-table');
  report.interactions.p08Comparison = {
    selectedProduct: await productSelect.inputValue(),
    technicalParameters: await p08Table.locator('tbody').filter({ has: page.getByText('Approved Public Technical Specifications', { exact: true }) }).locator('tr:not(.comparison-section-row)').count(),
    includesPowerSupply: await p08Table.getByRole('row', { name: /Power Supply/ }).count() === 1,
    includesWeight: await p08Table.getByRole('row', { name: /Weight \(Kg\)/ }).count() === 1,
    containsNotPublished: /Not published/i.test(await p08Table.innerText()),
  };
  await page.screenshot({ path: path.join(screenshots, 'comparison-p08-final-1440.png'), fullPage: false });
  const screenshotStyle = await page.addStyleTag({ content: '.site-header{position:static!important}.skip-link{display:none!important}' });
  await page.locator('.comparison-output').screenshot({ path: path.join(screenshots, 'comparison-p08-specifications-final-1440.png') });
  await screenshotStyle.evaluate((element) => element.remove());
  await productSelect.selectOption('P12');
  await page.getByRole('radio', { name: 'Capacity SKUs' }).check();
  const p12Table = page.locator('.comparison-table');
  report.interactions.p12CapacityComparison = {
    capacitySkuChoices: await page.locator('.model-choice-grid input[type="checkbox"]').count(),
    technicalParameters: await p12Table.locator('tbody').filter({ has: page.getByText('Approved Public Technical Specifications', { exact: true }) }).locator('tr:not(.comparison-section-row)').count(),
    includesCapacity: await p12Table.getByRole('row', { name: /^Capacity / }).count() === 1,
    containsNotPublished: /Not published/i.test(await p12Table.innerText()),
  };
  await page.getByRole('tab', { name: /Capability Matrix/i }).click();
  report.interactions.capabilityMatrix = {
    familyFilterLabel: await page.locator('.coverage-toolbar select').nth(0).locator('option:checked').innerText(),
    exposedInternalSlug: /joining-repair/.test(await page.locator('.coverage-table').innerText()),
  };
  await page.locator('.matrix-view').screenshot({ path: path.join(screenshots, 'capability-matrix-final-1440.png') });
  await page.goto(`${baseUrl}#/booking-placeholder`, { waitUntil: 'networkidle' });
  const placeholderText = await page.locator('body').innerText();
  report.interactions.bookingBoundary = {
    heading: await page.getByRole('heading').innerText(),
    noProductContext: !/P13|Pneumatic Brake|Tension \/ Braking|AX-400/.test(placeholderText),
    fieldCount: await page.locator('input, select, textarea').count(),
  };
  await page.close();

  const mobileComparisonPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobileComparisonPage.goto(baseUrl, { waitUntil: 'networkidle' });
  await mobileComparisonPage.getByRole('tab', { name: /Comparison Workbench/i }).click();
  await mobileComparisonPage.locator('.comparison-product-select select').selectOption('P08');
  const mobileComparison = mobileComparisonPage.locator('.comparison-view');
  report.interactions.mobileP08Comparison = {
    technicalParameterGroups: await mobileComparisonPage.locator('.comparison-mobile-table article').count(),
    pageScrollWidth: await mobileComparisonPage.evaluate(() => document.documentElement.scrollWidth),
    pageClientWidth: await mobileComparisonPage.evaluate(() => document.documentElement.clientWidth),
  };
  const mobileScreenshotStyle = await mobileComparisonPage.addStyleTag({ content: '.site-header,.mobile-booking-bar,.skip-link{display:none!important}' });
  await mobileComparison.screenshot({ path: path.join(screenshots, 'comparison-p08-final-390.png') });
  await mobileScreenshotStyle.evaluate((element) => element.remove());
  await mobileComparisonPage.close();
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'browser-qa-results.json'), JSON.stringify(report, null, 2));
  process.stdout.write(JSON.stringify(report, null, 2));
  if (report.consoleErrors.length || report.failedResponses.length || report.viewports.some((item) => !item.noHorizontalOverflow) || !report.interactions.drawerClosed || report.interactions.p08Comparison.technicalParameters !== 11 || report.interactions.p08Comparison.containsNotPublished || report.interactions.p12CapacityComparison.capacitySkuChoices !== 24 || report.interactions.p12CapacityComparison.technicalParameters !== 9 || report.interactions.p12CapacityComparison.containsNotPublished || report.interactions.capabilityMatrix.familyFilterLabel !== 'All Five Product Families' || report.interactions.capabilityMatrix.exposedInternalSlug || !report.interactions.bookingBoundary.noProductContext || report.interactions.bookingBoundary.fieldCount !== 0 || report.interactions.mobileP08Comparison.technicalParameterGroups !== 13 || report.interactions.mobileP08Comparison.pageScrollWidth > report.interactions.mobileP08Comparison.pageClientWidth) process.exitCode = 1;
})().catch((error) => { console.error(error); process.exit(1); });
