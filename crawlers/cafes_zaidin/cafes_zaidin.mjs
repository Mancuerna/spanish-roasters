import { PlaywrightCrawler, log } from "crawlee";

log.setLevel(log.LEVELS.INFO);

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page, request, enqueueLinks }) => {
    log.info(`Proccessing: ${request.url}`);
    if (request.label === "ORIGIN") {
      await page.waitForSelector('a[class="breadcrumbs__link ec-link ec-link--muted "]');
      await enqueueLinks({
        selector: 'a[class="grid-product__title"]',
        label: "COFFEE",
      });
    } else {
      await page.waitForSelector('div[class="grid-category__card"]');
      await enqueueLinks({
        transformRequestFunction(req) {
          return filterWrongOrigins(req);
        },
        selector: 'a[class="grid-category__title"]',
        label: "ORIGIN",
      });
    }
  },
});

const filterWrongOrigins = (req) => {
  const WRONG_ORIGINS = ["Infusiones", "Gama-de-caf", "Blends"];
  if (WRONG_ORIGINS.some((element) => req.url.includes(element))) {
    return false;
  }
  return req;
};

await crawler.run(["https://www.soycafetera.es/tienda"]);
