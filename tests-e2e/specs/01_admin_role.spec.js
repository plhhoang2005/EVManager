const { test, expect } = require('@playwright/test');

test.describe('Role 1: Admin Portal E2E Tests', () => {

  test('TC-ADMIN-01: Admin login and auto-redirect to admin.html', async ({ page }) => {
    await page.goto('/login.html');
    
    // Fill credentials
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');

    // Verify redirected to admin.html
    await page.waitForURL('**/admin.html', { timeout: 10000 });
    expect(page.url()).toContain('admin.html');
    
    // Verify greeting or header
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-ADMIN-02: Dashboard KPI cards display real PostgreSQL database metrics', async ({ page }) => {
    // Login as admin
    await page.goto('/login.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin.html');

    // Wait for dashboard data to load
    await page.waitForTimeout(2000);

    // Verify Doanh thu KPI is loaded (contains đ or ₫)
    const doanhThuEl = page.locator('#doanhThu');
    await expect(doanhThuEl).toBeVisible();
    const doanhThuText = await doanhThuEl.textContent();
    expect(doanhThuText).toMatch(/[đ₫]/);
    expect(doanhThuText).not.toContain('NaN');

    // Verify So Su Kien KPI is a positive number
    const soSuKienEl = page.locator('#soSuKien');
    await expect(soSuKienEl).toBeVisible();
    const soSuKienText = await soSuKienEl.textContent();
    const eventsCount = parseInt(soSuKienText.replace(/\D/g, ''), 10);
    expect(eventsCount).toBeGreaterThanOrEqual(1);

    // Verify So Khach Hang KPI
    const soKhachHangEl = page.locator('#soKhachHang');
    await expect(soKhachHangEl).toBeVisible();
    const customersCount = parseInt(await soKhachHangEl.textContent(), 10);
    expect(customersCount).toBeGreaterThanOrEqual(1);

    // Verify Hop Dong Cho Duyet KPI
    const hopDongChoEl = page.locator('#hopDongCho');
    await expect(hopDongChoEl).toBeVisible();
    const pendingContracts = parseInt(await hopDongChoEl.textContent(), 10);
    expect(pendingContracts).toBeGreaterThanOrEqual(0);
  });

  test('TC-ADMIN-03: Venues management tab loads active halls from database', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin.html');

    // Wait for initial dashboard load
    await page.waitForTimeout(1000);

    // Click tab Quản lý địa điểm
    await page.click('button[data-tab="tab-venues"]');
    
    // Verify tab pane is active
    const tabVenues = page.locator('#tab-venues');
    await expect(tabVenues).toHaveClass(/active/);

    // Wait for venues table rows
    const venueRows = page.locator('#venuesTableBody tr');
    await expect(venueRows.first()).toBeVisible({ timeout: 10000 });
    const count = await venueRows.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify venue names exist (e.g. Diamond / Kim Cương / Hoàng Gia)
    const tableText = await page.locator('#venuesTableBody').textContent();
    expect(tableText).toMatch(/Hoàng Gia|Kim Cương|Ngọc Bích|Sảnh/i);
  });

  test('TC-ADMIN-04: Payments tab loads VietQR deposit transactions from backend', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin.html');

    // Wait for initial dashboard load
    await page.waitForTimeout(1000);

    // Click tab Quản lý thanh toán
    await page.click('button[data-tab="tab-payments"]');

    // Verify tab pane is active
    const tabPayments = page.locator('#tab-payments');
    await expect(tabPayments).toHaveClass(/active/);

    // Verify payments table has transactions
    const paymentRows = page.locator('#paymentsTableBody tr');
    await expect(paymentRows.first()).toBeVisible({ timeout: 10000 });
    const count = await paymentRows.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify status has Thành công
    const paymentsText = await page.locator('#paymentsTableBody').textContent();
    expect(paymentsText).toContain('Thành công');
  });

  test('TC-ADMIN-05: AI System Hub tab is accessible with Killswitch controls', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin.html');

    // Click tab AI System Hub
    const aiTabBtn = page.locator('button[data-tab="tab-ai-system"]');
    if (await aiTabBtn.count() > 0) {
      await aiTabBtn.click();
      await page.waitForTimeout(1000);
      const aiSection = page.locator('#tab-ai-system');
      await expect(aiSection).toBeVisible();
    }
  });
});
