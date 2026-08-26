"use client";

import { useEffect, useState } from 'react';
import {
  getNotificationPreferences,
  updateNotificationPreference,
  VilleNotification,
  TypeTransaction,
} from "@/app/actions";

export default function Alertes() {
  const [loading, setLoading] = useState(true);
  const [villes, setVilles] = useState<VilleNotification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getNotificationPreferences();
        setVilles(data);
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (villeId: number, type: TypeTransaction) => {
    const current = villes.find((v) => v.villeId === villeId);
    if (!current) return;
    const next = !current[type];

    setVilles((prev) =>
      prev.map((v) => (v.villeId === villeId ? { ...v, [type]: next } : v))
    );
    updateNotificationPreference(villeId, type, next).catch((error) => {
      console.error('Erreur lors de la sauvegarde des alertes:', error);
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 pl-4 border-l-4 border-indigo-500">
        <h2 className="text-2xl font-bold text-gray-900">Réglages d'alertes</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Choisissez les villes pour lesquelles recevoir un e-mail à chaque nouvelle annonce
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white border border-gray-100 divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded-full w-1/3" />
              <div className="flex gap-6">
                <div className="h-6 w-11 bg-gray-100 rounded-full" />
                <div className="h-6 w-11 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : villes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
          <p className="text-base font-medium text-gray-400">Aucune ville disponible</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
          <div className="hidden sm:flex items-center justify-between px-4 py-3 bg-gray-50 text-xs font-medium text-gray-400">
            <span>Ville</span>
            <div className="flex gap-6">
              <span className="w-11 text-center">Ventes</span>
              <span className="w-11 text-center">Locations</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {villes.map((v) => (
              <div key={v.villeId} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{v.nom}</p>
                  <p className="text-xs text-gray-400">{v.codePostal}</p>
                </div>
                <div className="flex gap-6">
                  <div className="w-11 flex justify-center">
                    <Switch checked={v.vente} onChange={() => handleToggle(v.villeId, 'vente')} />
                  </div>
                  <div className="w-11 flex justify-center">
                    <Switch checked={v.location} onChange={() => handleToggle(v.villeId, 'location')} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-150 ${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-150 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
