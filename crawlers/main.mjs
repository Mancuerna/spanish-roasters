import { crawler as zaidinCrawler } from "./cafes_zaidin/main.mjs";

log.setLevel(log.LEVELS.INFO);
log.debug("Setting up crawler.");

await purgeDefaultStorages();
await zaidinCrawler.run(["https://www.soycafetera.es/tienda"]);