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

  test('CT002 - Deve aceder à secção Buzz com sucesso', async ({ page }) => {
  await page.getByRole('link', { name: 'Buzz' }).click();
  await expect(page).toHaveURL(/buzz/);
  await expect(page.locator('textarea[placeholder="What\'s on your mind?"]')).toBeVisible();

});
  
test('CT003 - Deve criar uma nova publicação no Buzz', async ({ page }) => {
  await page.getByRole('link', { name: 'Buzz' }).click();

  const message = 'Post';
  await page.locator('textarea[placeholder="What\'s on your mind?"]').fill(message);
  await page.locator('//button[@type="submit"]').click();

  await page.waitForTimeout(2000);

  const firstPost = page.locator('.oxd-buzz-post').first();
  await expect(firstPost).toContainText(message);
});


test('CT004 - Should not allow posting an empty message', async ({ page }) => {
  await page.getByRole('link', { name: 'Buzz' }).click();

  await page.locator('//button[@type="submit"]').click();

  const toast = page.locator('.oxd-toast');
  await expect(toast).toHaveCount(0);
});

test('CT005', async ({ page }) => {

  await page.getByRole('link', { name: 'Buzz' }).click();

  const likeIcon = page.locator(`//div[@class='orangehrm-buzz-newsfeed']//div[1]//div[1]//div[3]//div[1]//div[1]//*[name()='svg']//*[name()='g' and @id='Group']//*[name()='path' and @id='heart']`)

  await expect(likeIcon).toBeVisible()

  await likeIcon.click();

    const likeCounter = page.locator(`//div[@class='orangehrm-buzz-newsfeed']//div[1]//div[1]//div[3]//div[2]//div[1]//p[1]`)

      await expect(likeCounter).toBeVisible()
    


  

});

test('CT006 - Should comment on a Buzz post', async ({ page }) => {
  await page.getByRole('link', { name: 'Buzz' }).click();

  const commentButton = page.locator(`//div[@class='orangehrm-buzz-newsfeed']//div[1]//div[1]//div[3]//div[1]//button[1]//i[1]`).first();
  await commentButton.click();

   const commentInput = page.locator('//input[@placeholder="Write your comment..."]').first();
   const comment = 'Automated comment - Playwright';
  await commentInput.fill(comment);
  await commentInput.press('Enter');

  const successToast = page.locator('.oxd-toast-content');  
  await expect(successToast).toBeVisible();
  await expect(successToast).toContainText('Success'); 
  
  const commentPosted = page.locator("//span[@class='oxd-text oxd-text--span orangehrm-post-comment-text']").last();
  await expect(commentPosted).toBeVisible({ timeout: 5000 }); 
  await expect(commentPosted).toContainText(comment)
 
});

test('CT007 - Should edit the comment on a Buzz post', async ({ page }) => {
  await page.getByRole('link', { name: 'Buzz' }).click();

  const commentButton = page.locator(`//div[@class='orangehrm-buzz-newsfeed']//div[1]//div[1]//div[3]//div[1]//button[1]//i[1]`).first();
  await commentButton.click();

   const commentInput = page.locator('//input[@placeholder="Write your comment..."]').first();
   const comment = 'Automated comment - Playwright for edition';
  await commentInput.fill(comment);
  await commentInput.press('Enter');

  const successToast = page.locator('.oxd-toast-content');  
  await expect(successToast).toBeVisible();
  await expect(successToast).toContainText('Success'); 
  
  const commentPosted = page.locator("//span[@class='oxd-text oxd-text--span orangehrm-post-comment-text']").last();
  await expect(commentPosted).toBeVisible({ timeout: 5000 }); 
  await expect(commentPosted).toContainText(comment)
  
  await page.locator("//body//div[@id='app']//div[@class='oxd-grid-item oxd-grid-item--gutters']//div[@class='oxd-grid-item oxd-grid-item--gutters']//div[2]//div[2]//div[2]//p[2]").click()
 
  const commentEdited = ('New comment')
  const editPlaceHolder = page.locator('//input[@class="oxd-input oxd-input--focus"]')
  await editPlaceHolder.fill(commentEdited)

  const editSuccessToast = page.locator('.oxd-toast-content');  
  await expect(editSuccessToast).toBeVisible();
  await expect(editSuccessToast).toContainText('Success'); 
});


