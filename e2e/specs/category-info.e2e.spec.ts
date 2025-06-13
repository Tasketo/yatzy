import { test, expect } from '@playwright/test';

const lowerCategories = [
  { name: 'One Pair', info: 'Sum of the two highest matching dice.' },
  { name: 'Two Pairs', info: 'Sum of two different pairs (4 dice). Example: 2-2-5-5-6 scores 2+2+5+5=14.' },
  { name: 'Three of a Kind', info: 'Sum of three matching dice.' },
  { name: 'Four of a Kind', info: 'Sum of four matching dice.' },
  { name: 'Small Straight', info: 'For dices in a row (e.g. 1-2-3-4). Score 30 points.' },
  { name: 'Large Straight', info: 'For dices in a row (e.g. 1-2-3-4-5). Scores 40 points.' },
  { name: 'Full House', info: 'A pair and three of a kind (e.g., 2-2-3-3-3). Scores 25 points.' },
  { name: 'Chance', info: 'Sum of all dice (any combination).' },
  { name: 'Yatzy', info: 'All five dice the same. Scores 35 points.' },
];

test.describe('Yatzy category info alert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-input-1').fill('Alice');
    await page.getByTestId('start-btn').click();
  });

  for (const { name, info } of lowerCategories) {
    test(`shows info alert for ${name} on click`, async ({ page }) => {
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toBe(info);
        await dialog.dismiss();
      });
      await page.getByTestId(`category-info-${name}`).click();
    });
    test(`shows info alert for ${name} on Enter key`, async ({ page }) => {
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toBe(info);
        await dialog.dismiss();
      });
      await page.getByTestId(`category-info-${name}`).press('Enter');
    });
    test(`shows info alert for ${name} on Space key`, async ({ page }) => {
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toBe(info);
        await dialog.dismiss();
      });
      await page.getByTestId(`category-info-${name}`).press(' ');
    });
  }
});
