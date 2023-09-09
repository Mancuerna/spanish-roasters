import { PlaywrightCrawler } from "crawlee";

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page }) => {
    await page.waitForSelector('div[class="grid-category__card"]');
    const coffeeOrigins = await page.$$eval(
      'div[class="grid-category__title-inner"]',
      (els) => {
        return els.map((el) => el.textContent);
      }
    );
  },
});

await crawler.run(["https://www.soycafetera.es/tienda"]);
