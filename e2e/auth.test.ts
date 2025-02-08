import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show validation errors on empty form submission', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('button[type="submit"]');
    
    const errorMessage = await page.getByText('Invalid credentials');
    await expect(errorMessage).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    const errorMessage = await page.getByText('Invalid credentials');
    await expect(errorMessage).toBeVisible();
  });
});