import { PlaywrightCrawler } from "crawlee";
import { router } from "./cafes_zaidin";

const crawler = new PlaywrightCrawler({
  launchContext: {
    launchOptions: {
      headless: true,
    },
  },
  maxRequestRetries: 0,
  requestHandler: router,
});

export { crawler };
