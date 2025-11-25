import { getAnnonces, getFiltersData } from "./actions";
import ImageCarousel from "@/components/ImageCarousel";
import Link from 'next/link';

type SortOption = {
  value: string;
  label: string;
};

const SORT_OPTIONS: SortOption[] = [
  { value: 'created_at-desc', label: 'Date de création (récents d\'abord)' },
  { value: 'created_at-asc', label: 'Date de création (plus anciens d\'abord)' },
  { value: 'prix-asc', label: 'Prix (croissant)' },
  { value: 'prix-desc', label: 'Prix (décroissant)' },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ 
    ville?: string; 
    type?: string;
    sort?: string;
  }>;
}) {
  const { ville = "", type = "", sort = 'created_at-desc' } = await searchParams;
  const [sortBy, sortOrder] = sort.split('-').slice(-2) as [string, 'asc' | 'desc'];
  
  const [annonces, filters] = await Promise.all([
    getAnnonces({ 
      ville, 
      type, 
      sortBy: sortBy as any, 
      sortOrder 
    }),
    getFiltersData(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          Dernières annonces
        </h2>
        <p className="text-gray-600 mt-1">
          Explorez les opportunités immobilières récentes.
        </p>
      </div>

      <form
        action="/"
        method="GET"
        className="mb-8 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="ville"
              className="block text-sm font-medium text-gray-700"
            >
              Ville
            </label>
            <select
              id="ville"
              name="ville"
              defaultValue={ville}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Toutes les villes</option>
              {filters.villes.map((v: string) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type de bien
            </label>
            <select
              id="type"
              name="type"
              defaultValue={type}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Tous les types</option>
              {filters.types.map((t: string) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700"
            >
              Trier par
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full justify-center"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {annonces.map((annonce: any) => {
          const imageUrl = annonce.photos?.[0] ?? "";
          const prixFormate = formatPrix(annonce.prix);
          const type = annonce.type ?? "Annonce";
          const ville = annonce.ville ?? "";

          return (
            <div
              key={annonce.id}
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 lg:mx-auto w-full lg:flex lg:h-72"
            >
              <div className="h-48 sm:h-56 lg:w-1/3 lg:flex-shrink-0 lg:h-auto">
                <ImageCarousel images={annonce.photos || []} />
              </div>

              <div className="p-4 sm:p-5 lg:w-2/3 flex flex-col">
                {/* Header: Type et Ville à gauche, Prix à droite */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {type}
                    </h3>
                    <p className="text-sm text-gray-600">{ville}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {prixFormate}
                    </div>
                    {annonce.prix && annonce.prix.includes('+') && (
                      <div className="text-xs text-gray-500 mt-1">
                        {annonce.prix}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {annonce.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                    {annonce.description}
                  </p>
                )}

                {/* Propriétés */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {isValidNumber(annonce.pieces) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-sm">
                      <span>🛏️</span>
                      <span>{annonce.pieces} pièces</span>
                    </span>
                  )}
                  {isValidNumber(annonce.surface) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-sm">
                      <span>📐</span>
                      <span>{annonce.surface} m²</span>
                    </span>
                  )}
                </div>

                {/* Footer: Agence à gauche, Date à droite */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {annonce.agence && (
                      <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-xs font-medium">
                        {annonce.agence}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {annonce.created_at && (
                      <span className="text-xs text-gray-500">
                        {new Date(annonce.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    <Link
                      href={`/annonce/${annonce.id}`}
                      className="inline-flex items-center rounded-full bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                      Voir le détail
                      <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isValidNumber(value: unknown) {
  return typeof value === "number" && !Number.isNaN(value);
}

function formatPrix(prix: any) {
  if (typeof prix === "number") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(prix);
  }
  if (typeof prix === "string") {
    const numeric = Number(prix.replace(/[^0-9]/g, ""));
    if (!Number.isNaN(numeric)) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(numeric);
    }
  }
  return prix ?? "Prix ND";
}
