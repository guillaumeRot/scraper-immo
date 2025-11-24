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
  const [apport, setApport] = useState('20000');
  const [isEditingApport, setIsEditingApport] = useState(false);

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
  const prixNumerique = prixAAfficher ? parseInt(prixAAfficher.replace(/\D/g, '')) : 0;
  const apportNumerique = parseInt(apport.replace(/\D/g, '')) || 0;
  
  const prixAuM2 = surface && prixAAfficher 
    ? Math.round(prixNumerique / parseFloat(surface))
    : null;

  const fraisNotaire = prixAAfficher 
    ? Math.round(prixNumerique * 0.08)
    : 0;
    
  // Fonction pour calculer la mensualité (taux annuel de 3.5%)
  const calculerMensualite = (montant: number, annees: number) => {
    const tauxMensuel = 0.035 / 12; // Taux mensuel
    const nbMensualites = annees * 12;
    
    // Formule de calcul d'une mensualité : M = C * (t*(1+t)^n) / ((1+t)^n - 1)
    const mensualite = (montant * tauxMensuel * Math.pow(1 + tauxMensuel, nbMensualites)) / 
                      (Math.pow(1 + tauxMensuel, nbMensualites) - 1);
    
    return Math.round(mensualite);
  };
  
  // Calcul de la mensualité sur 20 ans en prenant en compte l'apport
  const montantTotal = prixAAfficher ? prixNumerique + fraisNotaire - apportNumerique : 0;
  const montantEmprunte = Math.max(0, montantTotal); // On ne peut pas emprunter un montant négatif
  const mensualite20ans = montantEmprunte > 0 ? calculerMensualite(montantEmprunte, 20) : 0;

  const handleApportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApport(e.target.value.replace(/\D/g, ''));
  };

  const handleApportBlur = () => {
    setIsEditingApport(false);
  };

  const handleApportKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditingApport(false);
    } else if (e.key === 'Escape') {
      setIsEditingApport(false);
      setApport('20000');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {Math.round((1 - prixNumerique / parseInt(prixInitial.replace(/\D/g, ''))) * 100)}% de réduction
              </span>
            )}
          </div>
        )}
      </div>

      {/* Apport */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Apport :</span>
          {isEditingApport ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={apport}
                onChange={handleApportChange}
                onKeyDown={handleApportKeyDown}
                onBlur={handleApportBlur}
                className="w-32 px-2 py-1 border rounded"
                autoFocus
              />
              <span>€</span>
            </div>
          ) : (
            <div 
              className="inline-flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
              onClick={() => setIsEditingApport(true)}
            >
              <span className="text-indigo-600 font-medium">
                {parseInt(apport).toLocaleString('fr-FR')} €
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
      </div>
    </div>

    {/* Frais de notaire et coût total */}
    <div className="pt-4 border-t border-gray-200">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Frais de notaire (8%) :</span>
          <span className="text-lg font-semibold text-indigo-600">
            {fraisNotaire.toLocaleString('fr-FR')} €
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Apport :</span>
          <span className="font-medium">
            {apportNumerique.toLocaleString('fr-FR')} €
          </span>
        </div>
        
        {prixNegocie && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center font-medium">
            <span>Montant à financer :</span>
            <span className="text-lg text-indigo-600">
              {montantEmprunte.toLocaleString('fr-FR')} €
            </span>
          </div>
        )}
      </div>

      {/* Mensualité sur 20 ans */}
      <div className="pt-4 border-t border-gray-200 mt-4">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-medium text-gray-700">Mensualité (20 ans à 3.5%)</h4>
                <p className="text-xs text-gray-500">Montant à financer sur 240 mois</p>
              </div>
              <span className="text-lg font-semibold text-indigo-600">
                {mensualite20ans.toLocaleString('fr-FR')} €/mois
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Mensualité + assurance</h4>
                <p className="text-xs text-gray-500">Mensualité + 50€ d'assurance</p>
              </div>
              <span className="text-lg font-semibold text-indigo-600">
                {(mensualite20ans + 50).toLocaleString('fr-FR')} €/mois
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
