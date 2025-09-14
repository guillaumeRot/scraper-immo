"use server";

import { query } from "@/lib/db";

// Liste des annonces
export async function getAnnonces() {
  const result = await query(
    `SELECT id, type, prix, ville, pieces, surface, lien, agence, description, photos
     FROM annonces
     ORDER BY date_scraped DESC
     LIMIT 50`
  );
  return result.rows;
}

// Récupérer une annonce par id
export async function getAnnonceById(id: string) {
  const result = await query(
    `SELECT id, type, prix, ville, pieces, surface, lien, agence, description, photos
     FROM annonces
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}
