let page;

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(async () => {
  await page.close();
});

describe("GitHub team page tests", () => {
  beforeEach(async () => {
    await page.goto("https://github.com/team");
  });

  test(
    "The h1 header content",
    async () => {
      await page.click("header div div a");
      await page.waitForSelector("main h1", { timeout: 5000 });
      const title = await page.title();
      expect(title).toEqual(
        "GitHub · Build and ship software on a single, collaborative platform · GitHub"
      );
    },
    20_000
  );

  test(
    "The first link attribute",
    async () => {
      const href = await page.$eval("a", (a) => a.getAttribute("href"));
      expect(href).toEqual("#start-of-content");
    },
    10_000
  );

  test(
    "CTA button is present",
    async () => {
      const sel = ".btn-large-mktg.btn-mktg";
      await page.waitForSelector(sel, { visible: true, timeout: 5000 });
      const txt = await page.$eval(sel, (el) => el.textContent.trim());
      expect(txt).toMatch(/get started|sign up/i);
    },
    15_000
  );
});

describe("GitHub public pages h1 headers", () => {
  const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36";

  beforeEach(async () => {
    await page.setUserAgent(ua);
  });

  test(
    "H1 on /enterprise",
    async () => {
      await page.goto("https://github.com/enterprise", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector("main h1", { timeout: 7000 });
      const h1 = await page.$eval("main h1", (el) => el.textContent.trim());
      expect(h1).toMatch(/ai.?powered.*developer platform/i);
    },
    15_000
  );

  test(
    "H1 on /features",
    async () => {
      await page.goto("https://github.com/features", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector("main h1", { timeout: 5000 });
      const h1 = await page.$eval("main h1", (el) => el.textContent.trim());
      expect(h1).toEqual("The tools you need to build what you want");
    },
    15_000
  );

  test(
    "H1 on /marketplace",
    async () => {
      await page.goto("https://github.com/marketplace", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector("main h1", { timeout: 5000 });
      const h1 = await page.$eval("main h1", (el) => el.textContent.trim());
      expect(h1).toEqual("Enhance your workflow with extensions");
    },
    15_000
  );
});


