"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearch } from "@/context/SearchContext";
import ImageSlider from "@/components/ImageSlider";
import { EnergyLabels } from "@/components/EnergyLabel";
import { getAnnonceById } from "@/app/actions";
import PrixNegocie from "@/components/PrixNegocie";

interface DpeData {
  numero_dpe: string;
  date_etablissement_dpe: string;
  numero_voie_ban: string;
  nom_rue_ban: string;
  nom_commune_ban: string;
  etiquette_dpe: string;
  etiquette_ges: string;
  type_batiment: string;
  type_installation_chauffage_n1: string;
  surface_habitable_logement: number;
}

interface AnnonceClientProps {
  annonceId: string | undefined;
}

export default function AnnonceClient({ annonceId }: AnnonceClientProps) {
  if (!annonceId) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">ID d'annonce manquant</p>
      </div>
    );
  }
  const [annonce, setAnnonce] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dpeResults, setDpeResults] = useState<DpeData[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof DpeData | null; direction: 'asc' | 'desc' }>({ 
    key: null, 
    direction: 'asc' 
  });
  const { searchParams } = useSearch();
  const router = useRouter();

  const requestSort = (key: keyof DpeData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedResults = () => {
    if (!sortConfig.key) return dpeResults;

    return [...dpeResults].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof DpeData];
      const bValue = b[sortConfig.key as keyof DpeData];

      if (aValue === bValue) return 0;
      
      if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedResults = getSortedResults();

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };


  useEffect(() => {
    if (!annonceId) return;
    
    const fetchAnnonce = async () => {
      try {
        const data = await getAnnonceById(annonceId);
        setAnnonce(data);
      } catch (error) {
        console.error('Error fetching annonce:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
    
    // Nettoyage
    return () => {
      // Annuler les requêtes en cours si nécessaire
    };
  }, [annonceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Annonce introuvable</p>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  // Construire l'URL de retour avec les paramètres de recherche
  const buildBackUrl = () => {
    const params = new URLSearchParams();
    if (searchParams.ville) params.append('ville', searchParams.ville);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.sort) params.append('sort', searchParams.sort);
    return `/?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={buildBackUrl()}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux résultats
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <ImageSlider photos={annonce.photos || []} />
          <EnergyLabels dpe={annonce.dpe} ges={annonce.ges} />
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                {annonce.type} - {annonce.ville}
              </h2>
              {annonce.surface && (
                <p className="text-sm text-gray-600 mt-1">
                  {annonce.surface} m²
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-indigo-600">
                {annonce.prix ? annonce.prix.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €" : "Prix non disponible"}
              </p>
              {annonce.prix && annonce.surface && (
                <p className="text-sm text-gray-600">
                  ({Math.round(parseInt(annonce.prix.replace(/[^\d]/g, "")) / parseFloat(annonce.surface)).toLocaleString("fr-FR")} €/m²)
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-gray-700 mb-6">{annonce.description}</p>

            <a
              href={annonce.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm text-blue-600 hover:underline"
            >
              Voir l'annonce originale →
            </a>
          </div>
        </div>
      </div>
      
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Recherche de DPE</h3>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const ville = formData.get('ville') as string;
              const rue = formData.get('rue') as string;
              const numero = formData.get('numero') as string;
              
              try {
                const response = await fetch(
                  `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?nom_commune_ban_eq=${encodeURIComponent(ville)}&nom_rue_ban_eq=${encodeURIComponent(rue)}&numero_voie_ban_eq=${encodeURIComponent(numero)}`
                );
                const data = await response.json();
                setDpeResults(data.results || []);
              } catch (error) {
                console.error('Erreur lors de la récupération des données DPE:', error);
                setDpeResults([]);
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Paris"
                  defaultValue={annonce?.ville || ''}
                />
              </div>
              <div>
                <label htmlFor="rue" className="block text-sm font-medium text-gray-700 mb-1">Nom de la rue</label>
                <input
                  type="text"
                  id="rue"
                  name="rue"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Rue de la Paix"
                />
              </div>
              <div>
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Numéro</label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: 12"
                />
              </div>
              <div className="flex items-end h-full">
                <button
                  type="submit"
                  className="w-full h-10 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Chercher un DPE
                </button>
              </div>
            </div>
          </form>

          {dpeResults.length > 0 && (
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                      onClick={() => requestSort('numero_dpe')}
                    >
                      Numéro DPE {getSortIndicator('numero_dpe')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                      onClick={() => requestSort('date_etablissement_dpe')}
                    >
                      Date {getSortIndicator('date_etablissement_dpe')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                      onClick={() => requestSort('nom_commune_ban')}
                    >
                      Adresse {getSortIndicator('nom_commune_ban')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                      onClick={() => requestSort('etiquette_dpe')}
                    >
                      Étiquette DPE {getSortIndicator('etiquette_dpe')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                      onClick={() => requestSort('etiquette_ges')}
                    >
                      Étiquette GES {getSortIndicator('etiquette_ges')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                      onClick={() => requestSort('type_batiment')}
                    >
                      Type de bâtiment {getSortIndicator('type_batiment')}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Chauffage
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                      onClick={() => requestSort('surface_habitable_logement')}
                    >
                      Surface (m²) {getSortIndicator('surface_habitable_logement')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedResults.map((dpe: DpeData, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dpe.numero_dpe}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dpe.date_etablissement_dpe ? new Date(dpe.date_etablissement_dpe).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dpe.numero_voie_ban} {dpe.nom_rue_ban}, {dpe.nom_commune_ban}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dpe.etiquette_dpe === 'A' ? 'bg-green-100 text-green-800' :
                          dpe.etiquette_dpe === 'B' ? 'bg-green-200 text-green-800' :
                          dpe.etiquette_dpe === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          dpe.etiquette_dpe === 'D' ? 'bg-yellow-200 text-yellow-800' :
                          dpe.etiquette_dpe === 'E' ? 'bg-orange-100 text-orange-800' :
                          dpe.etiquette_dpe === 'F' ? 'bg-red-100 text-red-800' :
                          dpe.etiquette_dpe === 'G' ? 'bg-red-200 text-red-900' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {dpe.etiquette_dpe || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dpe.etiquette_ges === 'A' ? 'bg-green-100 text-green-800' :
                          dpe.etiquette_ges === 'B' ? 'bg-green-200 text-green-800' :
                          dpe.etiquette_ges === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          dpe.etiquette_ges === 'D' ? 'bg-yellow-200 text-yellow-800' :
                          dpe.etiquette_ges === 'E' ? 'bg-orange-100 text-orange-800' :
                          dpe.etiquette_ges === 'F' ? 'bg-red-100 text-red-800' :
                          dpe.etiquette_ges === 'G' ? 'bg-red-200 text-red-900' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {dpe.etiquette_ges || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dpe.type_batiment || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dpe.type_installation_chauffage_n1 || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dpe.surface_habitable_logement ? Math.round(dpe.surface_habitable_logement) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {annonce.prix && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Simulation</h3>
            <PrixNegocie 
              prixInitial={annonce.prix} 
              surface={annonce.surface || undefined} 
            />
          </div>
        )}
    </div>
  );
}
