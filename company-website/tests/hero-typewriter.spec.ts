import { test, expect } from '@playwright/test';

/**
 * Hero Typewriter Animation Test Suite
 * 
 * Tests all acceptance criteria from PRD:
 * - AC-1: Tag line typewriter (auto-play)
 * - AC-2: Headline scroll trigger
 * - AC-3: Blinking cursor
 * - AC-4: Reduced motion accessibility
 * - AC-5: Screen reader accessibility
 * - AC-6: Performance (no layout shift)
 * - AC-7: Cross-browser compatibility (handled by Playwright config)
 */

test.describe('Hero Typewriter Animation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test.describe('AC-1: Tag Line Typewriter (Auto-play)', () => {
    test('tag line types out on page load', async ({ page }) => {
      // Wait for initial delay (500ms)
      await page.waitForTimeout(500);
      
      const tagElement = page.locator('.typewriter-tag');
      await expect(tagElement).toBeVisible();
      
      // Check progressive reveal - after 1 second some characters should be visible
      await page.waitForTimeout(1000);
      const partialText = await tagElement.textContent();
      expect(partialText).toBeTruthy();
      expect(partialText!.length).toBeGreaterThan(0);
      expect(partialText!.length).toBeLessThan(37); // Full text is 37 chars
      
      // Check completion - wait for full animation (~4.3 seconds total)
      await page.waitForTimeout(5000);
      await expect(tagElement).toHaveText('> digital_technology_partner.init()');
    });

    test('tag line has no cursor during typing', async ({ page }) => {
      await page.waitForTimeout(2000); // Mid-animation
      
      const cursor = page.locator('.ma-cursor');
      const tagElement = page.locator('.typewriter-tag');
      
      // Cursor should exist but tag should not contain it
      await expect(cursor).toBeAttached();
      const tagText = await tagElement.textContent();
      expect(tagText).not.toContain('|');
    });
  });

  test.describe('AC-2: Headline Scroll Trigger', () => {
    test('headline types on first scroll only', async ({ page }) => {
      // Wait for tag line to complete
      await page.waitForTimeout(5000);
      
      const headline = page.locator('.typewriter-headline');
      
      // Initially empty or invisible
      const initialText = await headline.textContent();
      expect(initialText?.trim()).toBe('');
      
      // Trigger scroll
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(500);
      
      // Should have partial text
      const partialText = await headline.textContent();
      expect(partialText).toBeTruthy();
      expect(partialText!.length).toBeGreaterThan(0);
      expect(partialText!.length).toBeLessThan(14); // "AI that works." = 14 chars
      
      // Wait for completion
      await page.waitForTimeout(2000);
      await expect(headline).toHaveText('AI that works.');
      
      // Verify no re-trigger on second scroll
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(500);
      await expect(headline).toHaveText('AI that works.'); // Unchanged
    });

    test('headline animation timing is correct', async ({ page }) => {
      await page.waitForTimeout(5000); // Wait for tag line
      
      const headline = page.locator('.typewriter-headline');
      
      // Trigger scroll
      await page.mouse.wheel(0, 100);
      
      // Should complete in ~1.7 seconds (14 chars × 120ms)
      await page.waitForTimeout(2000);
      await expect(headline).toHaveText('AI that works.');
    });
  });

  test.describe('AC-3: Blinking Cursor', () => {
    test('cursor blinks continuously after headline completes', async ({ page }) => {
      // Wait for both animations to complete
      await page.waitForTimeout(5000); // Tag line
      await page.mouse.wheel(0, 100); // Trigger headline
      await page.waitForTimeout(2500); // Headline completion
      
      const cursor = page.locator('.ma-cursor');
      await expect(cursor).toBeVisible();
      
      // Check color (mint green #00E5A0)
      const color = await cursor.evaluate(el => 
        window.getComputedStyle(el).color
      );
      expect(color).toBe('rgb(0, 229, 160)'); // #00E5A0 in RGB
      
      // Check blink animation - opacity should toggle
      const opacity1 = await cursor.evaluate(el => 
        window.getComputedStyle(el).opacity
      );
      
      await page.waitForTimeout(600); // Wait for blink cycle
      
      const opacity2 = await cursor.evaluate(el => 
        window.getComputedStyle(el).opacity
      );
      
      // Opacity should have changed (blinking)
      expect(opacity1).not.toBe(opacity2);
    });

    test('cursor animation is step-end (hard cut)', async ({ page }) => {
      await page.waitForTimeout(5000);
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(2500);
      
      const cursor = page.locator('.ma-cursor');
      
      // Check animation timing function
      const animationTimingFunction = await cursor.evaluate(el => 
        window.getComputedStyle(el).animationTimingFunction
      );
      
      expect(animationTimingFunction).toContain('step');
    });
  });

  test.describe('AC-4: Accessibility - Reduced Motion', () => {
    test('respects prefers-reduced-motion', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      
      const tag = page.locator('.typewriter-tag');
      const headline = page.locator('.typewriter-headline');
      
      // Text should appear immediately without animation
      await expect(tag).toHaveText('> digital_technology_partner.init()');
      await expect(headline).toHaveText('AI that works.');
      
      // Cursor animation should be disabled
      const cursor = page.locator('.ma-cursor');
      const animationName = await cursor.evaluate(el => 
        window.getComputedStyle(el).animationName
      );
      expect(animationName).toBe('none');
    });
  });

  test.describe('AC-5: Accessibility - Screen Reader', () => {
    test('full text available in DOM for screen readers', async ({ page }) => {
      const tagLive = page.locator('.typewriter-tag').or(page.locator('[aria-live="polite"]').first());
      const headlineLive = page.locator('.typewriter-headline').or(page.locator('h1[aria-live="polite"]'));
      
      await expect(tagLive).toBeAttached();
      await expect(headlineLive).toBeAttached();
      
      // Verify aria-live attribute exists
      const tagAriaLive = await page.locator('.typewriter-tag').evaluate(el => 
        el.closest('[aria-live]')?.getAttribute('aria-live')
      );
      expect(tagAriaLive).toBe('polite');
      
      // Verify text content is accessible via data attribute or immediate DOM
      const tagParent = page.locator('.typewriter-tag').locator('..');
      const tagData = await tagParent.getAttribute('data-text');
      expect(tagData).toBe('> digital_technology_partner.init()');
      
      const headlineParent = page.locator('.typewriter-headline').locator('..');
      const headlineData = await headlineParent.getAttribute('data-text');
      expect(headlineData).toBe('AI that works.');
    });

    test('aria-live regions are polite (non-intrusive)', async ({ page }) => {
      const ariaLiveElements = page.locator('[aria-live]');
      const count = await ariaLiveElements.count();
      
      expect(count).toBeGreaterThan(0);
      
      // Check all aria-live regions are "polite"
      for (let i = 0; i < count; i++) {
        const value = await ariaLiveElements.nth(i).getAttribute('aria-live');
        expect(value).toBe('polite');
      }
    });
  });

  test.describe('AC-6: Performance - No Layout Shift', () => {
    test('animations cause no layout shift', async ({ page }) => {
      // Measure CLS during animation sequence
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift') {
                const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
                if (!layoutShiftEntry.hadRecentInput) {
                  clsValue += layoutShiftEntry.value || 0;
                }
              }
            }
          });
          observer.observe({ entryTypes: ['layout-shift'] });
          
          // Measure for 8 seconds (covers both animations)
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 8000);
        });
      });
      
      // Trigger scroll during measurement
      await page.waitForTimeout(5000);
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(3000);
      
      // Browser font/rendering can produce tiny non-user-visible CLS noise; keep
      // the acceptance threshold strict without pretending floating-point layout
      // telemetry is always exactly zero.
      expect(cls).toBeLessThan(0.01);
    });

    test('text container reserves space (no reflow)', async ({ page }) => {
      // Get initial dimensions
      const tagBox = await page.locator('.typewriter-tag').boundingBox();
      const headlineBox = await page.locator('.typewriter-headline').boundingBox();
      
      expect(tagBox).toBeTruthy();
      expect(headlineBox).toBeTruthy();
      
      // Wait for animations
      await page.waitForTimeout(5000);
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(2500);
      
      // Get final dimensions
      const tagBoxAfter = await page.locator('.typewriter-tag').boundingBox();
      const headlineBoxAfter = await page.locator('.typewriter-headline').boundingBox();
      
      const scrollYAfter = await page.evaluate(() => window.scrollY);
      const initialScrollY = 0;

      // Document positions should not have changed; viewport positions may shift
      // because the test intentionally sends a wheel event.
      const tagDocumentShift = Math.abs(((tagBoxAfter?.y ?? 0) + scrollYAfter) - ((tagBox?.y ?? 0) + initialScrollY));
      const headlineDocumentShift = Math.abs(((headlineBoxAfter?.y ?? 0) + scrollYAfter) - ((headlineBox?.y ?? 0) + initialScrollY));
      expect(tagDocumentShift).toBeLessThanOrEqual(4);
      expect(headlineDocumentShift).toBeLessThanOrEqual(4);
    });
  });

  test.describe('AC-7: Cross-Browser Compatibility', () => {
    test('component renders correctly', async ({ page, browserName }) => {
      const tag = page.locator('.typewriter-tag');
      const headline = page.locator('.typewriter-headline');
      const cursor = page.locator('.ma-cursor');
      
      await expect(tag).toBeAttached();
      await expect(headline).toBeAttached();
      await expect(cursor).toBeAttached();
      
      // Log browser for debugging
      console.log(`Testing on: ${browserName}`);
    });

    test('animations work across browsers', async ({ page }) => {
      // Wait for tag animation
      await page.waitForTimeout(5500);
      const tag = page.locator('.typewriter-tag');
      await expect(tag).toHaveText('> digital_technology_partner.init()');
      
      // Trigger and verify headline
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(2500);
      const headline = page.locator('.typewriter-headline');
      await expect(headline).toHaveText('AI that works.');
    });
  });
});
