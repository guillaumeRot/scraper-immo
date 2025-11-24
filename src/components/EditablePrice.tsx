'use client';

import { useState, useEffect } from 'react';
import { updateAnnoncePrix } from '@/app/actions';

interface EditablePriceProps {
  initialPrix: string;
  annonceId: string;
  surface?: string;
}

export default function EditablePrice({ initialPrix, annonceId, surface }: EditablePriceProps) {
  const [prix, setPrix] = useState(initialPrix);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatPrix = (value: string) => {
    // Supprime tous les caractères non numériques
    const numericValue = value.replace(/\D/g, '');
    // Formate avec des espaces comme séparateurs de milliers
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateAnnoncePrix(annonceId, prix);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prix:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrix(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setPrix(initialPrix);
      setIsEditing(false);
    }
  };

  return (
    <div className="text-right">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prix}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-32 px-2 py-1 border rounded text-right text-2xl font-semibold text-indigo-600"
            autoFocus
          />
          <span className="text-2xl font-semibold text-indigo-600">€</span>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 disabled:opacity-50"
          >
            {isSaving ? '...' : 'OK'}
          </button>
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <p className="text-2xl font-semibold text-indigo-600">
            {prix ? `${formatPrix(prix)} €` : 'Prix non disponible'}
          </p>
          {prix && surface && (
            <p className="text-sm text-gray-600">
              ({Math.round(parseInt(prix.replace(/\D/g, '')) / parseFloat(surface)).toLocaleString('fr-FR')} €/m²)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
