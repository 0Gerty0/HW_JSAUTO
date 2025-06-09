const { test, expect } = require('@playwright/test');
const { email, password } = require('../user');

test.describe('Авторизация на netology.ru', () => {
  test('Успешная авторизация', async ({ page }) => {
    await page.goto('https://netology.ru/?modal=sign_in');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button:has-text("Войти")');
    await page.waitForURL('**/profile/**');

    // Ищем на странице любой <h2> с текстом "Моё обучение"
    const header = page.locator('h2', { hasText: 'Моё обучение' });
    await expect(header).toBeVisible();
  });

  test('Неуспешная авторизация', async ({ page }) => {
    await page.goto('https://netology.ru/?modal=sign_in');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password + 'wrong');
    await page.click('button:has-text("Войти")');
    const error = page.getByText('Вы ввели неправильно логин или пароль');
    await expect(error).toBeVisible();
  });
});
