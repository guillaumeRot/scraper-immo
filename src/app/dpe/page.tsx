'use client';

import { DpeData } from './types';
import { useState, useEffect } from 'react';

export default function DpePage() {
  const VILLES = ["Vitré", "Châteaugiron", "Fougères"];
  const [dpeData, setDpeData] = useState<DpeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>(VILLES);
  const [selectedBuildingTypes, setSelectedBuildingTypes] = useState<string[]>(['Appartement', 'Immeuble', 'Maison']);
  const [streetNumber, setStreetNumber] = useState<string>('');
  const [streetName, setStreetName] = useState<string>('');
  const [tempStreetNumber, setTempStreetNumber] = useState<string>('');
  const [tempStreetName, setTempStreetName] = useState<string>('');
  const BUILDING_TYPES = ['Appartement', 'Immeuble', 'Maison'];

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

        if (selectedBuildingTypes.length > 0) {
          // Formater les types de bâtiment pour l'URL
          const typesFormates = selectedBuildingTypes.map(type => `"${type.toLowerCase()}"`).join(',');
          urlParams.append('type_batiment_in', typesFormates);
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

  // Gestion du changement de type de bâtiment
  const handleBuildingTypeChange = (type: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedBuildingTypes(prev => [...prev, type]);
    } else {
      setSelectedBuildingTypes(prev => prev.filter(t => t !== type));
    }
  };

  // Gestion de la sélection/désélection de tous les types de bâtiment
  const toggleAllBuildingTypes = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBuildingTypes([...BUILDING_TYPES]);
    } else {
      setSelectedBuildingTypes([]);
    }
  };

  // Recharger les données quand les filtres changent
  useEffect(() => {
    if (selectedCities.length > 0 && selectedBuildingTypes.length > 0) {
      fetchData();
    }
  }, [selectedCities, selectedBuildingTypes, streetNumber, streetName]);

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

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6 pl-4 border-l-4 border-indigo-500">
        <h1 className="text-2xl font-bold text-gray-900">Données DPE</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {isLoading ? 'Chargement…' : `${dpeData.length} résultat${dpeData.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filtres chips */}
      <div className="mb-8 space-y-3">
        {/* Villes */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-400 w-14 flex-shrink-0">Ville</span>
          <Chip
            label="Toutes"
            active={selectedCities.length === VILLES.length}
            onClick={() => setSelectedCities([...VILLES])}
          />
          {VILLES.map((city) => (
            <Chip
              key={city}
              label={city}
              active={selectedCities.includes(city)}
              onClick={() => handleCityChange(city, !selectedCities.includes(city))}
            />
          ))}
        </div>

        {/* Types de bâtiment */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-400 w-14 flex-shrink-0">Type</span>
          <Chip
            label="Tous"
            active={selectedBuildingTypes.length === BUILDING_TYPES.length}
            onClick={() => setSelectedBuildingTypes([...BUILDING_TYPES])}
          />
          {BUILDING_TYPES.map((type) => (
            <Chip
              key={type}
              label={type}
              active={selectedBuildingTypes.includes(type)}
              onClick={() => handleBuildingTypeChange(type, !selectedBuildingTypes.includes(type))}
            />
          ))}
        </div>

        {/* Adresse */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-400 w-14 flex-shrink-0">Adresse</span>
          <input
            type="text"
            value={tempStreetNumber}
            onChange={(e) => setTempStreetNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="N° de voie"
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 w-28"
          />
          <input
            type="text"
            value={tempStreetName}
            onChange={(e) => setTempStreetName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Nom de la rue"
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 w-44"
          />
          <button
            onClick={applyFilters}
            className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            Rechercher
          </button>
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
            {isLoading ? (
              <tr>
                <td colSpan={17} className="px-6 py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </td>
              </tr>
            ) : dpeData.length === 0 ? (
              <tr>
                <td colSpan={17} className="px-6 py-4 text-center text-gray-500">
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

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
      }`}
    >
      {label}
    </button>
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
