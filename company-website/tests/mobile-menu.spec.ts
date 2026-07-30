import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

const programmeLinks = [
  { name: 'All Programmes', href: '/programmes/' },
  { name: 'AI Adoption Readiness', href: '/programmes/ai-adoption-readiness/' },
  { name: 'AI Foundry', href: '/programmes/ai-foundry/' },
  { name: 'Leadership AI Coaching', href: '/programmes/leadership-ai-coaching/' },
];

test.describe('Mobile menu information architecture', () => {
  test('opens a mobile Menu with an expandable Programmes section', async ({ page }, testInfo) => {
    await page.goto('/home/');

    const menuButton = page.getByRole('button', { name: 'Open menu' });
    await expect(menuButton).toContainText('MENU');

    const menuButtonBox = await menuButton.boundingBox();
    expect(menuButtonBox?.height).toBeGreaterThanOrEqual(44);
    expect(menuButtonBox?.width).toBeGreaterThanOrEqual(44);

    await menuButton.click();

    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('button', { name: 'Programmes' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await page.screenshot({ path: testInfo.outputPath('mobile-menu-open.png') });
  });

  test('reveals all programme child routes directly beneath Programmes', async ({ page }) => {
    await page.goto('/home/');
    await page.getByRole('button', { name: 'Open menu' }).click();

    const menu = page.getByRole('dialog', { name: 'Site menu' });
    const programmes = menu.getByRole('button', { name: 'Programmes' });
    await programmes.click();
    await expect(programmes).toHaveAttribute('aria-expanded', 'true');

    for (const route of programmeLinks) {
      const link = menu.getByRole('link', { name: route.name, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', route.href);
      const box = await link.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('auto-expands Programmes and marks the current child route', async ({ page }) => {
    await page.goto('/programmes/ai-foundry/');
    await page.getByRole('button', { name: 'Open menu' }).click();

    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu.getByRole('button', { name: 'Programmes' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(menu.getByRole('link', { name: 'AI Foundry', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('traps focus, closes with Escape and returns focus to the trigger', async ({ page }) => {
    await page.goto('/home/');
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await trigger.focus();
    await trigger.click();

    const menu = page.getByRole('dialog', { name: 'Site menu' });
    const close = menu.getByRole('button', { name: 'Close menu' });
    await expect(close).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(menu.getByRole('link', { name: /Return to Gallery Sphere/i })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.locator('#st-index')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await expect(trigger).toBeFocused();
  });

  test('keeps the logo and close control at least 44 by 44 pixels', async ({ page }) => {
    await page.goto('/home/');
    const logo = page.getByRole('link', {
      name: 'Digital Technology Partner — return to ecosystem',
    });
    const logoBox = await logo.boundingBox();
    expect(logoBox?.height).toBeGreaterThanOrEqual(44);
    expect(logoBox?.width).toBeGreaterThanOrEqual(44);

    await page.getByRole('button', { name: 'Open menu' }).click();
    const closeBox = await page
      .getByRole('dialog', { name: 'Site menu' })
      .getByRole('button', { name: 'Close menu' })
      .boundingBox();
    expect(closeBox?.height).toBeGreaterThanOrEqual(44);
    expect(closeBox?.width).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Programmes mobile first viewport', () => {
  for (const width of [320, 390, 412]) {
    test(`names and links all three programmes at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/programmes/');

      const routeNav = page.getByRole('navigation', { name: 'Programme routes' });
      await expect(routeNav).toBeVisible();
      for (const route of programmeLinks.slice(1)) {
        const link = routeNav.getByRole('link', { name: route.name, exact: true });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', route.href);
        const box = await link.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.y + box!.height).toBeLessThanOrEqual(844);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      if (width === 390) {
        await page.screenshot({ path: testInfo.outputPath('programmes-first-viewport.png') });
      }
    });
  }
});