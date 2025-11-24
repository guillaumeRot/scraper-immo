import { useState, KeyboardEvent } from 'react';

interface LoyerEstimeProps {
  loyerMensuel: string;
  onLoyerChange: (value: string) => void;
  prixNegocie: string | null;
}

export function LoyerEstime({ loyerMensuel, onLoyerChange, prixNegocie }: LoyerEstimeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    if (inputValue) {
      onLoyerChange(inputValue.replace(/\D/g, ''));
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

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <span className="font-medium">Loyer estimé :</span>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="w-24 px-2 py-1 border rounded text-right"
              placeholder={loyerMensuel || '0'}
              autoFocus
            />
            <span>€/mois</span>
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
              setInputValue(loyerMensuel);
              setIsEditing(true);
            }}
          >
            <span className="text-indigo-600 font-medium">
              {loyerMensuel ? `${parseInt(loyerMensuel).toLocaleString('fr-FR')} €/mois` : 'Définir'}
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
      {loyerMensuel && prixNegocie && (
        <p className="text-xs text-gray-500 mt-1">
          Rendement brut: {((parseInt(loyerMensuel) * 12 / parseInt(prixNegocie.replace(/\D/g, ''))) * 100).toFixed(2)}%
        </p>
      )}
    </div>
  );
}
