import { closeDb } from "./lib/db.js";

(async () => {
  // console.log("--- Initialisation DB ---");
  // Prisma s'initialise automatiquement

  console.log("--- Lancement des scrapers ---");
  // await kermarrecScraper(); // Fonction non implémentée

  console.log("--- Fermeture DB ---");
  await closeDb();

  console.log("✅ Scraping terminé");
})();
