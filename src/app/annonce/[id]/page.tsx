import ImageSlider from "@/components/ImageSlider";
import { EnergyLabels } from "@/components/EnergyLabel";
import { getAnnonceById } from "@/app/actions";
import PrixNegocie from "@/components/PrixNegocie";

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
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <ImageSlider photos={photos} />
          <EnergyLabels dpe={annonce.dpe} ges={annonce.ges} />
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                {annonce.type} - {annonce.ville}
              </h2>
              {annonce.surface && (
                <p className="text-sm text-gray-600 mt-1">
                  {annonce.surface} m²
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-indigo-600">
                {annonce.prix ? annonce.prix.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €" : "Prix non disponible"}
              </p>
              {annonce.prix && annonce.surface && (
                <p className="text-sm text-gray-600">
                  ({Math.round(parseInt(annonce.prix.replace(/[^\d]/g, "")) / parseFloat(annonce.surface)).toLocaleString("fr-FR")} €/m²)
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-gray-700 mb-6">{annonce.description}</p>

            <a
              href={annonce.lien}
              target="_blank"
              className="mt-6 inline-block text-sm text-blue-600 hover:underline"
            >
              Voir l'annonce originale →
            </a>
            
            {annonce.prix && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Simulation</h3>
                <PrixNegocie 
                  prixInitial={annonce.prix} 
                  surface={annonce.surface || undefined} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
