"use client";

import { useEffect, useState, useCallback } from 'react';
import { getAnnoncesLocation, getFiltersDataLocation } from "../app/actions";
import ImageCarousel from "@/components/ImageCarousel";
import Link from 'next/link';
import { useSearch } from "@/context/SearchContext";
import { useSearchParams, useRouter } from 'next/navigation';

type SortOption = { value: string; label: string };

const SORT_OPTIONS: SortOption[] = [
  { value: 'created_at-desc', label: 'Plus récentes' },
  { value: 'created_at-asc', label: 'Plus anciennes' },
  { value: 'loyer-asc', label: 'Loyer croissant' },
  { value: 'loyer-desc', label: 'Loyer décroissant' },
];

export default function Locations() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSearchParams } = useSearch();

  const ville = searchParams.get('ville') || '';
  const type = searchParams.get('type') || '';
  const agence = searchParams.get('agence') || '';
  const sort = searchParams.get('sort') || 'created_at-desc';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const [sortBy, sortOrder] = sort.split('-').slice(-2) as [string, 'asc' | 'desc'];

  useEffect(() => {
    setSearchParams({ ville, type, agence, sort, page: String(page) });
  }, [ville, type, agence, sort, page, setSearchParams]);

  // Change un filtre et revient à la première page
  const setFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/locations?${params.toString()}`);
  }, [searchParams, router]);

  const goToPage = useCallback((targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage > 1) params.set('page', String(targetPage));
    else params.delete('page');
    router.push(`/locations?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, router]);

  const [annonces, setAnnonces] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<{ villes: string[]; types: string[]; agences: string[] }>({ villes: [], types: [], agences: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [annoncesData, filtersData] = await Promise.all([
          getAnnoncesLocation({ ville, type, agence, sortBy: sortBy as any, sortOrder, page }),
          getFiltersDataLocation(),
        ]);
        setAnnonces(annoncesData.annonces);
        setTotal(annoncesData.total);
        setTotalPages(annoncesData.totalPages);
        setFilters(filtersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ville, type, agence, sortBy, sortOrder, page]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="mb-6 pl-4 border-l-4 border-indigo-500">
        <h2 className="text-2xl font-bold text-gray-900">Annonces de location</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {loading ? 'Chargement…' : `${total} résultat${total > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filtres chips */}
      <div className="mb-8 space-y-3">
        {/* Villes */}
        {filters.villes.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-gray-400 w-14 flex-shrink-0">Ville</span>
            <Chip label="Toutes" active={!ville} onClick={() => setFilter('ville', '')} />
            {filters.villes.map((v) => (
              <Chip key={v} label={v} active={ville === v} onClick={() => setFilter('ville', v)} />
            ))}
          </div>
        )}

        {/* Types */}
        {filters.types.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-gray-400 w-14 flex-shrink-0">Type</span>
            <Chip label="Tous" active={!type} onClick={() => setFilter('type', '')} />
            {filters.types.map((t) => (
              <Chip key={t} label={t} active={type === t} onClick={() => setFilter('type', t)} />
            ))}
          </div>
        )}

        {/* Agences */}
        {filters.agences.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-gray-400 w-14 flex-shrink-0">Agence</span>
            <Chip label="Toutes" active={!agence} onClick={() => setFilter('agence', '')} />
            {filters.agences.map((a) => (
              <Chip key={a} label={a} active={agence === a} onClick={() => setFilter('agence', a)} />
            ))}
          </div>
        )}

        {/* Tri */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-400 w-14 flex-shrink-0">Tri</span>
          {SORT_OPTIONS.map((o) => (
            <Chip key={o.value} label={o.label} active={sort === o.value} onClick={() => setFilter('sort', o.value)} />
          ))}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl bg-white border border-gray-100 p-3 animate-pulse">
              <div className="w-44 h-32 rounded-xl bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-3.5 bg-gray-100 rounded-full w-1/3" />
                <div className="h-5 bg-gray-100 rounded-full w-2/3" />
                <div className="h-3.5 bg-gray-100 rounded-full w-1/2" />
                <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : annonces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-base font-medium text-gray-400">Aucune annonce</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {annonces.map((annonce: any) => (
              <AnnonceLocationCard key={annonce.id} annonce={annonce} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          )}
        </>
      )}
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-full px-3.5 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:cursor-not-allowed transition-all duration-150"
      >
        Précédent
      </button>
      <span className="text-sm text-gray-500 px-2">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-full px-3.5 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:cursor-not-allowed transition-all duration-150"
      >
        Suivant
      </button>
    </div>
  );
}

function AnnonceLocationCard({ annonce }: { annonce: any }) {
  return (
    <Link
      href={`/location/${annonce.id}`}
      className="flex gap-5 rounded-2xl bg-white border border-gray-100 p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-150 group"
    >
      {/* Image */}
      <div className="relative w-96 h-72 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        <ImageCarousel images={annonce.photos || []} />
        {annonce.type && (
          <span className="absolute top-2 left-2 z-10 rounded-md bg-black/50 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
            {annonce.type}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        {/* Loyer + ville */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-2xl font-bold text-indigo-600 leading-tight">
            {formatLoyer(annonce.loyer, annonce.charges)}
          </span>
          {annonce.ville && (
            <span className="flex items-center gap-1 text-sm font-medium text-gray-500 flex-shrink-0 mt-1">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {annonce.ville}
            </span>
          )}
        </div>

        {/* Pièces + surface */}
        {(isValidNumber(annonce.pieces) || isValidNumber(annonce.surface)) && (
          <div className="flex items-center gap-2 mb-3">
            {isValidNumber(annonce.pieces) && (
              <span className="inline-flex items-center rounded-md bg-violet-50 px-2.5 py-1 text-sm font-semibold text-violet-700">
                {annonce.pieces} pièce{annonce.pieces > 1 ? 's' : ''}
              </span>
            )}
            {isValidNumber(annonce.surface) && (
              <span className="inline-flex items-center rounded-md bg-sky-50 px-2.5 py-1 text-sm font-semibold text-sky-700">
                {annonce.surface} m²
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {annonce.description && (
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed flex-1">
            {annonce.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          {annonce.agence && (
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700 truncate">
              {annonce.agence}
            </span>
          )}
          {annonce.created_at && (
            <span className="text-sm text-gray-400 flex-shrink-0 ml-auto">
              {new Date(annonce.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
      }`}
    >
      {label}
    </button>
  );
}

function isValidNumber(value: unknown) {
  return typeof value === 'number' && !Number.isNaN(value);
}

function formatMontant(value: any) {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (typeof value === 'string') {
    const numeric = Number(value.replace(/[^0-9]/g, ''));
    if (!Number.isNaN(numeric)) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(numeric);
    }
  }
  return null;
}

function formatLoyer(loyer: any, charges: any) {
  const loyerFormate = formatMontant(loyer);
  if (!loyerFormate) return 'Loyer ND';
  const chargesFormate = formatMontant(charges);
  return chargesFormate ? `${loyerFormate}/mois + ${chargesFormate} charges` : `${loyerFormate}/mois`;
}
