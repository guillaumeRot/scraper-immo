"use client";

import { useEffect, useState, useCallback } from 'react';
import { getAnnonces, getFiltersData, getFavorisIds } from "../app/actions";
import ImageCarousel from "@/components/ImageCarousel";
import FavoriButton from "@/components/FavoriButton";
import Link from 'next/link';
import { useSearch } from "@/context/SearchContext";
import { useSearchParams, useRouter } from 'next/navigation';
import { isValidNumber, formatPrix } from "@/lib/formatters";

type SortOption = { value: string; label: string };

const SORT_OPTIONS: SortOption[] = [
  { value: 'created_at-desc', label: 'Plus récentes' },
  { value: 'created_at-asc', label: 'Plus anciennes' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
];

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSearchParams } = useSearch();

  const ville = searchParams.get('ville') || '';
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || 'created_at-desc';
  const [sortBy, sortOrder] = sort.split('-').slice(-2) as [string, 'asc' | 'desc'];

  useEffect(() => {
    setSearchParams({ ville, type, sort });
  }, [ville, type, sort, setSearchParams]);

  const setFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/?${params.toString()}`);
  }, [searchParams, router]);

  const [annonces, setAnnonces] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ villes: string[]; types: string[] }>({ villes: [], types: [] });
  const [favorisIds, setFavorisIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [annoncesData, filtersData, favorisData] = await Promise.all([
          getAnnonces({ ville, type, sortBy: sortBy as any, sortOrder }),
          getFiltersData(),
          getFavorisIds('vente'),
        ]);
        setAnnonces(annoncesData);
        setFilters(filtersData);
        setFavorisIds(new Set(favorisData));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ville, type, sortBy, sortOrder]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="mb-6 pl-4 border-l-4 border-indigo-500">
        <h2 className="text-2xl font-bold text-gray-900">Annonces immobilières</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {loading ? 'Chargement…' : `${annonces.length} résultat${annonces.length > 1 ? 's' : ''}`}
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
        <div className="space-y-3">
          {annonces.map((annonce: any) => (
            <AnnonceCard key={annonce.id} annonce={annonce} isFavori={favorisIds.has(annonce.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function AnnonceCard({ annonce, isFavori }: { annonce: any; isFavori: boolean }) {
  return (
    <Link
      href={`/annonce/${annonce.id}`}
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
        <FavoriButton
          annonceId={annonce.id}
          annonceType="vente"
          initialFavori={isFavori}
          wrapperClassName="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm"
        />
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        {/* Prix + ville */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-2xl font-bold text-indigo-600 leading-tight">
            {formatPrix(annonce.prix)}
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
