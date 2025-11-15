import { getAgences } from "../actions";
import ScannerForm from "../../components/ScannerForm";

export default async function ScannerPage() {
  const agences = await getAgences();

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

      <ScannerForm agences={agences} />
    </div>
  );
}
