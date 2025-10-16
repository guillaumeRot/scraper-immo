'use client';

import { useState } from 'react';

export default function RunScraperButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [scraper, setScraper] = useState('all');

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
        body: JSON.stringify({ scraper })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`Scraping ${scraper === 'all' ? 'de tous les scrapers' : `du scraper ${scraper}`} terminé avec succès !`);
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
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <select
          value={scraper}
          onChange={(e) => setScraper(e.target.value)}
          disabled={isLoading}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2"
        >
          <option value="all">Tous les scrapers</option>
          <option value="immonot">Immonot</option>
          <option value="kermarrec">Kermarrec</option>
        </select>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? 'Chargement...' : 'Lancer le scraping'}
        </button>
      </div>
      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
