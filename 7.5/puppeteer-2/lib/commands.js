const puppeteer = require('puppeteer');
let browser, page;

/* click first element whose text contains `text` (case-insensitive) */
async function clickByText(selector, text) {
  await page.$$eval(
    selector,
    (nodes, t) => {
      t = t.toLowerCase();
      const el = nodes.find(n =>
        n.textContent.trim().toLowerCase().includes(t)
      );
      if (!el) throw new Error(`"${t}" not found`);
      el.click();
    },
    text
  );
}

/* ближайший ещё не прошедший сеанс «HH:MM» */
async function _nearestTime() {
  const now = new Date().toISOString();
  return page.$$eval(
    'a.movie-seances__time',
    (links, nowIso) => {
      const list = [];
      for (const a of links) {
        if (a.classList.contains('acceptin-button-disabled')) continue;
        const [h, m] = a.textContent.trim().split(':').map(Number);
        const ts = new Date(nowIso);
        ts.setHours(h, m, 0, 0);
        if (ts < new Date(nowIso)) continue;
        list.push({ txt: a.textContent.trim(), ms: ts.getTime() });
      }
      list.sort((a, b) => a.ms - b.ms);
      return list.length ? list[0].txt : null;
    },
    now
  );
}

module.exports = {
  page: null,

  /* browser */
  async launchBrowser() {
    browser = await puppeteer.launch({
   headless: false,                       
   slowMo: 50,                            
   defaultViewport: null,                 
   args: ['--no-sandbox', '--disable-setuid-sandbox']
 });
    page = await browser.newPage();
    page.setDefaultTimeout(120_000);
    this.page = page;
  },
  async closeBrowser() {
    if (browser) await browser.close();
  },

  openHomePage() {
    return page.goto('http://qamid.tmweb.ru/client/index.php', {
      waitUntil: 'networkidle0'
    });
  },

  /* навигация */
  selectDateByIndex: i => page.click(`.page-nav__day:nth-of-type(${i})`),
  selectMovie:  n => clickByText('h2.movie__title', n),
  pickTime:     t => clickByText('a.movie-seances__time', t),

  async pickNearestFutureTime() {
    const t = await _nearestTime();
    if (!t) throw new Error('Нет будущих сеансов');
    await clickByText('a.movie-seances__time', t);
    return t;
  },

  /* места — свободные */
  async chooseFirstFreeSeats(n = 1) {
    await page.waitForSelector('.buying-scheme__chair');
    const ok = await page.evaluate(need => {
      let done = 0;
      const free = [...document.querySelectorAll(
        '.buying-scheme__chair:not(.buying-scheme__chair_taken)'
      )];
      for (const seat of free) {
        seat.click();
        if (seat.classList.contains('buying-scheme__chair_selected')) {
          if (++done === need) break;
        }
      }
      return done;
    }, n);
    if (ok < n) throw new Error('Недостаточно свободных кресел');
  },

  /* 🔸 новое: кликаем первое занятое место, возвращаем true/false */
  async clickFirstTakenSeat() {
    await page.waitForSelector('.buying-scheme__chair_taken');
    const clicked = await page.evaluate(() => {
      const taken = document.querySelector('.buying-scheme__chair_taken');
      if (!taken) return false;
      taken.click();
      return true;
    });
    return clicked;
  },

  /* состояние кнопки */
  async isBookDisabled() {
    const btn = await page.$('button.acceptin-button');
    if (!btn) return null;
    return page.evaluate(b => b.disabled, btn);
  },

  /* бронирование (зал → оплата → билет) */
  async book() {
    await page.waitForSelector('button.acceptin-button:not([disabled])', { visible: true });
    await page.click('button.acceptin-button');
    await page.waitForSelector('button.acceptin-button', { visible: true });
    await clickByText('button.acceptin-button', 'код бронирования');
    await page.waitForSelector('.ticket__title, h2.ticket__check-title');
  }
};
