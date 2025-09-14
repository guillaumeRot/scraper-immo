import { closeDb, initDb } from "./lib/db.js";
import { kermarrecScraper } from "./scrapers/kermarrec.js";

(async () => {
  // console.log("--- Initialisation DB ---");
  await initDb();

  console.log("--- Lancement des scrapers ---");
  await kermarrecScraper();

  console.log("--- Fermeture DB ---");
  await closeDb();

  console.log("✅ Scraping terminé");
})();
