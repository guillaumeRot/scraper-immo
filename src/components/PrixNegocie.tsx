'use client';

import { useState } from 'react';
import { PrixNegocieInput } from './prix-negocie/PrixNegocieInput';
import { LoyerEstime } from './prix-negocie/LoyerEstime';
import { ApportInput } from './prix-negocie/ApportInput';
import { FraisNotaire } from './prix-negocie/FraisNotaire';
import { Mensualite } from './prix-negocie/Mensualite';
import { ImpotFoncier } from './prix-negocie/ImpotFoncier';

interface PrixNegocieProps {
  prixInitial: string;
  surface?: string;
}

export default function PrixNegocie({ prixInitial, surface }: PrixNegocieProps) {
  const [prixNegocie, setPrixNegocie] = useState<string | null>(null);
  const [apport, setApport] = useState('20000');
  const [loyerMensuel, setLoyerMensuel] = useState('');
  const [impotFoncier, setImpotFoncier] = useState('1000');

  // Calcul des valeurs dérivées
  const prixAAfficher = prixNegocie || prixInitial;
  const prixNumerique = prixAAfficher ? parseInt(prixAAfficher.replace(/\D/g, '')) : 0;
  const apportNumerique = parseInt(apport.replace(/\D/g, '')) || 0;
  
  const prixAuM2 = surface && prixAAfficher 
    ? Math.round(prixNumerique / parseFloat(surface))
    : null;

  const fraisNotaire = prixAAfficher 
    ? Math.round(prixNumerique * 0.08)
    : 0;

  const coutTotal = prixAAfficher 
    ? prixNumerique + fraisNotaire - apportNumerique
    : 0;

  // Calcul du taux d'intérêt (exemple: 3.5%)
  const tauxInteret = 3.5;
  const tauxMensuel = tauxInteret / 100 / 12;
  const dureeAnnees = 20;
  const nbMensualites = dureeAnnees * 12;
  
  const montantEmprunte = Math.max(0, prixNumerique - apportNumerique);
  
  const mensualite = montantEmprunte > 0
    ? (montantEmprunte * tauxMensuel * Math.pow(1 + tauxMensuel, nbMensualites)) / 
      (Math.pow(1 + tauxMensuel, nbMensualites) - 1)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prix négocié */}
        <PrixNegocieInput 
          prixInitial={prixInitial}
          onPrixChange={setPrixNegocie}
          prixNegocie={prixNegocie}
          prixNumerique={prixNumerique}
          prixAuM2={prixAuM2}
          surface={surface}
        />
        {/* Apport */}
        <ApportInput 
          apport={apport}
          onApportChange={setApport}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Loyer estimé */}
        <LoyerEstime 
          loyerMensuel={loyerMensuel}
          onLoyerChange={setLoyerMensuel}
          prixNegocie={prixAAfficher}
        />
        {/* Impôt foncier */}
        <ImpotFoncier 
          montant={impotFoncier}
          onMontantChange={setImpotFoncier}
        />
      </div>

      {/* Frais de notaire et coût total */}
      <FraisNotaire 
        fraisNotaire={fraisNotaire}
        coutTotal={coutTotal}
      />

      {/* Mensualité sur 20 ans */}
      <Mensualite 
        mensualite={mensualite}
        taux={tauxInteret}
        apport={apport}
        prixNegocie={prixAAfficher}
        fraisNotaire={fraisNotaire}
      />
    </div>
  );
}
