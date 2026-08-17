"use client";

import { useState, useTransition } from 'react';
import { toggleFavori, AnnonceType } from "@/app/actions";

interface FavoriButtonProps {
  annonceId: number;
  annonceType: AnnonceType;
  initialFavori: boolean;
  onToggle?: (favori: boolean) => void;
  /** Classes de positionnement/fond uniquement — la couleur du cœur reste gérée en interne selon l'état favori. */
  wrapperClassName?: string;
}

export default function FavoriButton({ annonceId, annonceType, initialFavori, onToggle, wrapperClassName }: FavoriButtonProps) {
  const [favori, setFavori] = useState(initialFavori);
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const optimistic = !favori;
    setFavori(optimistic);
    startTransition(async () => {
      try {
        const result = await toggleFavori(annonceId, annonceType);
        setFavori(result);
        onToggle?.(result);
      } catch (error) {
        setFavori(!optimistic);
        console.error('Erreur lors de la mise à jour du favori:', error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={favori}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-150 ${
        favori ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
      } ${wrapperClassName ?? 'bg-white/90'}`}
    >
      <svg className="w-5 h-5" fill={favori ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}
