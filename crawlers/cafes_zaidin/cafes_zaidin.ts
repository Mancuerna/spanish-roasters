import { createPlaywrightRouter } from "crawlee";
import { insertCoffee } from "../../prisma/database_controller";
import { Coffee } from "../../prisma/myTypes";

const router = createPlaywrightRouter(),
  ROASTER_NAME = "Cafés Zaidín";

router.addHandler("COFFEE", async ({ request, page }) => {
  const active = true,
    coffeeName = await page
      .locator('h1[class="product-details__product-title ec-header-h3"]')
      .textContent(),
    productDescriptionContainer = await page.locator(
      'div[class="product-details__product-description"]'
    ),
    region = await productDescriptionContainer
      .locator("p")
      .filter({ hasText: "Región:" })
      .textContent(),
    farm = await productDescriptionContainer
      .locator("p")
      .filter({ hasText: "Finca:" })
      .textContent(),
    proccess = await productDescriptionContainer
      .locator("p")
      .filter({ hasText: "Proceso:" })
      .textContent(),
    altitude = await productDescriptionContainer
      .locator("p")
      .filter({ hasText: /Altitud:|Altura:/i })
      .textContent(),
    varietal = await productDescriptionContainer
      .locator("p")
      .filter({ hasText: "Variedad:" })
      .textContent(),
    tastingNotes = await productDescriptionContainer
      .locator("p")
      .filter({ hasText: /notas de cata\:|nota de cata\:|cata\:/i })
      .textContent(),
    coffeeImage = await page
      .locator(
        'img[class="details-gallery__picture details-gallery__photoswipe-index-0"]'
      )
      .getAttribute("src"),
    results: Coffee = {
      url: request.url,
      coffeeName: coffeeName || "",
      roasterName: ROASTER_NAME,
      region: region?.split(":")[1].trim() || "",
      farm: farm?.split(":")[1].trim() || "",
      proccess: proccess?.split(":")[1].trim() || "",
      altitude: altitude?.split(":")[1].trim() || "",
      varietal: varietal?.split(":")[1].trim() || "",
      tastingNotes: tastingNotes?.split(":")[1].trim() || "",
      coffeeImage: coffeeImage || "",
      dateAdded: new Date().getTime(),
      active,
    };
  await insertCoffee(results);
});

router.addHandler("ORIGIN", async ({ page, enqueueLinks }) => {
  await page.waitForSelector(
    'a[class="breadcrumbs__link ec-link ec-link--muted "]'
  );
  await enqueueLinks({
    selector: 'a[class="grid-product__title"]',
    label: "COFFEE",
  });
});

router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
  log.debug(`Proccessing: ${request.url}, ${request.label}`);
  await page.waitForSelector('div[class="grid-category__card"]');
  const originContainer = page
    .locator(
      'div[class="grid__categories grid__categories--advanced grid__categories--medium-items grid__categories--aspect-ratio-1333 grid__categories--appearance-hover"]'
    )
    .first();
  const originHrefList = await originContainer.locator(
    'a[class="grid-category__title"]'
  );
  const originUrls: string[] = [];
  for (const href of await originHrefList.all()) {
    originUrls.push((await href.getAttribute("href")) || "");
  }
  await enqueueLinks({
    transformRequestFunction(req) {
      return filterWrongOrigins(req);
    },
    urls: originUrls,
    label: "ORIGIN",
  });
});

const filterWrongOrigins = (req: any) => {
  const WRONG_ORIGINS = [
    "Infusiones",
    "Gama-de-caf",
    "Blends",
    "Descafeinados",
  ];
  if (WRONG_ORIGINS.some((element) => req.url.includes(element))) {
    return false;
  }
  return req;
};

export { router };
