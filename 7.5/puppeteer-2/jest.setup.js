const commands = require('./lib/commands');

jest.setTimeout(60000);

beforeAll(async () => {
  await commands.launchBrowser();
});

afterAll(async () => {
  await commands.closeBrowser();
});

