const { test, expect } = require('@playwright/test');

test.describe('Role 4: Customer Portal & Public Experience E2E Tests', () => {

  test('TC-CUST-01: Customer login and view party preparation status in customer.html', async ({ page }) => {
    await page.goto('/login.html');
    
    // Fill credentials
    await page.fill('#username', 'customer@evmanager.vn');
    await page.fill('#password', '123456');
    await page.click('button[type="submit"]');

    // Verify redirected to customer.html
    await page.waitForURL('**/customer.html', { timeout: 10000 });
    expect(page.url()).toContain('customer.html');

    // Verify customer header name
    const customerHeader = page.locator('#customerHeaderName');
    await expect(customerHeader).toBeVisible();

    // Verify party stepper
    const stepper = page.locator('#customerStepper');
    await expect(stepper).toBeVisible();
  });

  test('TC-CUST-02: Public landing page displays AI EventGenie launcher', async ({ page }) => {
    await page.goto('/index.html');

    // Verify brand logo
    const brand = page.locator('#brandLogo');
    await expect(brand).toBeVisible();

    // Verify AI Chat launcher button exists
    const aiChatFab = page.locator('.ai-chat-fab, #aiChatLauncher, [class*="ai-chat"], .customer-ai-fab');
    await expect(aiChatFab.first()).toBeVisible();
  });

  test('TC-CUST-03: Dynamic Stepper and metric cards reflect real contract data', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'customer@evmanager.vn');
    await page.fill('#password', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/customer.html');

    await page.waitForTimeout(1000);

    // Verify Stepper progress fill and badge
    const stepperFill = page.locator('#stepperFill');
    await expect(stepperFill).toBeVisible();
    const widthStyle = await stepperFill.getAttribute('style');
    expect(widthStyle).toContain('width:');

    // Verify Remaining amount & Deposit paid
    const remainingVal = page.locator('#custRemainingAmount');
    await expect(remainingVal).toBeVisible();
    const remainingText = await remainingVal.textContent();
    expect(remainingText).toMatch(/[đ₫]/);

    const depositVal = page.locator('#custDepositPaid');
    await expect(depositVal).toBeVisible();
  });

  test('TC-CUST-04: Customer Tabs navigation between Overview, Menu, and Services', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'customer@evmanager.vn');
    await page.fill('#password', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/customer.html');

    // 1. Switch to Menu Tab
    await page.click('a[data-cust-tab="tab-cust-menu"]');
    await page.waitForTimeout(400);
    await expect(page.locator('#tab-cust-menu')).toBeVisible();
    await expect(page.locator('#customerMenuDishesGrid')).toBeVisible();

    // 2. Switch to Services Tab
    await page.click('a[data-cust-tab="tab-cust-services"]');
    await page.waitForTimeout(400);
    await expect(page.locator('#tab-cust-services')).toBeVisible();
    await expect(page.locator('#customerServicesGrid')).toBeVisible();

    // 3. Switch back to Overview Tab
    await page.click('a[data-cust-tab="tab-cust-overview"]');
    await page.waitForTimeout(400);
    await expect(page.locator('#tab-cust-overview')).toBeVisible();
    await expect(page.locator('#customerContractContainer')).toBeVisible();
  });

  test('TC-CUST-05: VietQR deposit info and transaction history displayed', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'customer@evmanager.vn');
    await page.fill('#password', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/customer.html');

    await page.waitForTimeout(1000);

    // Verify VietQR image is rendered
    const qrImg = page.locator('#customerVietQrImg, img[alt*="VietQR"]');
    await expect(qrImg.first()).toBeVisible();

    // Verify Quick Copy buttons exist
    const copyBtns = page.locator('.btn-copy-quick');
    const copyCount = await copyBtns.count();
    expect(copyCount).toBeGreaterThanOrEqual(2);

    // Verify Payment history container
    const paymentHistory = page.locator('#customerPaymentHistoryContainer');
    await expect(paymentHistory).toBeVisible();
  });
});
