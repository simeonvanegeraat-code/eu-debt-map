export function formatEURFromCentsBigInt(centsBig) {
  const euros = Number(centsBig) / 100;
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(euros);
}
