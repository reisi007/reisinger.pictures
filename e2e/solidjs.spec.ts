import {expect, test} from '@playwright/test';

test('SolidJS integration is working', async ({page}) => {
  await page.goto('/shootings');

  // Expects the page to contain Restplätze verfügbar
  await expect(page.getByText('Restplätze verfügbar')).toHaveText('Restplätze verfügbar');
});
