import { PlaywrightCrawler, log, purgeDefaultStorages } from "crawlee";
import { router } from "./cafes_zaidin.mjs";

export const crawler = new PlaywrightCrawler({
  launchContext: {
    launchOptions: {
      headless: true,
    },
  },
  requestHandler: router,
});
