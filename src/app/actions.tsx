"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

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

// Construit la clause WHERE (ville/type/agence) réutilisée par les requêtes brutes de location
function buildLocationFilterSql(filters?: { ville?: string; type?: string; agence?: string }) {
  const conditions: Prisma.Sql[] = [];
  if (filters?.ville && filters.ville.trim().length > 0) {
    conditions.push(Prisma.sql`ville ILIKE ${'%' + filters.ville.trim() + '%'}`);
  }
  if (filters?.type && filters.type.trim().length > 0) {
    conditions.push(Prisma.sql`type ILIKE ${filters.type.trim()}`);
  }
  if (filters?.agence && filters.agence.trim().length > 0) {
    conditions.push(Prisma.sql`agence ILIKE ${filters.agence.trim()}`);
  }
  return conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty;
}

// Un même bien est souvent publié par plusieurs agences/sites : on ne garde qu'une
// occurrence par groupe (ville + pieces + surface + loyer normalisés), en conservant
// la plus récente. Les annonces avec un champ manquant ne sont jamais fusionnées entre elles.
function buildLocationDedupCte(filters?: { ville?: string; type?: string; agence?: string }) {
  const filterSql = buildLocationFilterSql(filters);
  return Prisma.sql`
    WITH normalized AS (
      SELECT *,
        NULLIF(lower(trim(ville)), '') AS n_ville,
        NULLIF(regexp_replace(pieces, '[^0-9.]', '', 'g'), '')::numeric AS n_pieces,
        NULLIF(regexp_replace(surface, '[^0-9.]', '', 'g'), '')::numeric AS n_surface,
        NULLIF(regexp_replace(loyer, '[^0-9.]', '', 'g'), '')::numeric AS n_loyer
      FROM "AnnonceLocation"
      ${filterSql}
    ),
    keyed AS (
      SELECT *,
        CASE WHEN n_ville IS NOT NULL AND n_pieces IS NOT NULL AND n_surface IS NOT NULL AND n_loyer IS NOT NULL
          THEN n_ville || '|' || n_pieces || '|' || n_surface || '|' || n_loyer
          ELSE 'id:' || id::text
        END AS dedup_key
      FROM normalized
    ),
    grouped AS (
      SELECT DISTINCT ON (dedup_key) *
      FROM keyed
      ORDER BY dedup_key, date_scraped DESC
    )
    SELECT id, type, loyer, charges, ville, pieces, surface, lien, agence, description, photos, date_scraped, created_at
    FROM grouped
  `;
}

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
  const sortOrder = filters?.sortOrder || 'desc';
  const page = filters?.page && filters.page > 0 ? filters.page : 1;
  const offset = (page - 1) * LOCATIONS_PAGE_SIZE;

  const dedupCte = buildLocationDedupCte(filters);
  const orderSql = filters?.sortBy === 'loyer'
    ? Prisma.sql`NULLIF(regexp_replace(loyer, '[^0-9.]', '', 'g'), '')::numeric ${Prisma.raw(sortOrder === 'asc' ? 'ASC' : 'DESC')} NULLS LAST`
    : Prisma.sql`created_at ${Prisma.raw(sortOrder === 'asc' ? 'ASC' : 'DESC')}`;

  const [annonces, countResult] = await Promise.all([
    prisma.$queryRaw<Array<{
      id: number; type: string | null; loyer: string | null; charges: string | null;
      ville: string | null; pieces: string | null; surface: string | null; lien: string;
      agence: string; description: string | null; photos: unknown; date_scraped: Date; created_at: Date;
    }>>(Prisma.sql`${dedupCte} ORDER BY ${orderSql} LIMIT ${LOCATIONS_PAGE_SIZE} OFFSET ${offset}`),
    prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`SELECT COUNT(*)::bigint AS count FROM (${dedupCte}) AS deduped`),
  ]);

  const total = Number(countResult[0]?.count ?? 0);

  return {
    annonces,
    total,
    page,
    pageSize: LOCATIONS_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / LOCATIONS_PAGE_SIZE)),
  };
}

