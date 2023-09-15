import { PlaywrightCrawler, log, purgeDefaultStorages } from "crawlee";
import { router } from "./cafes_zaidin.mjs";

log.setLevel(log.LEVELS.INFO);
log.debug("Setting up crawler.");
await purgeDefaultStorages();
const crawler = new PlaywrightCrawler({
    launchContext: {
        launchOptions: {
          headless: true,
        },
    },
  requestHandler: router,
});

await crawler.run(["https://www.soycafetera.es/tienda"]);
