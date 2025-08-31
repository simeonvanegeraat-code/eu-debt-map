// === Dataschema ===
// Voor elk land: twee peildata. We interpoleren ertussen en extrapoleren
// na de laatste datum met dezelfde snelheid (cap je later aan smaak).
export const countries = [
  // EU (demo-waarden; vervang later door echte)
  { code: "NL", name: "Nederland", flag: "🇳🇱",
    prev_value_eur: 420_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 415_000_000_000, last_date: "2024-06-30" },
  { code: "DE", name: "Duitsland", flag: "🇩🇪",
    prev_value_eur: 2_400_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 2_450_000_000_000, last_date: "2024-06-30" },
  { code: "FR", name: "Frankrijk", flag: "🇫🇷",
    prev_value_eur: 2_950_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 2_970_000_000_000, last_date: "2024-06-30" },
  { code: "IT", name: "Italië", flag: "🇮🇹",
    prev_value_eur: 2_800_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 2_790_000_000_000, last_date: "2024-06-30" },
  { code: "ES", name: "Spanje", flag: "🇪🇸",
    prev_value_eur: 1_550_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 1_565_000_000_000, last_date: "2024-06-30" },

  // Extra EU/Europa placeholders — momenteel grijs tot je cijfers invult:
  // (Zodra je cijfers plaatst, kleuren ze direct mee en zijn landpagina’s actief.)
  { code: "BE", name: "België", flag: "🇧🇪", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "PL", name: "Polen", flag: "🇵🇱", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "SE", name: "Zweden", flag: "🇸🇪", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "FI", name: "Finland", flag: "🇫🇮", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "DK", name: "Denemarken", flag: "🇩🇰", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "IE", name: "Ierland", flag: "🇮🇪", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "AT", name: "Oostenrijk", flag: "🇦🇹", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "GR", name: "Griekenland", flag: "🇬🇷", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "CZ", name: "Tsjechië", flag: "🇨🇿", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "SK", name: "Slowakije", flag: "🇸🇰", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "SI", name: "Slovenië", flag: "🇸🇮", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "RO", name: "Roemenië", flag: "🇷🇴", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "BG", name: "Bulgarije", flag: "🇧🇬", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "HR", name: "Kroatië", flag: "🇭🇷", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "LT", name: "Litouwen", flag: "🇱🇹", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "LV", name: "Letland", flag: "🇱🇻", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "EE", name: "Estland", flag: "🇪🇪", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },

  // Niet-EU (zichtbaar op kaart; kleur pas na cijfers)
  { code: "GB", name: "Verenigd Koninkrijk", flag: "🇬🇧", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "NO", name: "Noorwegen", flag: "🇳🇴", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "CH", name: "Zwitserland", flag: "🇨🇭", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "IS", name: "IJsland", flag: "🇮🇸", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "UA", name: "Oekraïne", flag: "🇺🇦", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "RS", name: "Servië", flag: "🇷🇸", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "BA", name: "Bosnië en Herzegovina", flag: "🇧🇦", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "MK", name: "Noord-Macedonië", flag: "🇲🇰", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "MD", name: "Moldavië", flag: "🇲🇩", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" }
];

// ——— Helpers ———

export function trendFor(c){
  return c.last_value_eur - c.prev_value_eur;
}

/**
 * Interpoleert lineair tussen prev en last. Na de laatste peildatum:
 * extrapoleer met dezelfde snelheid (met een veiligheids-cap).
 */
export function interpolateDebt(c, atMs){
  const t0 = new Date(c.prev_date).getTime();
  const t1 = new Date(c.last_date).getTime();
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;
  if (t1 <= t0) return v1; // verdedigingslijn

  // snelheid (euro per ms) tussen de 2 peildata
  const rate = (v1 - v0) / (t1 - t0);

  if (atMs <= t0) return v0;
  if (atMs <= t1) {
    // lineaire interpolatie binnen het interval
    return v0 + rate * (atMs - t0);
  }

  // — Extrapolatie na t1 —
  // Cap hoe ver we vooruitgaan (bijv. max 180 dagen) zodat het niet ontspoort
  const MAX_FWD_MS = 180 * 24 * 3600 * 1000; // 180 dagen
  const dt = Math.min(atMs - t1, MAX_FWD_MS);
  return v1 + rate * dt;
}
