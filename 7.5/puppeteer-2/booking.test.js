const commands = require('./lib/commands');

beforeEach(async () => {
  await commands.openHomePage();
});

/* ─────────── happy ─────────── */
describe('Booking — happy paths', () => {
  test('Сегодня · Мир Юрского периода', async () => {
    await commands.selectDateByIndex(1);
    await commands.selectMovie('Мир Юрского периода');
    await commands.pickNearestFutureTime();
    await commands.chooseFirstFreeSeats(1);
    await commands.book();
    expect(await commands.page.content())
      .toMatch(/электронный билет|бронь подтверждена/i);
  });

  test('Завтра · Ведьмак', async () => {
    await commands.selectDateByIndex(2);
    await commands.selectMovie('Ведьмак');
    await commands.pickNearestFutureTime();
    await commands.chooseFirstFreeSeats(2);
    await commands.book();
    expect(await commands.page.content())
      .toMatch(/электронный билет|бронь подтверждена/i);
  });
});

/* ─────────── новый sad ─────────── */
describe('Booking — sad path', () => {
  test('Клик по занятому месту не активирует кнопку', async () => {
    await commands.selectDateByIndex(1);
    await commands.selectMovie('Сталкер');
    await commands.pickNearestFutureTime();

    const clicked = await commands.clickFirstTakenSeat();
    expect(clicked).toBe(true);                       // занятое кресло найдено

    const disabled = await commands.isBookDisabled(); // кнопка должна остаться неактивной
    expect(disabled).toBe(true);
  });
});
