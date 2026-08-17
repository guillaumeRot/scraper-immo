"use client";

import { useEffect, useState } from 'react';
import { getFavoris } from "../app/actions";
import ImageCarousel from "@/components/ImageCarousel";
import FavoriButton from "@/components/FavoriButton";
import Link from 'next/link';
import { isValidNumber, formatPrix, formatLoyer } from "@/lib/formatters";

export default function Favoris() {
  const [favoris, setFavoris] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getFavoris();
        setFavoris(data);
      } catch (error) {
        console.error('Error fetching favoris:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemove = (annonceType: string, id: number) => {
    setFavoris((prev) => prev.filter((a) => !(a.annonceType === annonceType && a.id === id)));
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* En-tête */}
      <div className="mb-6 pl-4 border-l-4 border-indigo-500">
        <h2 className="text-2xl font-bold text-gray-900">Favoris</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {loading ? 'Chargement…' : `${favoris.length} annonce${favoris.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
      ) : favoris.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p className="text-base font-medium text-gray-400">Aucun favori pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favoris.map((annonce) => (
            <FavoriCard
              key={`${annonce.annonceType}-${annonce.id}`}
              annonce={annonce}
              onRemove={() => handleRemove(annonce.annonceType, annonce.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FavoriCard({ annonce, onRemove }: { annonce: any; onRemove: () => void }) {
  const isLocation = annonce.annonceType === 'location';
  const href = isLocation ? `/location/${annonce.id}` : `/annonce/${annonce.id}`;
  const montant = isLocation ? formatLoyer(annonce.loyer, annonce.charges) : formatPrix(annonce.prix);

  return (
    <Link
      href={href}
      className="flex gap-5 rounded-2xl bg-white border border-gray-100 p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-150 group"
    >
      {/* Image */}
      <div className="relative w-96 h-72 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        <ImageCarousel images={annonce.photos || []} />
        <span className="absolute top-2 left-2 z-10 rounded-md bg-black/50 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
          {isLocation ? 'Location' : 'Vente'}
        </span>
        <FavoriButton
          annonceId={annonce.id}
          annonceType={annonce.annonceType}
          initialFavori={true}
          onToggle={(favori) => { if (!favori) onRemove(); }}
          wrapperClassName="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm"
        />
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        {/* Montant + ville */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-2xl font-bold text-indigo-600 leading-tight">
            {montant}
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

        {/* Footer */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          {annonce.agence && (
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700 truncate">
              {annonce.agence}
            </span>
          )}
          <span className={`rounded-md px-2.5 py-1 text-sm font-medium ${
            annonce.contacte ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {annonce.contacte ? 'Contacté' : 'Pas encore contacté'}
          </span>
        </div>
      </div>
    </Link>
  );
}
