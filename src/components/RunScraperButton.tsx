'use client';

import { useState } from 'react';

export default function RunScraperButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRunScraper = async () => {
    setIsLoading(true);
    setMessage('Lancement du scraper en cours...');
    
    try {
      const response = await fetch('/api/run-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Vérifier le type de contenu de la réponse
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        result = { success: response.ok, message: text };
      }
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Erreur lors du lancement du scraper');
      }

      setMessage(result.message || 'Scraper lancé avec succès !');
    } catch (error) {
      console.error('Erreur lors du lancement du scraper:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setMessage(`Erreur: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleRunScraper}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Chargement...' : 'Lancer le scraper'}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
