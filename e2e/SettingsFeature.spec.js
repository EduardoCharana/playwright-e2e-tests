const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

test.describe('Dashboard Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
  });

  test('TC001 - should be redirected to dashboard after login', async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/);
  });

  test('TC002 - should display user profile name', async ({ page }) => {
    const profileName = page.locator('.oxd-userdropdown-name');
    await expect(profileName).toBeVisible();
  });

  test('TC003 - should display dashboard widgets', async ({ page }) => {
    const widgets = page.locator('.orangehrm-dashboard-widget');
    await expect(widgets.first()).toBeVisible();
  });

  test('TC004 - should allow user to open profile dropdown', async ({ page }) => {
    const profileDropdown = page.locator('.oxd-userdropdown-name');
    await profileDropdown.click();
    const dropdownOptions = page.locator('.oxd-dropdown-menu');
    await expect(dropdownOptions).toBeVisible();
  });

  test('TC005 - should allow user to logout successfully', async ({ page }) => {
    await page.locator('.oxd-userdropdown-name').click();
    await page.locator('text=Logout').click();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('TC006 - should display the "Dashboard" title', async ({ page }) => {
    const title = page.locator('h6:has-text("Dashboard")');
    await expect(title).toBeVisible();
  });


  test('TC007 - should render all widget icons', async ({ page }) => {
    const icons = page.locator('.orangehrm-dashboard-widget .oxd-icon');
    await expect(icons.first()).toBeVisible();
  });

  test('TC008 - should maintain layout on smaller screens', async ({ page, browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const mobilePage = await context.newPage();
    const loginPage = new LoginPage(mobilePage);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    const widgets = mobilePage.locator('.orangehrm-dashboard-widget');
    await expect(widgets.first()).toBeVisible();
    await context.close();
  });
});
