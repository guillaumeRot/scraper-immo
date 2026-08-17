"use client";

import { useState, useTransition } from 'react';
import { toggleContacte, AnnonceType } from "@/app/actions";

interface ContacteButtonProps {
  annonceId: number;
  annonceType: AnnonceType;
  initialContacte: boolean;
}

export default function ContacteButton({ annonceId, annonceType, initialContacte }: ContacteButtonProps) {
  const [contacte, setContacte] = useState(initialContacte);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const optimistic = !contacte;
    setContacte(optimistic);
    startTransition(async () => {
      try {
        const result = await toggleContacte(annonceId, annonceType);
        if (result !== null) setContacte(result);
      } catch (error) {
        setContacte(!optimistic);
        console.error('Erreur lors de la mise à jour du statut de contact:', error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={contacte}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
        contacte
          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {contacte ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        )}
      </svg>
      {contacte ? 'Déjà contacté' : 'Pas encore contacté'}
    </button>
  );
}
