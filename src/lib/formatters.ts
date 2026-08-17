export function isValidNumber(value: unknown) {
  return typeof value === 'number' && !Number.isNaN(value);
}

// Les champs numériques sont scrapés en texte et parfois pollués par des
// artefacts de calcul flottant (ex: "526.1700000000001") : on garde le point
// décimal pour ne pas fusionner la partie décimale dans l'entier.
export function parseMontant(value: any): number | null {
  if (typeof value === 'number') return Number.isNaN(value) ? null : value;
  if (typeof value === 'string') {
    const numeric = Number(value.replace(/[^0-9.]/g, ''));
    if (!Number.isNaN(numeric)) return numeric;
  }
  return null;
}

export function formatMontant(value: any) {
  const numeric = parseMontant(value);
  if (numeric === null) return null;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function formatPrix(prix: any) {
  return formatMontant(prix) ?? (prix ?? 'Prix ND');
}

export function formatLoyer(loyer: any, charges: any) {
  const loyerFormate = formatMontant(loyer);
  if (!loyerFormate) return 'Loyer ND';
  const chargesFormate = formatMontant(charges);
  return chargesFormate ? `${loyerFormate}/mois + ${chargesFormate} charges` : `${loyerFormate}/mois`;
}
