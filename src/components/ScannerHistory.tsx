'use client';

import { useEffect, useState } from 'react';

interface Scan {
  id: number;
  scraper: string;
  date_scan: Date;
  status: string;
  annonces_count: number;
  erreurs_count: number;
  duree_ms: number | null;
}

export default function ScannerHistory({ initialScans }: { initialScans: Scan[] }) {
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchScans = async () => {
    try {
      const response = await fetch('/api/scans');
      if (!response.ok) throw new Error('Erreur lors du chargement des scans');
      const data = await response.json();
      setScans(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Rafraîchir automatiquement toutes les 10 secondes
  useEffect(() => {
    const interval = setInterval(fetchScans, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchScans();
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Historique des scans</h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRefreshing ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

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
  );
}
