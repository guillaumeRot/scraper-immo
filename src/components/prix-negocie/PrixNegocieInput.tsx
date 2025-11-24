import { useState, KeyboardEvent } from 'react';

interface PrixNegocieInputProps {
  prixInitial: string;
  onPrixChange: (prix: string | null) => void;
  prixNegocie: string | null;
  prixNumerique: number;
  prixAuM2: number | null;
  surface?: string;
}

export function PrixNegocieInput({ 
  prixInitial, 
  onPrixChange, 
  prixNegocie, 
  prixNumerique, 
  prixAuM2,
  surface 
}: PrixNegocieInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const formatPrix = (prix: string) => {
    return prix.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleSave = () => {
    if (inputValue) {
      onPrixChange(inputValue.replace(/\D/g, ''));
    } else {
      onPrixChange(null);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue('');
    }
  };

  const prixAAfficher = prixNegocie || prixInitial;

  return (
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
              className="w-32 px-2 py-1 border rounded text-right"
              placeholder={prixAAfficher}
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
              setInputValue(prixAAfficher);
              setIsEditing(true);
            }}
          >
            <span className="text-md text-indigo-700">
              {parseInt(prixAAfficher.replace(/\D/g, '')).toLocaleString('fr-FR')} €
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
              {Math.round((1 - prixNumerique / parseInt(prixInitial.replace(/\D/g, ''))) * 100)}% de réduction
            </span>
          )}
        </div>
      )}
    </div>
  );
}
