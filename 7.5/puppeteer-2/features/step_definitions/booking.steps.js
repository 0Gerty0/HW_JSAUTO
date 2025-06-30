const { Given, When, Then, After, Before } = require('@cucumber/cucumber');
const commands = require('../../lib/commands');

/* -------- lifecycle -------- */
Before(async () => { await commands.launchBrowser(); });
After(async ()  => { await commands.closeBrowser(); });

/* -------- given -------- */
Given('я открыл главную страницу', async () => {
  await commands.openHomePage();
});

/* -------- when -------- */
When('я выбираю день {string}', async (label) => {
  const idx = label === 'Сегодня' ? 1 : label === 'Завтра' ? 2 : null;
  if (!idx) throw new Error(`Неизвестный день: ${label}`);
  await commands.selectDateByIndex(idx);
});

When('я выбираю фильм {string}', async (movie) => {
  await commands.selectMovie(movie);
});

When('я выбираю ближайший сеанс', async () => {
  await commands.pickNearestFutureTime();
});

When('я выбираю {int} свободное кресло', async (n) => {
  await commands.chooseFirstFreeSeats(n);
});

When('я кликаю на занятое кресло', async () => {
  const ok = await commands.clickFirstTakenSeat();
  if (!ok) throw new Error('В зале нет занятых мест');
});

When('я бронирую', async () => {
  await commands.book();
});

/* -------- then -------- */
Then('я вижу электронный билет', async () => {
  const html = await commands.page.content();
  if (!/электронный билет|бронь подтверждена/i.test(html)) {
    throw new Error('Билет не выдан');
  }
});

Then('кнопка бронирования неактивна', async () => {
  const disabled = await commands.isBookDisabled();
  if (disabled !== true) throw new Error('Кнопка активна, а должна быть disabled');
});
