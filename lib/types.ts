export type HistoryPoint = { date: string; value_eur: number };
export type Country = {
  name: string;
  code2: string;
  code3: string;
  currency: string;
  prev_value_eur: number;
  last_value_eur: number;
  prev_date: string; // ISO
  last_date: string; // ISO
  history: HistoryPoint[];
  population?: number | null;
  gdp_eur?: number | null;
};
export type Countries = Record<string, Country>;
