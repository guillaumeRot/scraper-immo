export function isValidNumber(value: unknown) {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function formatMontant(value: any) {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (typeof value === 'string') {
    const numeric = Number(value.replace(/[^0-9]/g, ''));
    if (!Number.isNaN(numeric)) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(numeric);
    }
  }
  return null;
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