// Autres annonces correspondant au même bien (ville + pieces + surface + loyer identiques),
// pour afficher sur la fiche détail les différentes agences/sites qui la publient.
export async function getAnnoncesLocationSimilaires(id: string) {
  const targetId = parseInt(id);
  const target = await prisma.annonceLocation.findUnique({
    where: { id: targetId },
    select: { ville: true, pieces: true, surface: true, loyer: true },
  });
  if (!target) return [];

  const villeNorm = target.ville?.trim().toLowerCase() || null;
  const piecesNorm = target.pieces ? Number(target.pieces.replace(/[^0-9.]/g, '')) : NaN;
  const surfaceNorm = target.surface ? Number(target.surface.replace(/[^0-9.]/g, '')) : NaN;
  const loyerNorm = target.loyer ? Number(target.loyer.replace(/[^0-9.]/g, '')) : NaN;

  if (!villeNorm || Number.isNaN(piecesNorm) || Number.isNaN(surfaceNorm) || Number.isNaN(loyerNorm)) {
    return [];
  }

  const autresSources = await prisma.$queryRaw<Array<{
    id: number; agence: string; lien: string; date_scraped: Date;
  }>>(Prisma.sql`
    SELECT id, agence, lien, date_scraped
    FROM "AnnonceLocation"
    WHERE id != ${targetId}
      AND lower(trim(ville)) = ${villeNorm}
      AND NULLIF(regexp_replace(pieces, '[^0-9.]', '', 'g'), '')::numeric = ${piecesNorm}
      AND NULLIF(regexp_replace(surface, '[^0-9.]', '', 'g'), '')::numeric = ${surfaceNorm}
      AND NULLIF(regexp_replace(loyer, '[^0-9.]', '', 'g'), '')::numeric = ${loyerNorm}
    ORDER BY date_scraped DESC
  `);

  return autresSources;
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

// Favoris (annonces de vente et de location confondues)
export type AnnonceType = 'vente' | 'location';

export async function toggleFavori(annonceId: number, annonceType: AnnonceType) {
  const existing = await prisma.favori.findUnique({
    where: { annonceId_annonceType: { annonceId, annonceType } },
  });
  if (existing) {
    await prisma.favori.delete({ where: { id: existing.id } });
    return false;
  }
  await prisma.favori.create({ data: { annonceId, annonceType } });
  return true;
}

// Statut favori + contact d'une annonce (pour les pages détail)
export async function getFavoriStatus(annonceId: number, annonceType: AnnonceType) {
  const favori = await prisma.favori.findUnique({
    where: { annonceId_annonceType: { annonceId, annonceType } },
  });
  return { favori: !!favori, contacte: favori?.contacte ?? false };
}

// Bascule le statut "déjà contacté", uniquement possible si l'annonce est en favori
export async function toggleContacte(annonceId: number, annonceType: AnnonceType) {
  const existing = await prisma.favori.findUnique({
    where: { annonceId_annonceType: { annonceId, annonceType } },
  });
  if (!existing) return null;
  const updated = await prisma.favori.update({
    where: { id: existing.id },
    data: { contacte: !existing.contacte },
  });
  return updated.contacte;
}

// Ids favoris d'un type donné (pour marquer les cœurs sur les pages liste)
export async function getFavorisIds(annonceType: AnnonceType) {
  const favoris = await prisma.favori.findMany({
    where: { annonceType },
    select: { annonceId: true },
  });
  return favoris.map((f) => f.annonceId);
}

// Liste complète des favoris (ventes + locations), triée par date d'ajout
export async function getFavoris() {
  const favoris = await prisma.favori.findMany({ orderBy: { created_at: "desc" } });
  if (favoris.length === 0) return [];

  const venteIds = favoris.filter((f) => f.annonceType === 'vente').map((f) => f.annonceId);
  const locationIds = favoris.filter((f) => f.annonceType === 'location').map((f) => f.annonceId);

  const [ventes, locations] = await Promise.all([
    venteIds.length > 0
      ? prisma.annonce.findMany({
          where: { id: { in: venteIds } },
          select: {
            id: true, type: true, prix: true, ville: true, pieces: true,
            surface: true, lien: true, agence: true, photos: true,
          },
        })
      : Promise.resolve([]),
    locationIds.length > 0
      ? prisma.annonceLocation.findMany({
          where: { id: { in: locationIds } },
          select: {
            id: true, type: true, loyer: true, charges: true, ville: true, pieces: true,
            surface: true, lien: true, agence: true, photos: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const favoriByKey = new Map(favoris.map((f) => [`${f.annonceType}-${f.annonceId}`, f]));

  const merged = [
    ...ventes.map((a) => ({ ...a, annonceType: 'vente' as const, ...pickFavoriMeta(favoriByKey, 'vente', a.id) })),
    ...locations.map((a) => ({ ...a, annonceType: 'location' as const, ...pickFavoriMeta(favoriByKey, 'location', a.id) })),
  ];

  merged.sort((a, b) => b.favoriDate.getTime() - a.favoriDate.getTime());
  return merged;
}

function pickFavoriMeta(favoriByKey: Map<string, { created_at: Date; contacte: boolean }>, type: AnnonceType, id: number) {
  const favori = favoriByKey.get(`${type}-${id}`)!;
  return { favoriDate: favori.created_at, contacte: favori.contacte };
}

// Réglages d'alertes mail (lus par les crons externes "send-notifications-ventes"/"send-notifications-locations")
export type TypeTransaction = 'vente' | 'location';
export type VilleNotification = {
  villeId: number;
  nom: string;
  codePostal: string;
  vente: boolean;
  location: boolean;
};

// Villes actives, utilisées notamment pour peupler les filtres de la page DPE
export async function getVillesActives(): Promise<string[]> {
  const villes = await prisma.villes.findMany({
    where: { actif: { not: false } },
    orderBy: { nom: "asc" },
  });

  return villes.map((v) => v.nom);
}

export async function getNotificationPreferences(): Promise<VilleNotification[]> {
  const villes = await prisma.villes.findMany({
    where: { actif: { not: false } },
    orderBy: { nom: "asc" },
    include: { notifications: true },
  });

  return villes.map((v) => ({
    villeId: v.id,
    nom: v.nom,
    codePostal: v.code_postal,
    vente: v.notifications.find((n) => n.type_transaction === 'vente')?.actif ?? false,
    location: v.notifications.find((n) => n.type_transaction === 'location')?.actif ?? false,
  }));
}

export async function updateNotificationPreference(villeId: number, typeTransaction: TypeTransaction, actif: boolean) {
  await prisma.notificationPreferences.upsert({
    where: { ville_id_type_transaction: { ville_id: villeId, type_transaction: typeTransaction } },
    create: { ville_id: villeId, type_transaction: typeTransaction, actif },
    update: { actif },
  });
}
