import { expect, test } from '@playwright/test';

const ringDestinations = [
  'HOME',
  'WHY DTP',
  'PROGRAMMES',
  'SOLUTIONS',
  'PROCESS',
  'NEWS',
  'CASE STUDIES',
  'INSIGHTS',
  'AI READINESS',
  'AI FOUNDRY',
  'LEADERSHIP AI',
  'CONTACT',
];

test.describe('Current ecosystem homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#loader')).toBeHidden({ timeout: 15_000 });
  });

  test('renders the live gallery shell and all ecosystem destinations', async ({ page }) => {
    await expect(page).toHaveTitle('Digital Technology Partner - Ecosystem');
    await expect(page.getByRole('link', { name: 'Digital Technology Partner' })).toBeVisible();
    await expect(page.locator('#scene')).toBeVisible();

    const navigation = page.getByRole('navigation', { name: 'ecosystem navigation' });
    await expect(navigation).toBeVisible();
    for (const destination of ringDestinations) {
      await expect(navigation.getByRole('button', { name: destination, exact: true })).toBeVisible();
    }
  });

  test('opens and closes the ecosystem index with the complete destination list', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Open ecosystem index' });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const overlay = page.locator('#menuOverlay');
    await expect(overlay).toBeVisible();
    await expect(overlay.getByRole('button', { name: /^01\s*HOME/i })).toBeVisible();
    await expect(overlay.getByRole('button', { name: /^03\s*PROGRAMMES/i })).toBeVisible();
    await expect(overlay.getByRole('button', { name: /^010\s*AI FOUNDRY/i })).toBeVisible();
    await expect(overlay.getByRole('button', { name: /^012\s*CONTACT/i })).toBeVisible();
    await expect(overlay.locator('li')).toHaveCount(12);

    await overlay.getByRole('button', { name: /CLOSE/i }).click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(overlay).toBeHidden();
  });

  test('lets a visitor reach the current Programmes page from the index', async ({ page }) => {
    await page.getByRole('button', { name: 'Open ecosystem index' }).click();
    await page.locator('#menuOverlay').getByRole('button', { name: /^03\s*PROGRAMMES/i }).click();

    await expect(page).toHaveURL(/\/programmes\/$/, { timeout: 15_000 });
    await expect(page.getByRole('heading', {
      level: 1,
      name: 'For the organisation. For the team. For you.',
    })).toBeVisible();
  });

  test('keeps the homepage navigation usable with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await expect(page.locator('#loader')).toBeHidden({ timeout: 15_000 });

    const trigger = page.getByRole('button', { name: 'Open ecosystem index' });
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(page.locator('#menuOverlay')).toBeVisible();
    await expect(page.locator('#menuOverlay').getByRole('button', { name: /^01\s*HOME/i })).toBeVisible();
  });

  test('has no horizontal overflow at the mobile review width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.locator('#loader')).toBeHidden({ timeout: 15_000 });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.getByRole('button', { name: 'Open ecosystem index' })).toBeVisible();
  });
});
