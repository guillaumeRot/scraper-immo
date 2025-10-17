import { getAnnonces, getFiltersData } from "./actions";
import RunScraperButton from "@/components/RunScraperButton";
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Dernières annonces
          </h2>
          <p className="text-gray-600 mt-1">
            Explorez les opportunités immobilières récentes.
          </p>
        </div>
        <div className="self-end">
          <RunScraperButton />
        </div>
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
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 lg:max-w-6xl lg:mx-auto w-full lg:flex"
            >
              <div className="lg:w-1/3 flex-shrink-0">
                <ImageCarousel images={annonce.photos || []} />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-gray-800 shadow-sm">
                  {type}
                </span>
              </div>

              <div className="p-4 sm:p-5 lg:w-2/3 flex flex-col">
                {annonce.agence && (
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-xs font-medium">
                      {annonce.agence}
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ville || type}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">{type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-indigo-600">
                      {prixFormate}
                    </div>
                    {annonce.created_at && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(annonce.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-700">
                  {isValidNumber(annonce.pieces) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                      <span>🛏️</span>
                      <span>{annonce.pieces} pièces</span>
                    </span>
                  )}
                  {isValidNumber(annonce.surface) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                      <span>📐</span>
                      <span>{annonce.surface} m²</span>
                    </span>
                  )}
                </div>

                {annonce.description && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {annonce.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/annonce/${annonce.id}`}
                    className="inline-flex items-center rounded-full bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    Voir le détail
                    <span className="ml-1">→</span>
                  </Link>

                  {annonce.ville && (
                    <span className="text-xs text-gray-500">
                      {annonce.ville}
                    </span>
                  )}
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
