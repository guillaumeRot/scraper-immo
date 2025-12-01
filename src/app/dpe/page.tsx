import { DpeData } from './types';

'use client';

import { useState, useEffect } from 'react';

export default function DpePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVille, setSelectedVille] = useState<string>('');
  const [dpeData, setDpeData] = useState<DpeData[]>([]);
  const [filteredData, setFilteredData] = useState<DpeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [villes, setVilles] = useState<string[]>([]);
  const [pagination, setPagination] = useState<{
    next: string | null;
    previous: string | null;
  }>({ next: null, previous: null });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (url?: string) => {
    try {
      setIsLoading(true);
      let apiUrl = url;
      
      if (!apiUrl) {
        const VILLES = ["Vitré", "Châteaugiron"];
        const sixMoisAvant = new Date();
        sixMoisAvant.setMonth(sixMoisAvant.getMonth() - 6);
        const dateFormatee = sixMoisAvant.toISOString().split('T')[0];
        const villesFormatees = VILLES.map(ville => `"${ville}"`).join(',');
        
        apiUrl = `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?draft=false&size=20&truncate=50&sort=-date_derniere_modification_dpe&nom_commune_ban_in=${encodeURIComponent(villesFormatees)}&date_derniere_modification_dpe_gte=${dateFormatee}`;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      setPagination({
        next: data.links?.next || null,
        previous: data.links?.previous || null
      });
      
      setDpeData(prevData => url ? [...prevData, ...data.results] : data.results);
      setFilteredData(prevData => url ? [...prevData, ...data.results] : data.results);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Chargement initial des données
  useEffect(() => {
    fetchData();
  }, []);

  // Fonction pour charger plus de résultats
  const loadMoreResults = async () => {
    if (pagination.next) {
      await fetchData(pagination.next);
      setCurrentPage(prev => prev + 1);
    }
  };

  // Fonction pour revenir à la page précédente
  const loadPreviousResults = async () => {
    if (pagination.previous) {
      await fetchData(pagination.previous);
      setCurrentPage(prev => Math.max(1, prev - 1));
    }
  };

  // Mise à jour des villes uniques disponibles
  useEffect(() => {
    if (dpeData.length > 0) {
      const villesUniques = Array.from(new Set(dpeData.map(item => item.nom_commune_ban))).filter(Boolean) as string[];
      setVilles(villesUniques.sort());
    }
  }, [dpeData]);

  // Filtrage des données
  useEffect(() => {
    // On ne filtre que les données chargées localement
    let filtered = [...dpeData];

    // Filtre par recherche texte
    if (searchTerm) {
      filtered = filtered.filter(item => 
        (item.nom_rue_ban?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.numero_voie_ban?.toString().includes(searchTerm) ||
        item.nom_commune_ban?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtre par ville sélectionnée
    if (selectedVille) {
      filtered = filtered.filter(item => 
        item.nom_commune_ban === selectedVille
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, dpeData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Données DPE</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <select
              value={selectedVille}
              onChange={(e) => setSelectedVille(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">Toutes les villes</option>
              {villes.map((ville) => (
                <option key={ville} value={ville}>
                  {ville}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher une adresse..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          </div>
        </div>
      </div>
      
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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Aucun résultat trouvé
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.numero_dpe} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.numero_voie_ban} {item.nom_rue_ban}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.nom_commune_ban}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.type_batiment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.surface_habitable_logement} m²</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${getDpeColorClass(item.etiquette_dpe)}`}>
                      {item.etiquette_dpe}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${getGesColorClass(item.etiquette_ges)}`}>
                      {item.etiquette_ges}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.date_etablissement_dpe).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Boutons de pagination */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={loadPreviousResults}
          disabled={!pagination.previous}
          className={`px-4 py-2 rounded-lg border ${pagination.previous ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          Page précédente
        </button>
        
        <span className="text-gray-600">Page {currentPage}</span>
        
        <button
          onClick={loadMoreResults}
          disabled={!pagination.next}
          className={`px-4 py-2 rounded-lg border ${pagination.next ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          Page suivante
        </button>
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
