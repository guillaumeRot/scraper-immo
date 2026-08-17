"use server";

import { prisma } from "@/lib/db";

// Liste des annonces avec filtres optionnels
type SortField = 'created_at' | 'prix';
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

// Liste des annonces de location avec filtres optionnels
type SortFieldLocation = 'created_at' | 'loyer';
const LOCATIONS_PAGE_SIZE = 50;

export async function getAnnoncesLocation(
  filters?: {
    ville?: string;
    type?: string;
    agence?: string;
    sortBy?: SortFieldLocation;
    sortOrder?: SortOrder;
    page?: number;
  }
) {
  const where: any = {};
  if (filters?.ville && filters.ville.trim().length > 0) {
    where.ville = { contains: filters.ville.trim(), mode: "insensitive" };
  }
  if (filters?.type && filters.type.trim().length > 0) {
    where.type = { equals: filters.type.trim(), mode: "insensitive" };
  }
  if (filters?.agence && filters.agence.trim().length > 0) {
    where.agence = { equals: filters.agence.trim(), mode: "insensitive" };
  }

  const sortField = filters?.sortBy || 'date_scraped';
  const sortOrder = filters?.sortOrder || 'desc';
  const page = filters?.page && filters.page > 0 ? filters.page : 1;

  const [annonces, total] = await Promise.all([
    prisma.annonceLocation.findMany({
      where,
      select: {
        id: true,
        type: true,
        loyer: true,
        charges: true,
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
      skip: (page - 1) * LOCATIONS_PAGE_SIZE,
      take: LOCATIONS_PAGE_SIZE,
    }),
    prisma.annonceLocation.count({ where }),
  ]);

  return {
    annonces,
    total,
    page,
    pageSize: LOCATIONS_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / LOCATIONS_PAGE_SIZE)),
  };
}

// Récupérer une annonce de location par id
export async function getAnnonceLocationById(id: string) {
  const annonce = await prisma.annonceLocation.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      type: true,
      loyer: true,
      charges: true,
      ville: true,
      pieces: true,
      surface: true,
      lien: true,
      agence: true,
      description: true,
      photos: true,
      dpe: true,
      ges: true,
    },
  });
  return annonce;
}

// Villes, types et agences distincts pour les filtres de location
export async function getFiltersDataLocation() {
  const villes = await prisma.annonceLocation.findMany({
    distinct: ["ville"],
    select: { ville: true },
    where: { ville: { not: null } },
    orderBy: { ville: "asc" },
  });

  const types = await prisma.annonceLocation.findMany({
    distinct: ["type"],
    select: { type: true },
    where: { type: { not: null } },
    orderBy: { type: "asc" },
  });

  const agences = await prisma.annonceLocation.findMany({
    distinct: ["agence"],
    select: { agence: true },
    where: { agence: { not: "" } },
    orderBy: { agence: "asc" },
  });

  return {
    villes: villes
      .map((v) => v.ville)
      .filter((v): v is string => Boolean(v && v.trim().length > 0)),
    types: types
      .map((t) => t.type)
      .filter((t): t is string => Boolean(t && t.trim().length > 0)),
    agences: agences
      .map((a) => a.agence)
      .filter((a): a is string => Boolean(a && a.trim().length > 0)),
  };
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
      dpe: true,
      ges: true,
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

// Agences distinctes pour le scanner
export async function getAgences() {
  const agences = await prisma.annonce.findMany({
    distinct: ["agence"],
    select: { agence: true },
    where: { agence: { not: "" } },
    orderBy: { agence: "asc" },
  });

  return agences
    .map((a) => a.agence)
    .filter((a): a is string => Boolean(a && a.trim().length > 0));
}

// Récupérer tous les scans
export async function getScans() {
  const scans = await prisma.scan.findMany({
    orderBy: { date_scan: "desc" },
  });
  return scans;
}
