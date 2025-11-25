interface MensualiteProps {
  mensualite: number;
  taux: number;
  apport: string;
  prixNegocie: string | null;
  fraisNotaire: number;
  loyerMensuel: string;
}

export function Mensualite({ mensualite, taux, apport, prixNegocie, fraisNotaire, loyerMensuel }: MensualiteProps) {
  const apportNumerique = parseInt(apport.replace(/\D/g, '')) || 0;
  const prixNumerique = prixNegocie ? parseInt(prixNegocie.replace(/\D/g, '')) : 0;
  const montantEmprunte = Math.max(0, (prixNumerique + fraisNotaire) - apportNumerique);

  return (
    <div className="pt-4 border-t border-gray-200 mt-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Mensualité sur 20 ans :</span>
          <span className="text-lg font-semibold text-indigo-600">
            {mensualite.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </span>
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Taux d'intérêt : {taux}%</p>
          <p>Montant emprunté : {montantEmprunte.toLocaleString('fr-FR')} €</p>
          <p>Durée : 20 ans (240 mois)</p>
          {loyerMensuel && (
            <div className="text-base pt-2 mt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Loyer ≥ 120% mensualité:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  parseFloat(loyerMensuel.replace(/\s+/g, '').replace(',', '.')) >= mensualite * 1.2
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {parseFloat(loyerMensuel.replace(/\s+/g, '').replace(',', '.')) >= mensualite * 1.2 ? 'OUI' : 'NON'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
