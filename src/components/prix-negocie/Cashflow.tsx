import { formatNumber } from '@/lib/utils';

interface CashflowProps {
  loyerMensuel: string;
  impotFoncier: number;
  mensualite: number;
}

export function Cashflow({ loyerMensuel, impotFoncier, mensualite }: CashflowProps) {
  const loyerNumerique = parseFloat(loyerMensuel.replace(/\s+/g, '').replace(',', '.')) || 0;
  const impotMensuel = impotFoncier / 12;
  const cashflow = loyerNumerique - impotMensuel - mensualite;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Cashflow mensuel</h3>
      <div className="text-2xl font-bold">
        {formatNumber(cashflow)} €
      </div>
      <div className="text-sm text-gray-500 mt-1">
        <div>Loyer: +{formatNumber(loyerNumerique)} €</div>
        <div>Impôt foncier: -{formatNumber(impotMensuel)} €/mois</div>
        <div>Mensualité: -{formatNumber(mensualite)} €</div>
      </div>
    </div>
  );
}
