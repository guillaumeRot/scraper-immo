'use client';

import { useState } from 'react';

interface PrixNegocieProps {
  prixInitial: string;
  surface?: string;
}

export default function PrixNegocie({ prixInitial, surface }: PrixNegocieProps) {
  const [prixNegocie, setPrixNegocie] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const formatPrix = (prix: string) => {
    return prix.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleSave = () => {
    if (inputValue) {
      setPrixNegocie(inputValue.replace(/\D/g, ''));
    } else {
      setPrixNegocie(null);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue('');
    }
  };

  const prixAAfficher = prixNegocie || prixInitial;
  const prixAuM2 = surface && prixAAfficher 
    ? Math.round(parseInt(prixAAfficher.replace(/\D/g, '')) / parseFloat(surface))
    : null;

  const fraisNotaire = prixAAfficher 
    ? Math.round(parseInt(prixAAfficher.replace(/\D/g, '')) * 0.08)
    : 0;

  return (
    <div className="space-y-4">
      {/* Prix négocié */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Prix négocié :</span>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="w-32 px-2 py-1 border rounded"
                placeholder={formatPrix(prixInitial)}
                autoFocus
              />
              <span>€</span>
              <button
                onClick={handleSave}
                className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
              >
                OK
              </button>
            </div>
          ) : (
            <div 
              className="inline-flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
              onClick={() => {
                setInputValue(prixNegocie || prixInitial);
                setIsEditing(true);
              }}
            >
              <span className="text-indigo-600 font-medium">
                {prixNegocie ? `${formatPrix(prixNegocie)} €` : 'Définir un prix'}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                />
              </svg>
            </div>
          )}
        </div>

        {prixAuM2 && (
          <div className="text-sm text-gray-500 mt-1">
            Soit {prixAuM2.toLocaleString('fr-FR')} €/m²
            {prixNegocie && (
              <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                {Math.round((1 - parseInt(prixNegocie.replace(/\D/g, '')) / parseInt(prixInitial.replace(/\D/g, ''))) * 100)}% de réduction
              </span>
            )}
          </div>
        )}
      </div>

      {/* Frais de notaire */}
      <div className="pt-4 border-t border-gray-200 mt-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Frais de notaire (8%) :</span>
          <span className="text-lg font-semibold text-indigo-600">
            {fraisNotaire.toLocaleString('fr-FR')} €
          </span>
        </div>
        
        {/* Coût total */}
        {prixNegocie && (
          <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
            <span>Coût total :</span>
            <span className="font-medium">
              {(parseInt(prixAAfficher.replace(/\D/g, '')) + fraisNotaire).toLocaleString('fr-FR')} €
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
