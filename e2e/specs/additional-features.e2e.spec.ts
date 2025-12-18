import { test, expect } from '@playwright/test';

const upperCategories = [
  { name: 'Ones', info: 'Sum of all dice showing 1.' },
  { name: 'Twos', info: 'Sum of all dice showing 2.' },
  { name: 'Threes', info: 'Sum of all dice showing 3.' },
  { name: 'Fours', info: 'Sum of all dice showing 4.' },
  { name: 'Fives', info: 'Sum of all dice showing 5.' },
  { name: 'Sixes', info: 'Sum of all dice showing 6.' },
];

test.describe('Yatzy additional features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('start-btn').click();
  });

  test.describe('Upper category info modal', () => {
    for (const { name, info } of upperCategories) {
      test(`shows info modal for ${name} on click`, async ({ page }) => {
        const categoryCell = page.getByTestId(`category-info-${name}`);
        await categoryCell.click();
        // Modal should be visible
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await expect(page.locator('[role="dialog"]')).toContainText(name);
        await expect(page.locator('[role="dialog"]')).toContainText(info);
      });
    }
  });

  test('can change player color', async ({ page }) => {
    const playerColorHeader = page.getByTestId('player-color-Alice');

    // Get initial color attribute
    const initialColor = await playerColorHeader.evaluate((el) => window.getComputedStyle(el).color);

    // Click to change color
    await playerColorHeader.click();

    // Wait a bit for color to change
    await page.waitForTimeout(100);

    // Get new color
    const newColor = await playerColorHeader.evaluate((el) => window.getComputedStyle(el).color);

    // Color should have changed
    expect(newColor).not.toBe(initialColor);
  });

  test('theme preference persists after page reload', async ({ page }) => {
    // Get initial theme
    const themeToggle = page.getByTestId('theme-toggle-btn');
    let html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    // Toggle theme
    await themeToggle.click();
    const currentTheme = await html.getAttribute('data-theme');
    expect(currentTheme).not.toBe(initialTheme);

    // Reload page
    await page.reload();

    // Theme should persist
    html = page.locator('html');
    const persistedTheme = await html.getAttribute('data-theme');
    expect(persistedTheme).toBe(currentTheme);
  });

  test('game state persists in localStorage after reload', async ({ page }) => {
    // Fill in some scores
    await page.getByTestId('score-input-row-1-Alice').fill('5');
    await page.getByTestId('score-input-row-2-Alice').fill('10');

    // Reload page
    await page.reload();

    // Wait for page to load
    await page.waitForTimeout(500);

    // Game state should persist
    await expect(page.getByTestId('score-sheet')).toBeVisible();

    // Check if scores are still there
    const score1 = await page.getByTestId('score-input-row-1-Alice').inputValue();
    const score2 = await page.getByTestId('score-input-row-2-Alice').inputValue();

    expect(score1).toBe('5');
    expect(score2).toBe('10');
  });

  test('player color changes persist after page reload', async ({ page }) => {
    const playerColorHeader = page.getByTestId('player-color-Alice');

    // Get initial color
    const initialColor = await playerColorHeader.evaluate((el) => window.getComputedStyle(el).color);

    // Change color multiple times to ensure it's different
    for (let i = 0; i < 5; i++) {
      await playerColorHeader.click();
      await page.waitForTimeout(100);
      const newColor = await playerColorHeader.evaluate((el) => window.getComputedStyle(el).color);
      if (newColor !== initialColor) {
        break;
      }
    }

    const changedColor = await playerColorHeader.evaluate((el) => window.getComputedStyle(el).color);

    // Reload page
    await page.reload();
    await page.waitForTimeout(500);

    // Color should persist
    const persistedColor = await page
      .getByTestId('player-color-Alice')
      .evaluate((el) => window.getComputedStyle(el).color);

    expect(persistedColor).toBe(changedColor);
  });
});
