import { getAgences, getScans } from "../actions";
import ScannerForm from "../../components/ScannerForm";

export default async function ScannerPage() {
  const agences = await getAgences();
  const scans = await getScans();

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

      {/* Tableau récapitulatif des scans */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des scans</h3>
        {scans.length === 0 ? (
          <div className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
            Aucun scan effectué pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scraper
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annonces
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erreurs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scans.map((scan) => (
                  <tr key={scan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {scan.scraper}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(scan.date_scan).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        scan.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : scan.status === 'running'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {scan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scan.annonces_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scan.erreurs_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scan.duree_ms ? `${(scan.duree_ms / 1000).toFixed(2)}s` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ScannerForm agences={agences} />
    </div>
  );
}
