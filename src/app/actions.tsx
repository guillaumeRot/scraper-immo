"use server";

import { prisma } from "@/lib/db";

// Liste des annonces
export async function getAnnonces() {
  const annonces = await prisma.annonce.findMany({
    select: {
      id: true,
      type: true,
      prix: true,
      ville: true,
      pieces: true,
      surface: true,
      lien: true,
      agence: true,
      description: true,
      photos: true,
    },
    orderBy: {
      date_scraped: "desc",
    },
    take: 50,
  });
  return annonces;
}

// Récupérer une annonce par id
export async function getAnnonceById(id: string) {
  const annonce = await prisma.annonce.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      type: true,
      prix: true,
      ville: true,
      pieces: true,
      surface: true,
      lien: true,
      agence: true,
      description: true,
      photos: true,
    },
  });
  return annonce;
}
