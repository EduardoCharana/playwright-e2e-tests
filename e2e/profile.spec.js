import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Profile Page Tests via Dashboard Navigation', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    
    // Espera a página do dashboard carregar
    await expect(page).toHaveURL(/dashboard/);

    // Clica no menu "My Info"
    await page.locator('.oxd-main-menu-item', { hasText: 'My Info' }).click();

    // Verifica que a URL mudou para o perfil
    await expect(page).toHaveURL(/pim\/viewPersonalDetails/);
  });

  test('CT001 - should display user profile name', async ({ page }) => {
    const profileName = page.locator('.oxd-userdropdown-name');
    await expect(profileName).toBeVisible();
  });

  test('CT002 - should display personal details section', async ({ page }) => {
    const personalDetailsHeader = page.locator('h6', { hasText: 'Personal Details' });
    await expect(personalDetailsHeader).toBeVisible();
  });

  test('CT003 - should display and allow editing of first name', async ({ page }) => {
    const firstNameInput = page.locator('input[name="firstName"]');
    await expect(firstNameInput).toBeVisible();
    
    const originalValue = await firstNameInput.inputValue();

    // Modifica o primeiro nome
    await firstNameInput.fill('TestName');
    // Verifica se o valor foi atualizado no input
    await expect(firstNameInput).toHaveValue('TestName');

    // Reverte para o valor original para manter o teste limpo
    await firstNameInput.fill(originalValue);
  });

  test('CT004 - should display employee ID', async ({ page }) => {
    // XPath para o input Employee Id
    const employeeId = page.locator("//label[text()='Employee Id']/following::input[contains(@class, 'oxd-input')][1]");
    await expect(employeeId).toBeVisible();
    
    const value = await employeeId.inputValue();
    expect(value).not.toBeNull(); // ou

  });

  test('CT005 - should display full name fields with values', async ({ page }) => {
    const firstName = page.locator('input.orangehrm-firstname');
    const middleName = page.locator('input.orangehrm-middlename');
    const lastName = page.locator('input.orangehrm-lastname');

    await expect(firstName).toBeVisible();
    await expect(middleName).toBeVisible();
    await expect(lastName).toBeVisible();

    const firstNameValue = await firstName.inputValue();
    const middleNameValue = await middleName.inputValue();
    const lastNameValue = await lastName.inputValue();

    expect(firstNameValue).not.toBeNull();
    expect(middleNameValue).not.toBeNull();
    expect(lastNameValue).not.toBeNull();
  });

  test('CT006 - should save profile changes successfully', async ({ page }) => {
    const saveButton = page.locator('button[type="submit"]');
    await expect(saveButton).toBeVisible();
    
    await saveButton.click();

    // Esperar que apareça uma mensagem de sucesso
    const successMessage = page.locator('.oxd-toast-content');
    await expect(successMessage).toBeVisible();

    // Verifica se a mensagem contém texto esperado
    await expect(successMessage).toContainText(/success/i);
  });

 test('CT007 - should allow updating date of birth', async ({ page }) => {
  // Usa o XPath corretamente com 'xpath='
  const dobInput = page.locator('xpath=(//input[@placeholder="yyyy-dd-mm"])[2]');
  await expect(dobInput).toBeVisible();

  const originalValue = await dobInput.inputValue();

  await dobInput.fill('1990-01-01');
  await expect(dobInput).toHaveValue('1990-01-01');

  // Reverte para o valor original
  await dobInput.fill(originalValue);
});

test('CT009 - should allow selecting marital status', async ({ page }) => {
  // Localiza o dropdown pelo label
  const dropdownField = page.locator('//label[text()="Marital Status"]/following::div[contains(@class,"oxd-select-text")][1]');
  await dropdownField.click(); 

  // Localiza a opção "Single"
  const option = page.locator('//div[@role="option" and normalize-space(.)="Single"]');
  await expect(option).toBeVisible();
  await option.click();

  // Verifica se a opção "Single" ficou visível no campo
  await expect(dropdownField).toHaveText('Single');
});

});