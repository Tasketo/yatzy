import { test, expect } from '@playwright/test';

test.describe('Validation', () => {
  test('upper divisibility: shows error when not divisible and clears when fixed', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="player-input-1"]', 'Alice');
    await page.click('[data-testid="start-btn"]');

    // Twos is row 2
    const twosSelector = '[data-testid="score-input-row-2-Alice"]';
    await page.fill(twosSelector, '3');
    await expect(page.locator('text=Must be divisible by 2')).toBeVisible();
    await expect(page.locator('[data-testid="finish-round-btn"]')).toBeDisabled();

    // Fix to a divisible value
    await page.fill(twosSelector, '4');
    await expect(page.locator('text=Must be divisible by 2')).toHaveCount(0);
  });

  test('lower fixed-score categories: require exact value', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="player-input-1"]', 'Alice');
    await page.click('[data-testid="start-btn"]');

    // Small Straight is the 5th lower category -> data-testid row 11 for a single player
    const smallStraight = '[data-testid="score-input-row-11-Alice"]';
    await page.fill(smallStraight, '25');
    await expect(page.locator('text=Must be exactly 30')).toBeVisible();

    // Correct fixed value
    await page.fill(smallStraight, '30');
    await expect(page.locator('text=Must be exactly 30')).toHaveCount(0);
  });
});
