import AnnonceClient from "./AnnonceClient";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <AnnonceClient annonceId={params.id} />;
}
