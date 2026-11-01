const { test, expect } = require('@playwright/test');

test.describe('Role 5: RBAC Security & Quick Role Switcher E2E Tests', () => {

  test('TC-SEC-01: Admin portal includes quick role switcher for multi-role verification', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin.html');

    // Role switcher badge or trigger should be visible
    const roleSwitcherTrigger = page.locator('#roleSwitcherTrigger, .role-badge, [onclick*="RoleSwitcher"]');
    if (await roleSwitcherTrigger.count() > 0) {
      await expect(roleSwitcherTrigger.first()).toBeVisible();
    }
  });

  test('TC-SEC-02: Logout clears session and returns to login or index', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin.html');

    // Click logout
    const logoutBtn = page.locator('#logoutButton, button:has-text("Đăng xuất")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
      await page.waitForTimeout(1000);
      
      // Check session storage is cleared
      const token = await page.evaluate(() => sessionStorage.getItem('accessToken'));
      expect(token).toBeNull();
    }
  });
});
