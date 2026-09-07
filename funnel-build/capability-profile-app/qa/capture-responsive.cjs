const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');

const baseUrl = process.env.PURETRONICS_QA_URL || 'http://127.0.0.1:4173/puretronics-funnel-build/';
const outputDirectory = path.join(__dirname, 'screenshots');
const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
];

(async () => {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PURETRONICS_QA_BROWSER || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const audits = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole('tab', { name: '02 Production-Line Map' }).click();
    const layout = await page.evaluate(() => {
      const mobileMap = document.querySelector('.line-map-mobile');
      const desktopMap = document.querySelector('.line-map-desktop');
      return {
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        mobileMapVisible: mobileMap ? getComputedStyle(mobileMap).display !== 'none' : false,
        desktopMapVisible: desktopMap ? getComputedStyle(desktopMap).display !== 'none' : false,
        writeInControls: document.querySelectorAll('.mcq-builder input, .mcq-builder textarea, .mcq-builder [contenteditable="true"]').length,
      };
    });
    await page.screenshot({
      path: path.join(outputDirectory, `capability-profile-${viewport.width}.png`),
      fullPage: true,
    });
    audits.push({ width: viewport.width, ...layout, errors });
    await context.close();
  }

  await browser.close();
  process.stdout.write(`${JSON.stringify(audits, null, 2)}\n`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
