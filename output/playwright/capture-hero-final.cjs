const { chromium } = require('playwright');

async function capture(viewport, name) {
  const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl'] });
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const messages = [];
  page.on('console', (message) => {
    if (message.type() === 'error') messages.push(message.text());
  });
  page.on('pageerror', (error) => messages.push(error.message));
  await page.goto('http://127.0.0.1:5173/ecopals-web/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `output/playwright/${name}.png`, fullPage: false });
  await browser.close();
  if (messages.length) throw new Error(messages.join('\n'));
}

(async () => {
  await capture({ width: 1366, height: 768 }, 'ecopals-hero-final-desktop');
  await capture({ width: 390, height: 844 }, 'ecopals-hero-final-mobile');
})();
