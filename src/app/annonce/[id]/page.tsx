import ImageSlider from "@/components/ImageSlider";
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

  const photos = (annonce.photos as string[]) || [];

  return (
    <div>
      <div className="flex gap-8">
        <ImageSlider photos={photos} />
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">
              {annonce.type} - {annonce.ville}
            </h2>
            <div className="text-right">
              <p className="text-2xl font-semibold text-indigo-600">
                {annonce.prix ? annonce.prix.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €" : "Prix non disponible"}
              </p>
              {annonce.prix && annonce.surface && (
                <p className="text-sm text-gray-600">
                  ({Math.round(parseInt(annonce.prix.replace(/[^\d]/g, "")) / parseFloat(annonce.surface)).toLocaleString("fr-FR")} €/m²)
                </p>
              )}
              {annonce.surface && (
                <p className="text-sm text-gray-600 mt-2">
                  {annonce.surface} m²
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{annonce.description}</p>
          </div>

          <a
            href={annonce.lien}
            target="_blank"
            className="mt-6 inline-block text-sm text-blue-600 hover:underline"
          >
            Voir l'annonce originale →
          </a>
        </div>
      </div>
    </div>
  );
}
