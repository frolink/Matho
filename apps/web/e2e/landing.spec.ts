import { test, expect } from '@playwright/test';

test('landing page renders MATHO branding', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('MATHO')).toBeVisible();
  await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
});
