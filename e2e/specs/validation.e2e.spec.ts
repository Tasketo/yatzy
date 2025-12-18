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

  test('upper categories: enforces maximum based on 5 dice', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="player-input-1"]', 'Alice');
    await page.click('[data-testid="start-btn"]');

    // Ones (row 1): max is 5 (5 dice × 1)
    const onesSelector = '[data-testid="score-input-row-1-Alice"]';
    await page.fill(onesSelector, '10');
    await expect(page.locator('text=Maximum is 5')).toBeVisible();
    await page.fill(onesSelector, '5');
    await expect(page.locator('text=Maximum is 5')).toHaveCount(0);

    // Sixes (row 6): max is 30 (5 dice × 6)
    const sixesSelector = '[data-testid="score-input-row-6-Alice"]';
    await page.fill(sixesSelector, '36');
    await expect(page.locator('text=Maximum is 30')).toBeVisible();
    await page.fill(sixesSelector, '30');
    await expect(page.locator('text=Maximum is 30')).toHaveCount(0);
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

  test('accepts 0 for upper categories when player did not score', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="player-input-1"]', 'Alice');
    await page.click('[data-testid="start-btn"]');

    // Fill all upper categories with 0 (Ones through Sixes, rows 1-6)
    for (let i = 1; i <= 6; i++) {
      await page.fill(`[data-testid="score-input-row-${i}-Alice"]`, '0');
    }
    // Fill all lower categories with valid values
    const lowerValues = ['2', '4', '6', '8', '30', '40', '25', '10', '50'];
    for (let i = 7; i <= 15; i++) {
      await page.fill(`[data-testid="score-input-row-${i}-Alice"]`, lowerValues[i - 7]);
    }
    // Finish button should be enabled (no errors)
    await expect(page.locator('[data-testid="finish-round-btn"]')).toBeEnabled();
  });

  test('accepts 0 for non-fixed lower categories when player did not score', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="player-input-1"]', 'Alice');
    await page.click('[data-testid="start-btn"]');

    // Fill all upper categories with valid values
    const upperValues = ['1', '2', '3', '4', '5', '6'];
    for (let i = 1; i <= 6; i++) {
      await page.fill(`[data-testid="score-input-row-${i}-Alice"]`, upperValues[i - 1]);
    }
    // Fill non-fixed lower categories with 0 (One Pair row 7, Two Pairs row 8, Three of a Kind row 9, Four of a Kind row 10, Chance row 14)
    await page.fill('[data-testid="score-input-row-7-Alice"]', '0'); // One Pair
    await page.fill('[data-testid="score-input-row-8-Alice"]', '0'); // Two Pairs
    await page.fill('[data-testid="score-input-row-9-Alice"]', '0'); // Three of a Kind
    await page.fill('[data-testid="score-input-row-10-Alice"]', '0'); // Four of a Kind
    await page.fill('[data-testid="score-input-row-14-Alice"]', '0'); // Chance
    // Fill fixed categories with exact values
    await page.fill('[data-testid="score-input-row-11-Alice"]', '0'); // Small Straight
    await page.fill('[data-testid="score-input-row-12-Alice"]', '0'); // Large Straight
    await page.fill('[data-testid="score-input-row-13-Alice"]', '0'); // Full House
    await page.fill('[data-testid="score-input-row-15-Alice"]', '0'); // Yatzy
    // Finish button should be enabled (no errors)
    await expect(page.locator('[data-testid="finish-round-btn"]')).toBeEnabled();
  });

  test('lower non-fixed categories: enforces maximum values', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-testid="player-input-1"]', 'Alice');
    await page.click('[data-testid="start-btn"]');

    // One Pair (row 7): max is 12
    const onePairSelector = '[data-testid="score-input-row-7-Alice"]';
    await page.fill(onePairSelector, '13');
    await expect(page.locator('text=Maximum is 12')).toBeVisible();
    await page.fill(onePairSelector, '12');
    await expect(page.locator('text=Maximum is 12')).toHaveCount(0);

    // Two Pairs (row 8): max is 22
    const twoPairsSelector = '[data-testid="score-input-row-8-Alice"]';
    await page.fill(twoPairsSelector, '23');
    await expect(page.locator('text=Maximum is 22')).toBeVisible();
    await page.fill(twoPairsSelector, '22');
    await expect(page.locator('text=Maximum is 22')).toHaveCount(0);

    // Three of a Kind (row 9): max is 18
    const threeOfAKindSelector = '[data-testid="score-input-row-9-Alice"]';
    await page.fill(threeOfAKindSelector, '19');
    await expect(page.locator('text=Maximum is 18')).toBeVisible();
    await page.fill(threeOfAKindSelector, '18');
    await expect(page.locator('text=Maximum is 18')).toHaveCount(0);

    // Four of a Kind (row 10): max is 24
    const fourOfAKindSelector = '[data-testid="score-input-row-10-Alice"]';
    await page.fill(fourOfAKindSelector, '25');
    await expect(page.locator('text=Maximum is 24')).toBeVisible();
    await page.fill(fourOfAKindSelector, '24');
    await expect(page.locator('text=Maximum is 24')).toHaveCount(0);

    // Chance (row 14): max is 30
    const chanceSelector = '[data-testid="score-input-row-14-Alice"]';
    await page.fill(chanceSelector, '31');
    await expect(page.locator('text=Maximum is 30')).toBeVisible();
    await page.fill(chanceSelector, '30');
    await expect(page.locator('text=Maximum is 30')).toHaveCount(0);
  });
});
