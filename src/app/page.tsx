import Link from "next/link";
import { getAnnonces } from "./actions";

export default async function Home() {
  const annonces = await getAnnonces();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📊 Dernières annonces</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {annonces.map((annonce: any) => (
          <div
            key={annonce.id}
            className="border rounded-2xl shadow p-4 bg-white flex flex-col"
          >
            {annonce.photos?.length > 0 && (
              <img
                src={annonce.photos[0]}
                alt={annonce.type}
                className="rounded-xl w-full h-48 object-cover mb-3"
              />
            )}

            <h3 className="text-lg font-semibold mb-1">
              {annonce.type} - {annonce.ville}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {annonce.description || "Pas de description"}
            </p>

            <p className="font-bold text-indigo-600">{annonce.prix}</p>
            <p className="text-sm text-gray-500">
              {annonce.pieces} pièces • {annonce.surface} m²
            </p>

            <Link
              href={`/annonce/${annonce.id}`}
              className="mt-3 inline-block text-sm text-blue-600 hover:underline"
            >
              Voir le détail →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