test('CT009 - Should delete the first Buzz post', async ({ page }) => {
  // Navega para a página Buzz
  await page.getByRole('link', { name: 'Buzz' }).click();

  // Seleciona o primeiro post
  const firstPost = page.locator(".orangehrm-buzz-newsfeed > div").first();
  await firstPost.waitFor({ state: "visible", timeout: 5000 });

  // Faz hover no post para revelar o botão de ações
  await firstPost.hover();

  const optionsButton = page.locator("(//i[@class='oxd-icon bi-three-dots'])[1]");
  await optionsButton.waitFor({ state: "visible", timeout: 5000 });
  await optionsButton.click();

  
  // Clica na opção "Delete" do post
  const deletePostButton = page.locator("p").filter({ hasText: "Delete" }).first();
  await deletePostButton.click();

  // Confirma a exclusão
  const confirmDelete = page.locator("//button[normalize-space()='Yes, Delete']");
  await confirmDelete.waitFor({ state: "visible", timeout: 5000 });
  await confirmDelete.click();

  // Verifica se o toast de sucesso aparece
  const deleteSuccessToast = page.locator('.oxd-toast-content');
  await expect(deleteSuccessToast).toBeVisible({ timeout: 5000 });
  await expect(deleteSuccessToast).toContainText(/Success/i);
});

test('CT010 - Should share an existing Buzz post', async ({ page }) => {
  // Navega para a página Buzz
  await page.getByRole('link', { name: 'Buzz' }).click();

  // Seleciona o primeiro post
  const firstPost = page.locator(".orangehrm-buzz-newsfeed > div").first();
  await firstPost.waitFor({ state: "visible", timeout: 5000 });

  // Faz hover no post para revelar o botão de ações
  await firstPost.hover();

  const shareButton = page.locator("(//i[@class='oxd-icon bi-share-fill'])[1]")
  await shareButton.click()

  const sharePlaceholder = page.locator(`(//textarea[@placeholder="What's on your mind?"])[2]`)
  await sharePlaceholder.fill("Let's share :)")

  const shareButtonClick = page.locator("(//button[normalize-space()='Share'])[1]")
  await shareButtonClick.click()
  
  const shareSuccessToast = page.locator('.oxd-toast-content');
  await expect(shareSuccessToast).toBeVisible({ timeout: 5000 });
  await expect(shareSuccessToast).toContainText(/Success/i);
  
});


test('CT011 - Should validate like counter increments and decrements', async ({ page }) => {
  // Navega para a página Buzz
  await page.getByRole('link', { name: 'Buzz' }).click();

  // Seleciona o primeiro post
  const firstPost = page.locator(".orangehrm-buzz-newsfeed > div").first();
  await firstPost.waitFor({ state: "visible", timeout: 5000 });

  // Faz hover no post para revelar o botão de ações
  await firstPost.hover();

  const shareButton = page.locator("(//i[@class='oxd-icon bi-share-fill'])[1]")
  await shareButton.click()

  const sharePlaceholder = page.locator(`(//textarea[@placeholder="What's on your mind?"])[2]`)
  await sharePlaceholder.fill("Let's share :)")

  const shareButtonClick = page.locator("(//button[normalize-space()='Share'])[1]")
  await shareButtonClick.click()
  
  const shareSuccessToast = page.locator('.oxd-toast-content');
  await expect(shareSuccessToast).toBeVisible({ timeout: 5000 });
  await expect(shareSuccessToast).toContainText(/Success/i);
  
});



});

