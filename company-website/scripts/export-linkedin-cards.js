import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const base = process.env.BASE_URL || 'http://100.126.191.81:4321';
const outDir = '/Users/hudsonrebel/My Drive/Hudson Outputs/LinkedIn/2026-06-03-above-fold-left-cards';
const cards = [
  ['rapid-assessment', '/linkedin-card-rapid-assessment/'],
  ['ai-foundry', '/linkedin-card-ai-foundry/'],
  ['ai-bottleneck', '/linkedin-card-ai-bottleneck/'],
];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  for (const [name, route] of cards) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const metrics = await page.evaluate(() => {
      const card = document.querySelector('.card');
      const logo = document.querySelector('.logo');
      const kicker = document.querySelector('.kicker');
      const cta = document.querySelector('.cta');
      const body = document.body;
      const cardBox = card.getBoundingClientRect();
      const logoBox = logo.getBoundingClientRect();
      const ctaBox = cta.getBoundingClientRect();
      return {
        title: document.title,
        card: { width: cardBox.width, height: cardBox.height },
        body: { width: body.scrollWidth, height: body.scrollHeight },
        kicker: kicker.textContent.trim(),
        logo: { width: logoBox.width, height: logoBox.height, left: logoBox.left, top: logoBox.top },
        cta: { text: cta.textContent.trim(), left: ctaBox.left, top: ctaBox.top },
        links: [...document.querySelectorAll('a')].map(a => a.textContent.trim()),
      };
    });
    const out = path.join(outDir, `${name}.png`);
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    console.log(`${name}: ${out}`);
    console.log(JSON.stringify(metrics));
    await page.close();
  }
  await browser.close();
})();
