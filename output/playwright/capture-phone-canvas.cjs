const { chromium } = require('playwright');

async function captureCanvas(viewport, name) {
  const browser = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--enable-webgl'] });
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:5173/ecopals-web/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.locator('.hero-phone-canvas').screenshot({ path: `output/playwright/${name}.png` });
  await browser.close();
}

(async () => {
  await captureCanvas({ width: 1366, height: 768 }, 'ecopals-phone-canvas-desktop');
  await captureCanvas({ width: 390, height: 844 }, 'ecopals-phone-canvas-mobile');
})();
