interface FraisNotaireProps {
  fraisNotaire: number;
  coutTotal: number;
}

export function FraisNotaire({ fraisNotaire, coutTotal }: FraisNotaireProps) {
  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Frais de notaire (8%) :</span>
          <span className="text-lg font-semibold text-indigo-600">
            {fraisNotaire.toLocaleString('fr-FR')} €
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="font-medium">Coût total :</span>
          <span className="text-xl font-bold text-indigo-700">
            {coutTotal.toLocaleString('fr-FR')} €
          </span>
        </div>
      </div>
    </div>
  );
}
