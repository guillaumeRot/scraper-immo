export interface DpeData {
  numero_dpe: string;
  date_etablissement_dpe: string;
  date_visite_diagnostiqueur: string;
  numero_voie_ban: string;
  nom_rue_ban: string;
  nom_commune_ban: string;
  etiquette_dpe: string;
  etiquette_ges: string;
  type_batiment: string;
  type_installation_chauffage_n1: string;
  surface_habitable_logement: number;
  nombre_appartement: number;
  nombre_niveau_immeuble: number;
  nombre_niveau_logement: number;
  typologie_logement: string;
  surface_habitable_immeuble: number;
  numero_etage_appartement: number;
  position_logement_dans_immeuble: string;
  complement_adresse_logement: string;
}
