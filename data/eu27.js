/**
 * Demo data for EU-27. Values are CENTS (BigInt).
 * Replace with real Eurostat/national data when available.
 */
export const EU27 = [
  { code: "FR", name: "France", t0: "2023-12-31T23:59:59Z", t1: "2024-06-30T23:59:59Z", startDebtCents: 2989780219780000n, endDebtCents: 2999780219780000n },
  { code: "DE", name: "Germany", t0: "2023-12-31T23:59:59Z", t1: "2024-06-30T23:59:59Z", startDebtCents: 2670000000000000n, endDebtCents: 2682000000000000n },
  { code: "IT", name: "Italy", t0: "2023-12-31T23:59:59Z", t1: "2024-06-30T23:59:59Z", startDebtCents: 2870000000000000n, endDebtCents: 2883000000000000n },
  { code: "ES", name: "Spain", t0: "2023-12-31T23:59:59Z", t1: "2024-06-30T23:59:59Z", startDebtCents: 1590000000000000n, endDebtCents: 1595000000000000n },
  { code: "PL", name: "Poland", t0: "2023-12-31T23:59:59Z", t1: "2024-06-30T23:59:59Z", startDebtCents: 430000000000000n, endDebtCents: 440000000000000n },
  // ... add remaining countries; missing data will render as grey
];

export const getCountry = (code) => EU27.find(c => c.code === code.toUpperCase());
