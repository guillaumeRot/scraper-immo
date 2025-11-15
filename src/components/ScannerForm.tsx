'use client';

import { useState } from 'react';

interface ScannerFormProps {
  agences: string[];
}

export default function ScannerForm({ agences }: ScannerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedAgence, setSelectedAgence] = useState('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/run-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scraper: selectedAgence })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`Scraping ${selectedAgence === 'all' ? 'de toutes les agences' : `de l'agence ${selectedAgence}`} terminé avec succès !`);
      } else {
        throw new Error(data.error || 'Erreur lors du scraping');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="agence"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Sélectionner une agence
          </label>
          <select
            id="agence"
            value={selectedAgence}
            onChange={(e) => setSelectedAgence(e.target.value)}
            disabled={isLoading}
            className="block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
          >
            <option value="all">Toutes les agences</option>
            {agences.map((agence) => (
              <option key={agence} value={agence}>
                {agence}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full justify-center ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scraping en cours...
              </>
            ) : (
              'Lancer le scraping'
            )}
          </button>
        </div>

        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-800">{message}</div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}
      </form>
    </div>
  );
}
