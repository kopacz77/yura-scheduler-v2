import { test, expect } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('complete lesson booking flow', async ({ page }) => {
    // Navigate to calendar
    await page.click('text=Calendar');
    
    // Create new appointment
    await page.click('text=New Appointment');
    await page.fill('[name="title"]', 'Private Lesson');
    
    // Select date and time
    await page.fill('[name="date"]', '2025-01-30');
    await page.selectOption('[name="startTime"]', '10:00');
    await page.selectOption('[name="endTime"]', '11:00');
    
    // Select student and resource
    await page.selectOption('[name="studentId"]', '1');
    await page.selectOption('[name="resourceId"]', '1');
    
    // Save appointment
    await page.click('text=Save');
    
    // Verify appointment created
    await expect(page.locator('text=Private Lesson')).toBeVisible();
    await expect(page.locator('text=10:00 AM - 11:00 AM')).toBeVisible();
  });

  test('payment processing flow', async ({ page }) => {
    // Navigate to payments
    await page.click('text=Payments');
    
    // Find pending payment
    await expect(page.locator('text=Pending')).toBeVisible();
    
    // Process payment
    await page.click('text=Mark as Paid');
    await page.fill('[name="confirmationId"]', 'VENMO123');
    await page.click('text=Confirm');
    
    // Verify payment status updated
    await expect(page.locator('text=Paid')).toBeVisible();
    await expect(page.locator('text=VENMO123')).toBeVisible();
  });

  test('student management flow', async ({ page }) => {
    // Navigate to students
    await page.click('text=Students');
    
    // Create new student
    await page.click('text=Add Student');
    await page.fill('[name="name"]', 'John Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="phone"]', '123-456-7890');
    await page.selectOption('[name="level"]', 'INTERMEDIATE');
    await page.click('text=Save');
    
    // Verify student created
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=INTERMEDIATE')).toBeVisible();
  });

  test('resource management flow', async ({ page }) => {
    // Navigate to resources
    await page.click('text=Resources');
    
    // Check resource availability
    await expect(page.locator('text=Main Rink')).toBeVisible();
    await expect(page.locator('text=Available')).toBeVisible();
    
    // Update resource status
    await page.click('text=Main Rink');
    await page.click('text=Mark Unavailable');
    
    // Verify status updated
    await expect(page.locator('text=Unavailable')).toBeVisible();
  });

  test('responsive design checks', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    
    // Check navigation menu
    await page.click('button[aria-label="Open menu"]');
    await expect(page.locator('nav')).toBeVisible();
    
    // Verify calendar responsive behavior
    await page.click('text=Calendar');
    await expect(page.locator('.calendar-view')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('nav')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('nav')).toBeVisible();
  });

  test('error handling', async ({ page }) => {
    // Test network error handling
    await page.route('**/api/appointments', route => route.abort());
    await page.click('text=Calendar');
    
    // Verify error message
    await expect(page.locator('text=Failed to load appointments')).toBeVisible();
    await expect(page.locator('text=Retry')).toBeVisible();
    
    // Test validation error handling
    await page.click('text=New Appointment');
    await page.click('text=Save');
    
    // Verify validation messages
    await expect(page.locator('text=Title is required')).toBeVisible();
  });

  test('data persistence', async ({ page, context }) => {
    // Create appointment
    await page.click('text=Calendar');
    await page.click('text=New Appointment');
    await page.fill('[name="title"]', 'Test Lesson');
    // Fill other required fields...
    await page.click('text=Save');
    
    // Refresh page
    await page.reload();
    
    // Verify data persists
    await expect(page.locator('text=Test Lesson')).toBeVisible();
    
    // Open new tab/window
    const newPage = await context.newPage();
    await newPage.goto('/calendar');
    
    // Verify data syncs across tabs
    await expect(newPage.locator('text=Test Lesson')).toBeVisible();
  });
});
