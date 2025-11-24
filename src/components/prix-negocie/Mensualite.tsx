interface MensualiteProps {
  mensualite: number;
  taux: number;
  apport: string;
  prixNegocie: string | null;
}

export function Mensualite({ mensualite, taux, apport, prixNegocie }: MensualiteProps) {
  const apportNumerique = parseInt(apport.replace(/\D/g, '')) || 0;
  const prixNumerique = prixNegocie ? parseInt(prixNegocie.replace(/\D/g, '')) : 0;
  const montantEmprunte = prixNumerique - apportNumerique;

  return (
    <div className="pt-4 border-t border-gray-200 mt-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Mensualité sur 20 ans :</span>
          <span className="text-lg font-semibold text-indigo-600">
            {mensualite.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="text-xs text-gray-500">
          <p>Taux d'intérêt : {taux}%</p>
          <p>Montant emprunté : {montantEmprunte.toLocaleString('fr-FR')} €</p>
          <p>Durée : 20 ans (240 mois)</p>
        </div>
      </div>
    </div>
  );
}
