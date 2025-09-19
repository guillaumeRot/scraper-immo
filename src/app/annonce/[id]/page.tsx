import { getAnnonceById } from "@/app/actions";

export default async function AnnonceDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const annonce = await getAnnonceById(id);

  if (!annonce) {
    return <p>Annonce introuvable.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {annonce.type} - {annonce.ville}
      </h2>

      {/* Carousel simple */}
      <div className="flex overflow-x-auto gap-4 mb-6">
        {(annonce.photos as string[])?.map((photo: string, idx: number) => (
          <img
            key={idx}
            src={photo}
            alt={`Photo ${idx + 1}`}
            className="rounded-lg w-96 h-64 object-cover flex-shrink-0"
          />
        ))}
      </div>

      <p className="text-lg font-semibold text-indigo-600">{annonce.prix}</p>
      <p className="text-gray-600">
        {annonce.pieces} pièces • {annonce.surface} m²
      </p>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{annonce.description}</p>
      </div>

      <a
        href={annonce.lien}
        target="_blank"
        className="mt-6 inline-block text-sm text-blue-600 hover:underline"
      >
        Voir l’annonce originale →
      </a>
    </div>
  );
}
