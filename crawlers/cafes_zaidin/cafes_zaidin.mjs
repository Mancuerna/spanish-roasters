import { PlaywrightCrawler, log, Dataset, purgeDefaultStorages } from "crawlee";

const ROASTER_NAME = "Cafés Zaidín";
log.setLevel(log.LEVELS.INFO);
await purgeDefaultStorages();

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page, request, enqueueLinks }) => {
    log.info(`Proccessing: ${request.url}`);
    if (request.label === "COFFEE") {
      const coffeeName = await page
        .locator('h1[class="product-details__product-title ec-header-h3"]')
        .textContent();
      const productDescriptionContainer = await page.locator(
        'div[class="product-details__product-description"]'
      );
      const region = await productDescriptionContainer
        .locator("p")
        .filter({ hasText: "Región: " })
        .textContent();
      const farm = await productDescriptionContainer
        .locator("p")
        .filter({ hasText: "Finca: " })
        .textContent();
      const proccess = await productDescriptionContainer
        .locator("p")
        .filter({ hasText: "Proceso: " })
        .textContent();
      const altitude = await productDescriptionContainer
        .locator("p")
        .filter({ hasText: "Altura: " })
        .textContent();
      const variety = await productDescriptionContainer
        .locator("p")
        .filter({ hasText: "Variedad: " })
        .textContent();
      const tastingNotes = await productDescriptionContainer
        .locator("p")
        .filter({ hasText: "Notas de cata: " })
        .textContent();

      const results = {
        url: request.url,
        coffeeName: coffeeName,
        roasterName: ROASTER_NAME,
        region: region.slice(8).trim(),
        farm: farm.slice(7).trim(),
        proccess: proccess.slice(9).trim(),
        altitude: altitude.slice(8).trim(),
        variety: variety.slice(10).trim(),
        tastingNotes: tastingNotes.slice(15).trim(),
      };
      log.info(coffeeName);
      await Dataset.pushData(results);
    }
    if (request.label === "ORIGIN") {
      await page.waitForSelector(
        'a[class="breadcrumbs__link ec-link ec-link--muted "]'
      );
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
