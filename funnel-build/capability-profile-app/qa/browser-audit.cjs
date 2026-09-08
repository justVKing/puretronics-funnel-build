const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const baseUrl = process.argv[2] || 'http://127.0.0.1:4174/puretronics-funnel-build/';
const outputDir = path.resolve(__dirname, 'screenshots');
fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const installedChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ headless: true, executablePath: installedChrome });
  const report = { baseUrl, viewports: {}, assertions: {}, consoleErrors: [], failedResponses: [] };
  for (const width of [390, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
    page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push({ width, text: message.text() }); });
    page.on('response', (response) => { if (response.status() >= 400) report.failedResponses.push({ width, status: response.status(), url: response.url() }); });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    report.viewports[width] = { ...dimensions, overflow: dimensions.scrollWidth > dimensions.clientWidth };
    await page.screenshot({ path: path.join(outputDir, `final-capability-profile-${width}.png`), fullPage: true });
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /Capability Matrix/ }).click();
  report.assertions.matrixDefault = await page.locator('.coverage-metrics').innerText();
  report.assertions.matrixAllFamiliesLabel = await page.getByLabel('Product Family').locator('option:checked').innerText();
  await page.screenshot({ path: path.join(outputDir, 'final-capability-matrix-1440.png'), fullPage: false });

  await page.getByRole('tab', { name: /Solution Navigator/ }).click();
  await page.getByRole('button', { name: /I Have a Production or Quality Problem/ }).click();
  await page.getByRole('button', { name: /Diameter Variation or Inadequate Measurement Visibility/ }).click();
  await page.getByRole('tab', { name: /Capability Matrix/ }).click();
  report.assertions.sharedConstraintVisible = await page.getByLabel('Constraints Shared Across Explorer Views').getByText(/Diameter Variation/).isVisible();
  await page.getByRole('button', { name: 'Clear Explorer Constraints' }).click();

  await page.getByRole('tab', { name: /Production-Line Map/ }).click();
  report.assertions.desktopMapDescription = await page.locator('#line-desc').textContent();
  await page.screenshot({ path: path.join(outputDir, 'final-production-line-map-1440.png'), fullPage: false });
  await page.locator('.line-map-desktop').screenshot({ path: path.join(outputDir, 'final-production-line-diagram-1440.png') });
  await page.locator('g[aria-label^="Preheating and Other Pre-Extrusion Preparation"]').click();
  await page.getByRole('button', { name: 'Add Stage to Application Review' }).click();
  report.assertions.stageCarriedToReview = await page.getByText(/Stage: Preheating and Other Pre-Extrusion Preparation/).isVisible();

  await page.getByRole('tab', { name: /Comparison Workbench/ }).click();
  await page.locator('.comparison-setup select').selectOption('P08');
  report.assertions.p08ComparisonContext = await page.locator('.comparison-output-header').innerText();
  report.assertions.notPublishedCount = await page.getByText('Not Published', { exact: true }).count();

  await page.goto(`${baseUrl}#/booking-placeholder`, { waitUntil: 'networkidle' });
  report.assertions.bookingHeading = await page.getByRole('heading', { name: 'Booking System Page — Review Placeholder' }).innerText();
  report.assertions.bookingHasRetainedProducts = await page.evaluate(() => (document.body.innerText.match(/\bP(?:0[1-9]|1[0-3])\b/g) || []).length);
  await page.close();

  const mobileMapPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobileMapPage.goto(baseUrl, { waitUntil: 'networkidle' });
  await mobileMapPage.getByRole('tab', { name: /Production-Line Map/ }).click();
  await mobileMapPage.locator('.line-map-mobile').screenshot({ path: path.join(outputDir, 'final-production-line-map-390.png') });
  await mobileMapPage.close();
  await browser.close();
  fs.writeFileSync(path.join(outputDir, 'final-browser-audit.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => { console.error(error); process.exit(1); });
