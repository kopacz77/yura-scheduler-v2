import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Yura Min/); // Adjust based on your title
  });

  test('should show login page for protected routes', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/.*login/); // Should redirect to login
  });
});