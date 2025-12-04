'use client';

import { DpeData } from './types';
import { useState, useEffect } from 'react';

export default function DpePage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const VILLES = ["Vitré", "Châteaugiron", "Fougères"];
  const [dpeData, setDpeData] = useState<DpeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>(VILLES);
  const [streetNumber, setStreetNumber] = useState<string>('');
  const [streetName, setStreetName] = useState<string>('');
  const [tempStreetNumber, setTempStreetNumber] = useState<string>('');
  const [tempStreetName, setTempStreetName] = useState<string>('');

  const fetchData = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        if (!nextUrl || isLoadingMore) return;
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      
      let apiUrl = isLoadMore ? nextUrl : null;
      
      if (!apiUrl) {
        const villesFormatees = selectedCities.map(ville => `"${ville}"`).join(',');
        
        let urlParams = new URLSearchParams({
          draft: 'false',
          size: '20',
          truncate: '50',
          sort: '-date_derniere_modification_dpe',
          'nom_commune_ban_in': villesFormatees
        });

        if (streetNumber) {
          urlParams.append('numero_voie_ban_eq', streetNumber);
        }
        
        if (streetName) {
          urlParams.append('nom_rue_ban_search', streetName);
        }
        
        apiUrl = `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?${urlParams.toString()}`;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      setNextUrl(data.next || null);
      setDpeData(prevData => isLoadMore ? [...prevData, ...data.results] : data.results);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
    };

    // Chargement initial des données
  useEffect(() => {
    fetchData();
  }, []);

  // Gestion du changement de sélection des villes
  const handleCityChange = (city: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCities(prev => [...prev, city]);
    } else {
      setSelectedCities(prev => prev.filter(c => c !== city));
    }
  };

  // Gestion de la sélection/désélection de toutes les villes
  const toggleAllCities = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCities([...VILLES]);
    } else {
      setSelectedCities([]);
    }
  };

  // Recharger les données quand les filtres changent
  useEffect(() => {
    if (selectedCities.length > 0) {
      fetchData();
    }
  }, [selectedCities, streetNumber, streetName]);

  // Initialiser les champs temporaires
  useEffect(() => {
    setTempStreetNumber(streetNumber);
    setTempStreetName(streetName);
  }, []);

  // Appliquer les filtres
  const applyFilters = () => {
    setStreetNumber(tempStreetNumber);
    setStreetName(tempStreetName);
  };

  // Fonction pour charger les résultats suivants
  const loadMoreResults = async () => {
    if (nextUrl && !isLoadingMore) {
      await fetchData(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">Données DPE</h1>
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            {isFiltersOpen ? (
              <>
                <span>Masquer les filtres</span>
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Afficher les filtres</span>
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
        
        <div className={`transition-all duration-300 overflow-hidden ${isFiltersOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="w-full bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Filtres</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4 lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700 mb-1">Numéro de voie</label>
                    <input
                      type="text"
                      id="streetNumber"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={tempStreetNumber}
                      onChange={(e) => setTempStreetNumber(e.target.value)}
                      placeholder="Ex: 18"
                    />
                  </div>
                  <div>
                    <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-1">Nom de la rue</label>
                    <input
                      type="text"
                      id="streetName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={tempStreetName}
                      onChange={(e) => setTempStreetName(e.target.value)}
                      placeholder="Ex: Rue Savary"
                    />
                  </div>
                </div>
                <div>
                  <button
                    onClick={applyFilters}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Appliquer les filtres
                  </button>
                </div>
              </div>
              
              <div className="lg:border-l lg:pl-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Villes :</label>
                <div className="bg-white border border-gray-200 rounded-lg p-3 max-h-60 overflow-y-auto">
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      checked={selectedCities.length === VILLES.length}
                      onChange={toggleAllCities}
                    />
                    <span className="text-sm font-medium">Toutes les villes</span>
                  </label>
                  <div className="border-t border-gray-200 my-2"></div>
                  {VILLES.map((city) => (
                    <label key={city} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        checked={selectedCities.includes(city)}
                        onChange={(e) => handleCityChange(city, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">{city}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface logement (m²)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surface immeuble (m²)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe DPE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GES</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date DPE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date visite</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nb apparts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nb niveaux immeuble</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nb niveaux logement</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typologie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complément</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro DPE</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dpeData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Aucun résultat trouvé
                </td>
              </tr>
            ) : (
              dpeData.map((item) => (
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
                    <div className="text-sm text-gray-900">{item.surface_habitable_logement || '-'} m²</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.surface_habitable_immeuble ? `${item.surface_habitable_immeuble} m²` : '-'}</div>
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
                    {item.date_etablissement_dpe ? new Date(item.date_etablissement_dpe).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.date_visite_diagnostiqueur ? new Date(item.date_visite_diagnostiqueur).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.nombre_appartement || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.nombre_niveau_immeuble || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.nombre_niveau_logement || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.typologie_logement || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.numero_etage_appartement || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.position_logement_dans_immeuble || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.complement_adresse_logement || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {item.numero_dpe || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {isLoadingMore && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Chargement des données...</p>
        </div>
      )}
      {nextUrl ? (
        <div className="text-center py-4">
          <button
            onClick={loadMoreResults}
            disabled={isLoadingMore}
            className={`px-6 py-2 rounded-md ${
              isLoadingMore
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoadingMore ? 'Chargement...' : 'Charger les résultats suivants'}
          </button>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-600">
          Toutes les données ont été chargées
        </div>
      )}
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
