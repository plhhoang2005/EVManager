const { test, expect } = require('@playwright/test');

test.describe('Role 3: Coordinator Portal E2E Tests', () => {

  test('TC-COORD-01: Coordinator login and auto-redirect to coordinator.html', async ({ page }) => {
    await page.goto('/login.html');
    
    // Fill credentials
    await page.fill('#username', 'coordinator@evmanager.vn');
    await page.fill('#password', 'coordinator123');
    await page.click('button[type="submit"]');

    // Verify redirected to coordinator.html
    await page.waitForURL('**/coordinator.html', { timeout: 10000 });
    expect(page.url()).toContain('coordinator.html');

    // Verify greeting
    const greeting = page.locator('#adminSidebarGreeting');
    await expect(greeting).toBeVisible();
    await expect(greeting).toContainText('Coordinator');
  });

  test('TC-COORD-02: Operational metrics and events dispatch table load properly', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'coordinator@evmanager.vn');
    await page.fill('#password', 'coordinator123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/coordinator.html');

    await page.waitForTimeout(1500);

    // Verify upcoming events table has data
    const eventRows = page.locator('#eventsTableBody tr');
    await expect(eventRows.first()).toBeVisible();
    const count = await eventRows.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify next event countdown card
    const countdown = page.locator('#nextEventCountdown');
    await expect(countdown).toBeVisible();
  });

  test('TC-COORD-03: Tab navigation between Dashboard, Calendar, Checklist, and Venues', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'coordinator@evmanager.vn');
    await page.fill('#password', 'coordinator123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/coordinator.html');

    // 1. Switch to Calendar Tab
    const tabCalBtn = page.locator('button[data-tab="tab-coord-calendar"]');
    await tabCalBtn.click();
    await expect(page.locator('#tab-coord-calendar')).toBeVisible();
    await expect(page.locator('#coordinatorCalendar')).toBeVisible();

    // 2. Switch to Checklist Tab
    const tabChecklistBtn = page.locator('button[data-tab="tab-coord-checklist"]');
    await tabChecklistBtn.click();
    await expect(page.locator('#tab-coord-checklist')).toBeVisible();
    await expect(page.locator('#checklistItemsContainer')).toBeVisible();

    // 3. Switch to Venues Diagram Tab
    const tabVenuesBtn = page.locator('button[data-tab="tab-coord-venues"]');
    await tabVenuesBtn.click();
    await expect(page.locator('#tab-coord-venues')).toBeVisible();
    await expect(page.locator('#coordVenuesGrid')).toBeVisible();
  });

  test('TC-COORD-04: Checklist SOP interactivity and progress tracking', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'coordinator@evmanager.vn');
    await page.fill('#password', 'coordinator123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/coordinator.html');

    // Open Checklist tab
    await page.click('button[data-tab="tab-coord-checklist"]');
    await page.waitForTimeout(500);

    // Check existing checklist items
    const checklistItems = page.locator('.checklist-item');
    const initialCount = await checklistItems.count();
    expect(initialCount).toBeGreaterThan(0);

    // Add new checklist item
    await page.fill('#newChecklistInput', 'Kiểm tra dàn hoa tươi lối đi cô dâu');
    await page.click('button:has-text("Thêm đầu việc")');
    await page.waitForTimeout(300);

    // Verify item count increased
    const newCount = await page.locator('.checklist-item').count();
    expect(newCount).toBe(initialCount + 1);

    // Toggle the first checklist checkbox
    const firstCheckbox = page.locator('.checklist-item input[type="checkbox"]').first();
    await firstCheckbox.click();
    await page.waitForTimeout(300);

    // Verify progress text updated
    const progressText = await page.locator('#checklistBadge').textContent();
    expect(progressText).toBeTruthy();
  });
});
