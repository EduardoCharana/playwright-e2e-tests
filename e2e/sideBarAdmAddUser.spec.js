const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

test.describe('Dashboard Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
  });

  test('TC001 - Should be redirected to dashboard after login', async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/);
  });

  test.only('TC002 - Should add a new Admin user', async ({ page }) => {

    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');

    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser');
    await expect(page.getByText('Add User')).toBeVisible();

    await page.locator('.oxd-form-row div.oxd-select-text').nth(0).click();
    await page.getByRole('option', { name: 'Admin' }).click();

    await page.getByPlaceholder('Type for hints...').fill('john');
    await page.locator('div[role="listbox"] div[role="option"]').first().click(); // Autocomplete

    await page.locator("(//i[@class='oxd-icon bi-caret-down-fill oxd-select-text--arrow'])[2]").click();
    const enabledOption = page.getByRole('option', { name: 'Enabled' });
    await expect(enabledOption).toBeVisible();
    await enabledOption.click();

    await page.locator('(//input[@autocomplete="off"])[1]').fill('newuser123');

    await page.locator('(//input[@type="password"])[1]').fill('Password123!');
    await page.locator('(//input[@type="password"])[2]').fill('Password123!');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.oxd-toast')).not.toBeVisible();
  });
});

