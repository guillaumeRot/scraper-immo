"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearch } from "@/context/SearchContext";
import ImageSlider from "@/components/ImageSlider";
import { EnergyLabels } from "@/components/EnergyLabel";
import { getAnnonceById } from "@/app/actions";
import PrixNegocie from "@/components/PrixNegocie";

interface AnnonceClientProps {
  annonceId: string;
}

export default function AnnonceClient({ annonceId }: AnnonceClientProps) {
  const [annonce, setAnnonce] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { searchParams } = useSearch();
  const router = useRouter();

  useEffect(() => {
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
        </div>
      </div>
    </div>
  );
}
