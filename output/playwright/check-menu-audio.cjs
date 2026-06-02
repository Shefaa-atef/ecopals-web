const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 520, height: 720 }, deviceScaleFactor: 1 });
  const messages = [];
  page.on('console', (message) => {
    if (message.type() === 'error') messages.push(message.text());
  });
  page.on('pageerror', (error) => messages.push(error.message));

  await page.goto('http://127.0.0.1:5173/ecopals-web/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /open menu/i }).click({ force: true });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'output/playwright/menu-icon-only.png', fullPage: false });
  await browser.close();

  if (messages.length) {
    console.error(messages.join('\n'));
    process.exit(1);
  }
})();
