import { DpeData } from './types';

export default async function DpePage() {
  const response = await fetch(
    'https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?draft=false&size=20&truncate=50&sort=-date_derniere_modification_dpe&nom_commune_ban_in=%22Vitr%C3%A9%22,%22Ch%C3%A2teaugiron%22&finalizedAt=2025-11-26T23:10:29.169Z'
  );
  const data = await response.json();
  const dpeData: DpeData[] = data.results;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Données DPE</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de bâtiment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface (m²)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe DPE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GES</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date DPE</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dpeData.map((dpe, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {dpe.numero_voie_ban} {dpe.nom_rue_ban}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{dpe.nom_commune_ban}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{dpe.type_batiment}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{dpe.surface_habitable_logement}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${getDpeColorClass(dpe.etiquette_dpe)}`}>
                    {dpe.etiquette_dpe}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${getGesColorClass(dpe.etiquette_ges)}`}>
                    {dpe.etiquette_ges}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(dpe.date_etablissement_dpe).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getDpeColorClass(etiquette: string): string {
  const colors: { [key: string]: string } = {
    'A': 'bg-green-100 text-green-800',
    'B': 'bg-green-50 text-green-700',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-amber-100 text-amber-800',
    'E': 'bg-orange-100 text-orange-800',
    'F': 'bg-red-100 text-red-800',
    'G': 'bg-red-800 text-white',
  };
  return colors[etiquette] || 'bg-gray-100 text-gray-800';
}

function getGesColorClass(etiquette: string): string {
  const colors: { [key: string]: string } = {
    '1': 'bg-green-100 text-green-800',
    '2': 'bg-green-50 text-green-700',
    '3': 'bg-yellow-100 text-yellow-800',
    '4': 'bg-amber-100 text-amber-800',
    '5': 'bg-orange-100 text-orange-800',
    '6': 'bg-red-100 text-red-800',
    '7': 'bg-red-800 text-white',
  };
  return colors[etiquette] || 'bg-gray-100 text-gray-800';
}
