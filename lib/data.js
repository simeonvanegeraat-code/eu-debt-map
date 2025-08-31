// EU-27 countries — demo values (replace later with real data)
// We gebruiken twee peildata en extrapoleren DOOR na de laatste datum (geen cap).
export const countries = [
  { code: "AT", name: "Austria",    flag: "🇦🇹", prev_value_eur: 360_000_000_000, prev_date: "2024-01-01", last_value_eur: 370_000_000_000, last_date: "2024-07-01" },
  { code: "BE", name: "Belgium",    flag: "🇧🇪", prev_value_eur: 560_000_000_000, prev_date: "2024-01-01", last_value_eur: 565_000_000_000, last_date: "2024-07-01" },
  { code: "BG", name: "Bulgaria",   flag: "🇧🇬", prev_value_eur:  30_000_000_000, prev_date: "2024-01-01", last_value_eur:  31_000_000_000, last_date: "2024-07-01" },
  { code: "HR", name: "Croatia",    flag: "🇭🇷", prev_value_eur:  69_000_000_000, prev_date: "2024-01-01", last_value_eur:  70_000_000_000, last_date: "2024-07-01" },
  { code: "CY", name: "Cyprus",     flag: "🇨🇾", prev_value_eur:  24_000_000_000, prev_date: "2024-01-01", last_value_eur:  23_000_000_000, last_date: "2024-07-01" },
  { code: "CZ", name: "Czechia",    flag: "🇨🇿", prev_value_eur: 180_000_000_000, prev_date: "2024-01-01", last_value_eur: 185_000_000_000, last_date: "2024-07-01" },
  { code: "DK", name: "Denmark",    flag: "🇩🇰", prev_value_eur: 120_000_000_000, prev_date: "2024-01-01", last_value_eur: 118_000_000_000, last_date: "2024-07-01" },
  { code: "EE", name: "Estonia",    flag: "🇪🇪", prev_value_eur:   6_000_000_000, prev_date: "2024-01-01", last_value_eur:   6_200_000_000, last_date: "2024-07-01" },
  { code: "FI", name: "Finland",    flag: "🇫🇮", prev_value_eur: 200_000_000_000, prev_date: "2024-01-01", last_value_eur: 205_000_000_000, last_date: "2024-07-01" },
  { code: "FR", name: "France",     flag: "🇫🇷", prev_value_eur: 2_970_000_000_000, prev_date: "2024-01-01", last_value_eur: 3_010_000_000_000, last_date: "2024-07-01" },
  { code: "DE", name: "Germany",    flag: "🇩🇪", prev_value_eur: 2_450_000_000_000, prev_date: "2024-01-01", last_value_eur: 2_500_000_000_000, last_date: "2024-07-01" },
  { code: "GR", name: "Greece",     flag: "🇬🇷", prev_value_eur: 402_000_000_000, prev_date: "2024-01-01", last_value_eur: 398_000_000_000, last_date: "2024-07-01" },
  { code: "HU", name: "Hungary",    flag: "🇭🇺", prev_value_eur: 150_000_000_000, prev_date: "2024-01-01", last_value_eur: 153_000_000_000, last_date: "2024-07-01" },
  { code: "IE", name: "Ireland",    flag: "🇮🇪", prev_value_eur: 230_000_000_000, prev_date: "2024-01-01", last_value_eur: 231_000_000_000, last_date: "2024-07-01" },
  { code: "IT", name: "Italy",      flag: "🇮🇹", prev_value_eur: 2_790_000_000_000, prev_date: "2024-01-01", last_value_eur: 2_780_000_000_000, last_date: "2024-07-01" },
  { code: "LV", name: "Latvia",     flag: "🇱🇻", prev_value_eur:  16_000_000_000, prev_date: "2024-01-01", last_value_eur:  16_500_000_000, last_date: "2024-07-01" },
  { code: "LT", name: "Lithuania",  flag: "🇱🇹", prev_value_eur:  23_000_000_000, prev_date: "2024-01-01", last_value_eur:  24_000_000_000, last_date: "2024-07-01" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", prev_value_eur:  10_000_000_000, prev_date: "2024-01-01", last_value_eur:  10_500_000_000, last_date: "2024-07-01" },
  { code: "MT", name: "Malta",      flag: "🇲🇹", prev_value_eur:   9_000_000_000, prev_date: "2024-01-01", last_value_eur:   9_200_000_000, last_date: "2024-07-01" },
  { code: "NL", name: "Netherlands",flag: "🇳🇱", prev_value_eur: 415_000_000_000, prev_date: "2024-01-01", last_value_eur: 410_000_000_000, last_date: "2024-07-01" },
  { code: "PL", name: "Poland",     flag: "🇵🇱", prev_value_eur: 430_000_000_000, prev_date: "2024-01-01", last_value_eur: 440_000_000_000, last_date: "2024-07-01" },
  { code: "PT", name: "Portugal",   flag: "🇵🇹", prev_value_eur: 280_000_000_000, prev_date: "2024-01-01", last_value_eur: 282_000_000_000, last_date: "2024-07-01" },
  { code: "RO", name: "Romania",    flag: "🇷🇴", prev_value_eur: 160_000_000_000, prev_date: "2024-01-01", last_value_eur: 165_000_000_000, last_date: "2024-07-01" },
  { code: "SK", name: "Slovakia",   flag: "🇸🇰", prev_value_eur:  60_000_000_000, prev_date: "2024-01-01", last_value_eur:  61_000_000_000, last_date: "2024-07-01" },
  { code: "SI", name: "Slovenia",   flag: "🇸🇮", prev_value_eur:  42_000_000_000, prev_date: "2024-01-01", last_value_eur:  42_500_000_000, last_date: "2024-07-01" },
  { code: "ES", name: "Spain",      flag: "🇪🇸", prev_value_eur: 1_565_000_000_000, prev_date: "2024-01-01", last_value_eur: 1_585_000_000_000, last_date: "2024-07-01" },
  { code: "SE", name: "Sweden",     flag: "🇸🇪", prev_value_eur: 130_000_000_000, prev_date: "2024-01-01", last_value_eur: 129_000_000_000, last_date: "2024-07-01" }
];

// Trend-helper voor de lijst
export function trendFor(c){
  return c.last_value_eur - c.prev_value_eur;
}

// Interpolatie met DOOREXTRAPOLATIE (geen 180-dagen cap)
export function interpolateDebt(c, atMs){
  const t0 = new Date(c.prev_date).getTime();
  const t1 = new Date(c.last_date).getTime();
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;

  if (t1 <= t0) return v1;

  const rate = (v1 - v0) / (t1 - t0); // euro per millisecond

  if (atMs <= t0) {
    // extrapoleer vóór t0 (gebeurt zelden, maar zo blijft het netjes)
    return v0 + rate * (atMs - t0);
  }
  if (atMs <= t1) {
    // lineair tussen t0 en t1
    return v0 + rate * (atMs - t0);
  }
  // na t1: gewoon doorrekenen zonder limiet
  return v1 + rate * (atMs - t1);
}
