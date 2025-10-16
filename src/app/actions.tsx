"use server";

import { prisma } from "@/lib/db";

// Liste des annonces avec filtres optionnels
type SortField = 'date_scraped' | 'created_at' | 'prix';
type SortOrder = 'asc' | 'desc';

export async function getAnnonces(
  filters?: { 
    ville?: string; 
    type?: string;
    sortBy?: SortField;
    sortOrder?: SortOrder;
  }
) {
  const where: any = {};
  if (filters?.ville && filters.ville.trim().length > 0) {
    where.ville = { contains: filters.ville.trim(), mode: "insensitive" };
  }
  if (filters?.type && filters.type.trim().length > 0) {
    where.type = { equals: filters.type.trim(), mode: "insensitive" };
  }

  const sortField = filters?.sortBy || 'date_scraped';
  const sortOrder = filters?.sortOrder || 'desc';

  const annonces = await prisma.annonce.findMany({
    where,
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
      date_scraped: true,
      created_at: true
    },
    orderBy: {
      [sortField]: sortOrder,
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

// Villes et types distincts pour les filtres
export async function getFiltersData() {
  const villes = await prisma.annonce.findMany({
    distinct: ["ville"],
    select: { ville: true },
    where: { ville: { not: null } },
    orderBy: { ville: "asc" },
  });

  const types = await prisma.annonce.findMany({
    distinct: ["type"],
    select: { type: true },
    where: { type: { not: null } },
    orderBy: { type: "asc" },
  });

  return {
    villes: villes
      .map((v) => v.ville)
      .filter((v): v is string => Boolean(v && v.trim().length > 0)),
    types: types
      .map((t) => t.type)
      .filter((t): t is string => Boolean(t && t.trim().length > 0)),
  };
}
