const { test, expect } = require('@playwright/test');

test.describe('Role 2: Sales Specialist Portal E2E Tests', () => {

  test('TC-SALES-01: Sales login and auto-redirect to sales.html', async ({ page }) => {
    await page.goto('/login.html');
    
    // Fill credentials
    await page.fill('#username', 'sales@evmanager.vn');
    await page.fill('#password', 'sales123');
    await page.click('button[type="submit"]');

    // Verify redirected to sales.html
    await page.waitForURL('**/sales.html', { timeout: 10000 });
    expect(page.url()).toContain('sales.html');

    // Verify greeting
    const greeting = page.locator('#adminSidebarGreeting');
    await expect(greeting).toBeVisible();
    await expect(greeting).toContainText('Sales');
  });

  test('TC-SALES-02: Tab Quản lý Hợp đồng switches and loads contracts from database', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'sales@evmanager.vn');
    await page.fill('#password', 'sales123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/sales.html');

    await page.waitForTimeout(1000);

    // Click Tab Quản lý Hợp đồng
    await page.click('button[data-tab="tab-sales-contracts"]');

    // Verify tab pane is active
    const tabContracts = page.locator('#tab-sales-contracts');
    await expect(tabContracts).toHaveClass(/active/);

    // Verify contracts table has rows
    const rows = page.locator('#contractsTableBody tr');
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Click "👁️ Chi tiết" button on first contract
    const detailBtn = page.locator('#contractsTableBody tr button:has-text("Chi tiết")').first();
    await detailBtn.click();
    await page.waitForTimeout(500);

    // Verify View Contract modal opens with VietQR
    const modal = page.locator('#viewContractModal');
    await expect(modal).toHaveClass(/open/);
    const qrImg = page.locator('#viewContractModal img[alt="VietQR"]');
    await expect(qrImg).toBeVisible();

    // Close modal
    await page.click('button[onclick="closeViewContractModal()"]');
  });

  test('TC-SALES-03: Tab Quản lý Khách hàng switches and supports instant search', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'sales@evmanager.vn');
    await page.fill('#password', 'sales123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/sales.html');

    await page.waitForTimeout(1000);

    // Click Tab Quản lý Khách hàng
    await page.click('button[data-tab="tab-sales-customers"]');

    // Verify tab pane is active
    const tabCustomers = page.locator('#tab-sales-customers');
    await expect(tabCustomers).toHaveClass(/active/);

    // Verify customer rows exist
    const rows = page.locator('#salesCustomersTableBody tr');
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Test search box
    const searchInput = page.locator('#customerSearchInput');
    await searchInput.fill('Thảo');
    await page.waitForTimeout(500);
    const tableText = await page.locator('#salesCustomersTableBody').textContent();
    expect(tableText).toContain('Thảo');
  });

  test('TC-SALES-04: Tab Quản lý Thanh toán switches and loads VietQR deposit audit history', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'sales@evmanager.vn');
    await page.fill('#password', 'sales123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/sales.html');

    await page.waitForTimeout(1000);

    // Click Tab Quản lý Thanh toán
    await page.click('button[data-tab="tab-sales-payments"]');

    // Verify tab pane is active
    const tabPayments = page.locator('#tab-sales-payments');
    await expect(tabPayments).toHaveClass(/active/);

    // Verify payments table has rows
    const rows = page.locator('#salesPaymentsTableBody tr');
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify status has Thành công
    const text = await page.locator('#salesPaymentsTableBody').textContent();
    expect(text).toContain('Thành công');
  });

  test('TC-SALES-05: Modal Thêm khách hàng mới opens and is functional', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'sales@evmanager.vn');
    await page.fill('#password', 'sales123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/sales.html');

    await page.click('button[data-tab="tab-sales-customers"]');

    // Click "Thêm khách hàng mới" button
    await page.click('button[onclick="openCreateCustomerModal()"]');

    // Verify modal opens
    const modal = page.locator('#customerModal');
    await expect(modal).toHaveClass(/open/);

    // Verify form inputs exist
    await expect(page.locator('#custFullName')).toBeVisible();
    await expect(page.locator('#custPhone')).toBeVisible();

    // Close modal
    await page.click('button[onclick="closeCustomerModal()"]');
  });
});
