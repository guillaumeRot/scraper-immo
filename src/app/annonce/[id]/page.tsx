import { Suspense } from 'react';
import AnnonceClient from "./AnnonceClient";

interface PageProps {
  params: { id: string };
}

// Composant pour gérer le chargement asynchrone
export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <AnnonceClient annonceId={params.id} />
    </Suspense>
  );
}
