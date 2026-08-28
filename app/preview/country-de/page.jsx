import { countries } from "@/lib/data";
import CountryPageExperience from "@/components/country/CountryPageExperience";

export const metadata = {
  title: "Germany country page design preview | EU Debt Map",
  description: "Private design preview for a redesigned EU Debt Map country page.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const dynamic = "error";

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

export default function GermanyCountryPagePreview() {
  const country = countries.find((item) => item.code === "DE");
  const rankedCountries = countries
    .filter((item) => Number.isFinite(Number(item.official_debt_to_gdp_pct)))
    .sort(
      (a, b) =>
        Number(b.official_debt_to_gdp_pct) - Number(a.official_debt_to_gdp_pct)
    );
  const ratioValues = rankedCountries.map((item) =>
    Number(item.official_debt_to_gdp_pct)
  );
  const rank = rankedCountries.findIndex((item) => item.code === "DE") + 1;
  const comparisonCodes = new Set(["GR", "IT", "FR", "DE", "NL", "EE"]);
  const comparisons = rankedCountries
    .filter((item) => comparisonCodes.has(item.code))
    .map((item) => ({
      code: item.code,
      name: item.name,
      ratio: Number(item.official_debt_to_gdp_pct),
    }));
  const exploreCountries = ["FR", "IT", "NL", "ES", "GR"]
    .map((code) => countries.find((item) => item.code === code))
    .filter(Boolean)
    .map((item) => ({
      code: item.code,
      name: item.name,
      ratio: Number(item.official_debt_to_gdp_pct),
    }));

  return (
    <CountryPageExperience
      country={country}
      lang="en"
      title="Germany’s public debt"
      isPreview
      rank={rank}
      rankedCount={rankedCountries.length}
      euMedian={median(ratioValues)}
      comparisons={comparisons}
      exploreCountries={exploreCountries}
    />
  );
}
