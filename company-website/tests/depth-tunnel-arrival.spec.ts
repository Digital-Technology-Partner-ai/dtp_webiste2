import { expect, test } from '@playwright/test';
import sharp from 'sharp';

async function centerPixelIsBlack(page: import('@playwright/test').Page) {
  const screenshot = await page.screenshot();
  const image = sharp(screenshot);
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const { data } = await image
    .extract({
      left: Math.floor(width / 2),
      top: Math.floor(height / 2),
      width: 1,
      height: 1,
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const [red, green, blue] = data;
  return red < 8 && green < 8 && blue < 8;
}

test('tunnel arrivals remain black-covered before the arrival script runs', async ({ page }) => {
  let releaseTunnelScript!: () => void;
  const tunnelScriptCanLoad = new Promise<void>((resolve) => {
    releaseTunnelScript = resolve;
  });

  await page.goto('/');
  await page.route('**/route-depth-tunnel.js**', async (route) => {
    await tunnelScriptCanLoad;
    await route.continue();
  });

  await page.evaluate(() => {
    window.sessionStorage.setItem('dtpDepthTunnelArrival', '1');
  });
  await page.goto('/home/?v=tunnel-arrival-prepaint', { waitUntil: 'commit' });
  await page.waitForTimeout(250);

  expect(await centerPixelIsBlack(page)).toBe(true);

  releaseTunnelScript();
});

test('tunnel arrivals reveal the destination once the transition completes', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.sessionStorage.setItem('dtpDepthTunnelArrival', '1');
  });

  await page.goto('/home/?v=tunnel-arrival-complete');
  await page.waitForTimeout(1000);

  await expect(page.locator('html')).not.toHaveClass(/dtp-depth-tunnel-preload/);
  await expect(page.locator('.dtp-depth-tunnel')).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('.dtp-depth-tunnel')).toHaveCSS('opacity', '0');
  await expect(page.getByRole('heading', { name: 'Buying AI is easy. Making it work is hard.' })).toBeVisible();
});
