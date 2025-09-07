import { test, expect, devices } from '@playwright/test';

test.describe('Login Page - Basic Access and UI Elements', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT001 - should open the login page', async ({ page }) => {
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('CT002 - should display the username input field', async ({ page }) => {
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

  test('CT003 - should display the password input field', async ({ page }) => {
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('CT004 - should display the login button', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('CT005 - should display the logo', async ({ page }) => {
    await expect(page.locator('xpath=//img[@alt="company-branding"]')).toBeVisible();
  });

});

test.describe('Login Page - Input Fields and Form Submission', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT006 - should successfully login with valid username and password', async ({ page }) => {
    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/dashboard/);
  });

  test('CT007 - should show error message when username is empty', async ({ page }) => {
    await page.locator('input[name="username"]').fill('');
    await page.locator('input[name="password"]').fill('admin123');

    await page.locator('button[type="submit"]').click();

    await expect(page.locator('span.oxd-input-field-error-message')).toContainText(/Required/);
  });

  test('CT008 - should show error message when password is empty', async ({ page }) => {
    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('');

    await page.locator('button[type="submit"]').click();

    await expect(page.locator('span.oxd-input-field-error-message')).toContainText(/Required/);
  });

  test('CT009 - should show error message on invalid credentials', async ({ page }) => {
    await page.locator('input[name="username"]').fill('wronguser');
    await page.locator('input[name="password"]').fill('wrongpass');

    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.oxd-alert-content-text')).toContainText(/Invalid credentials/);
  });

});

test.describe('Login Page - Login Button Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT010 - login button should be enabled by default', async ({ page }) => {
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeEnabled(); 
  });

  test('CT011 - should still allow click even if fields are empty', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(`//div[@class='orangehrm-login-slot-wrapper']//div[1]//div[1]//span[1]`)).toContainText(/Required/);
  });

  test('CT012 - login button remains enabled when only username is filled', async ({ page }) => {
    await page.locator('input[name="username"]').fill('Admin');
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeEnabled(); 
  });

  test('CT013 - login button remains enabled when only password is filled', async ({ page }) => {
    await page.locator('input[name="password"]').fill('admin123');
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeEnabled(); 
  });

});

test.describe('Login Page - Valid Login Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT014 - should successfully login and reach the dashboard', async ({ page }) => {
    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/dashboard/);

    await expect(page.locator('h6.oxd-text.oxd-text--h6.oxd-topbar-header-breadcrumb-module')).toHaveText('Dashboard');
  });

});

test.describe('Login Page - Invalid Login Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT015 - should show error with invalid credentials', async ({ page }) => {
    await page.locator('input[name="username"]').fill('invalidUser');
    await page.locator('input[name="password"]').fill('wrongPassword');
    await page.locator('button[type="submit"]').click();

    const errorMessage = page.locator('.oxd-alert-content-text');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid credentials');
  });

});

test.describe('Login Page - Forgot Password Link', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT016 - should redirect to password reset page when clicking forgot password', async ({ page }) => {
    await page.getByText('Forgot your password?').click();

    await expect(page).toHaveURL(/requestPasswordResetCode/);

    await expect(page.locator('input[name="username"]')).toBeVisible();

    await expect(page.locator('h6')).toHaveText('Reset Password');
  });

});

test.describe('Login Page - Responsiveness & Visual Layout', () => {
  const viewports = [
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 },
  ];

  for (const viewport of viewports) {
    test(`CT017 - should render login form correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

      await expect(page.locator('input[name="username"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });
  }
});

test.describe('Login Page - Required Field Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT018 - should not allow login with empty fields', async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    const usernameField = page.locator('input[name="username"]');
    const passwordField = page.locator('input[name="password"]');

    await expect(usernameField).toHaveClass(/--error/);
    await expect(passwordField).toHaveClass(/--error/);
  });

});

test.describe('Login Page - Incorrect Password', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT019 - should show error when password is incorrect', async ({ page }) => {
    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    const errorMessage = page.locator("//p[@class='oxd-text oxd-text--p oxd-alert-content-text']");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid credentials');

  });

});

test.describe('Login Page - Invalid Login Attempt', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT020 - should show error message with invalid credentials', async ({ page }) => {
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('[class*="oxd-alert-content-text"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid credentials');
  });
});

test.describe('Login Page - Password Masking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT021 - should mask characters in password input', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');

    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Login Page - Session Management (Logout)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('CT022 - should logout successfully after login', async ({ page }) => {
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/dashboard/);

    await page.locator('span.oxd-userdropdown-tab').click();

    await page.getByRole('menuitem', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/auth\/login/);
  });
});

test.describe('Login Page - Responsiveness', () => {

  test.use({ viewport: devices['iPhone 12'].viewport });

  test('CT023 - should render correctly on mobile (iPhone 12)', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('CT024 - should render correctly on tablet (iPad)', async ({ page }) => {
    await page.context().newPage({ viewport: devices['iPad (gen 7)'].viewport });
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

  test('CT025 - should render correctly on desktop (1280x720)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

});

test.describe('Login Page - Performance', () => {

  test('CT026 - should load login page within acceptable time', async ({ page }) => {
    const start = Date.now();

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    const end = Date.now();
    const loadTime = end - start;

    console.log(`Login page loaded in ${loadTime} ms`);

  
    expect(loadTime).toBeLessThan(3000);
  });

});