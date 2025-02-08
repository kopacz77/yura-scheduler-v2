import { test, expect } from '@playwright/test';

test.describe('User Role Access', () => {
  test('admin should see admin dashboard', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');

    // Verify admin sees their dashboard
    await expect(page).toHaveURL('/admin/dashboard');
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
    
    // Check admin-only features
    await expect(page.getByText('Create Time Slot')).toBeVisible();
    await expect(page.getByText('Student Management')).toBeVisible();
  });

  test('student should not access admin areas', async ({ page }) => {
    // Login as student
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'student@example.com');
    await page.fill('input[name="password"]', 'studentpass');
    await page.click('button[type="submit"]');

    // Verify student sees their dashboard
    await expect(page).toHaveURL('/student/dashboard');
    
    // Try to access admin area - should redirect
    await page.goto('/admin/dashboard');
    await expect(page).not.toHaveURL('/admin/dashboard');
    
    // Verify student-specific features
    await expect(page.getByText('Book Lesson')).toBeVisible();
    await expect(page.getByText('My Schedule')).toBeVisible();
  });

  test('switching between student and admin views', async ({ browser }) => {
    // Create two separate contexts (like having two browser windows)
    const adminContext = await browser.newContext();
    const studentContext = await browser.newContext();

    // Admin login in one context
    const adminPage = await adminContext.newPage();
    await adminPage.goto('/auth/login');
    await adminPage.fill('input[name="email"]', 'admin@example.com');
    await adminPage.fill('input[name="password"]', 'adminpassword');
    await adminPage.click('button[type="submit"]');

    // Student login in another context
    const studentPage = await studentContext.newPage();
    await studentPage.goto('/auth/login');
    await studentPage.fill('input[name="email"]', 'student@example.com');
    await studentPage.fill('input[name="password"]', 'studentpass');
    await studentPage.click('button[type="submit"]');

    // Now you can interact with both sessions simultaneously
    await adminPage.getByText('Create Time Slot').click();
    // Verify the slot appears in student's available slots
    await studentPage.goto('/student/schedule');
    await expect(studentPage.getByText('Available Slots')).toBeVisible();
  });
});
