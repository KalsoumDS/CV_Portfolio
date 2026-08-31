const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Navigating to portfolio...');
  await page.goto('https://portfolio-oumou-kaltoum.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for intro animation to finish (~4-5s)
  console.log('Waiting for intro animation...');
  await page.waitForTimeout(6000);

  // Wait for hero content
  await page.waitForSelector('h1', { timeout: 10000 }).catch(() => console.log('h1 not found, continuing...'));
  await page.waitForTimeout(500);

  await page.screenshot({
    path: './assets/portfolio-preview.png',
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });

  console.log('Screenshot saved!');
  await browser.close();
})();
