
module.exports = {
  testDir: './tests',
  use: {
    baseURL: 'https://netology.ru',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  timeout: 30000
};