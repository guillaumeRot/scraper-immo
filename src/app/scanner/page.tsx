import { getAgences, getScans } from "../actions";
import ScannerForm from "../../components/ScannerForm";
import ScannerHistory from '../../components/ScannerHistory';

export default async function ScannerPage() {
  const agences = await getAgences();
  const initialScans = await getScans();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          Scanner immobilier
        </h2>
        <p className="text-gray-600 mt-1">
          Lancez manuellement le scraper pour une agence spécifique ou pour toutes les agences.
        </p>
      </div>

      {/* Composant d'historique avec rafraîchissement automatique */}
      <ScannerHistory initialScans={initialScans} />

      <ScannerForm agences={agences} />
    </div>
  );
}
