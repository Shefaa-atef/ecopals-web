const { chromium } = require('playwright');

async function capture(viewport, name) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const messages = [];
  page.on('console', (message) => {
    if (message.type() === 'error') messages.push(message.text());
  });
  page.on('pageerror', (error) => messages.push(error.message));

  await page.goto('http://127.0.0.1:5173/ecopals-web/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);

  const canvasStats = await page.evaluate(() => {
    const canvas = document.querySelector('.hero-phone-canvas canvas');
    if (!canvas) return { found: false };
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return { found: true, hasContext: false, width: canvas.width, height: canvas.height };
    const width = canvas.width;
    const height = canvas.height;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    let nonTransparent = 0;
    let bright = 0;
    for (let index = 3; index < pixels.length; index += 16) {
      if (pixels[index] > 5) nonTransparent += 1;
      if (pixels[index - 3] + pixels[index - 2] + pixels[index - 1] > 120) bright += 1;
    }
    return { found: true, hasContext: true, width, height, nonTransparent, bright };
  });

  await page.screenshot({ path: `output/playwright/${name}.png`, fullPage: false });
  await browser.close();

  if (messages.length) {
    throw new Error(messages.join('\n'));
  }

  console.log(name, JSON.stringify(canvasStats));
}

(async () => {
  await capture({ width: 1366, height: 768 }, 'ecopals-hero-desktop');
  await capture({ width: 390, height: 844 }, 'ecopals-hero-mobile');
})();
