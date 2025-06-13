import { test, expect } from '@playwright/test';

test.describe('Yatzy App E2E', () => {
  test('shows eyecatcher and player form on load', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.yatzy-eyecatcher')).toBeVisible();
    await expect(page.getByTestId('theme-toggle-btn')).toBeVisible();
    await expect(page.getByTestId('player-form')).toBeVisible();
  });

  test('toggles between light and dark mode', async ({ page }) => {
    await page.goto('/');
    const btn = page.getByTestId('theme-toggle-btn');
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');
    await btn.click();
    const toggledTheme = await html.getAttribute('data-theme');
    expect(toggledTheme).not.toBe(initialTheme);
  });

  test('does not allow starting game with empty player names', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('add-player-btn').click();
    await page.getByTestId('start-btn').click();
    await expect(page.getByTestId('player-form-error')).toHaveText('Please enter at least one player');
  });

  test('does not allow duplicate player names', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('add-player-btn').click();
    await page.getByTestId('player-input-2').fill('Alice');
    await page.getByTestId('start-btn').click();
    await expect(page.getByTestId('player-form-error')).toHaveText('Duplicate player names are not allowed.');
  });

  test('add players and show ScoreSheet', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('add-player-btn').click();
    await page.getByTestId('player-input-2').fill('Bob');
    await page.getByTestId('start-btn').click();
    await expect(page.getByTestId('score-sheet')).toBeVisible();
    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('Bob')).toBeVisible();
  });

  test('enter points and check sums/bonus', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('start-btn').click();
    // Fill upper section to get bonus
    for (let i = 0; i < 6; i++) {
      const input = page.getByTestId(`score-input-row-${i + 1}-Alice`);
      await input.clear();
      await input.fill('12');
    }
    await expect(page.getByTestId('bonus-checkbox-Alice')).toBeChecked();
    await expect(page.getByTestId('sum-cell-Alice')).toContainText('72');
  });

  test('bonus checkbox stays off if sum <= 62', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('start-btn').click();
    for (let i = 0; i < 6; i++) {
      const input = page.getByTestId(`score-input-row-${i + 1}-Alice`);
      await input.clear();
      await input.fill('5');
    }
    await expect(page.getByTestId('bonus-checkbox-Alice')).not.toBeChecked();
    await expect(page.getByTestId('sum-cell-Alice')).toContainText('30');
  });

  test('handles negative and large score input', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('start-btn').click();
    const input = page.getByTestId('score-input-row-1-Alice');
    await input.clear();
    await input.fill('-5');
    await expect(input).toHaveValue('-5');
    await input.clear();
    await input.fill('9999');
    await expect(input).toHaveValue('9999');
  });

  test('can play multiple rounds and see scoreboard', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('add-player-btn').click();
    await page.getByTestId('player-input-2').fill('Bob');
    await page.getByTestId('start-btn').click();
    // Fill round 1
    for (let i = 0; i < 15; i++) {
      await page.getByTestId(`score-input-row-${i + 1}-Alice`).fill('1');
      await page.getByTestId(`score-input-row-${i + 1}-Bob`).fill('2');
    }
    await page.getByTestId('finish-round-btn').click();
    await expect(page.getByTestId('scoreboard')).toBeVisible();
    await expect(page.getByTestId('overall-winner')).toContainText('Bob');
    await page.getByTestId('play-new-round-btn').click();

    // Fill round 2
    for (let i = 0; i < 15; i++) {
      await page.getByTestId(`score-input-row-${i + 1}-Alice`).fill('3');
      await page.getByTestId(`score-input-row-${i + 1}-Bob`).fill('4');
    }
    await page.getByTestId('finish-round-btn').click();
    await expect(page.getByTestId('scoreboard')).toBeVisible();
    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByTestId('overall-winner')).toContainText('Bob');
  });

  test('shows tie if each player wins one round', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('add-player-btn').click();
    await page.getByTestId('player-input-2').fill('Bob');
    await page.getByTestId('start-btn').click();
    // Round 1: Alice wins
    for (let i = 0; i < 15; i++) {
      await page.getByTestId(`score-input-row-${i + 1}-Alice`).fill('5');
      await page.getByTestId(`score-input-row-${i + 1}-Bob`).fill('1');
    }
    await page.getByTestId('finish-round-btn').click();
    await expect(page.getByTestId('scoreboard')).toBeVisible();
    await expect(page.getByTestId('overall-winner')).toContainText('Alice');
    await page.getByTestId('play-new-round-btn').click();
    await expect(page.getByTestId('score-sheet')).toBeVisible();
    // Round 2: Bob wins
    for (let i = 0; i < 15; i++) {
      await page.getByTestId(`score-input-row-${i + 1}-Alice`).fill('1');
      await page.getByTestId(`score-input-row-${i + 1}-Bob`).fill('5');
    }
    await page.getByTestId('finish-round-btn').click();
    await expect(page.getByTestId('scoreboard')).toBeVisible();
    // Both should be shown as winners (tie)
    await expect(page.getByTestId('overall-winner')).toContainText('Winners: Alice, Bob');
  });

  test('Game state persists in localStorage after reload', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('start-btn').click();
    await page.getByTestId('score-input-row-1-Alice').clear();
    await page.getByTestId('score-input-row-1-Alice').fill('5');
    await page.reload();
    await expect(page.getByTestId('score-input-row-1-Alice')).toHaveValue('5');
  });

  test('Reset button clears state and localStorage', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('start-btn').click();
    await page.getByTestId('reset-btn').click();
    await expect(page.getByTestId('player-form')).toBeVisible();
    // Should clear localStorage
    const state = await page.evaluate(() => localStorage.getItem('yatzy-state'));
    expect(state).toBeNull();
  });

  test('handles reset game from score form', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('start-btn').click();
    await page.getByTestId('score-input-row-1-Alice').fill('5');
    await page.reload();

    await page.getByTestId('reset-btn').click();
    await expect(page.getByTestId('player-form')).toBeVisible();
  });

  test('handles reset game from score board', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('start-btn').click();

    for (let i = 0; i < 15; i++) {
      await page.getByTestId(`score-input-row-${i + 1}-Alice`).fill('3');
    }
    await page.getByTestId('finish-round-btn').click();

    await page.getByTestId('reset-btn-scoreboard').click();
    await expect(page.getByTestId('player-form')).toBeVisible();
  });
});
