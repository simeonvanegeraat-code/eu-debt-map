// app/country/[code]/page.jsx
import { countries } from "@/lib/data";
import CountryClient from "./CountryClient";

// Helpertjes
function findCountry(code) {
  const want = String(code).toLowerCase();
  return countries.find((x) => x.code.toLowerCase() === want) || null;
}
const nf0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

// Dynamische SEO per land
export async function generateMetadata({ params }) {
  const c = findCountry(params.code);
  if (!c) {
    return {
      title: `Unknown country | EU Debt Map`,
      description: `Country code ${String(params.code).toUpperCase()} is not part of the EU-27.`,
    };
  }

  const title = `${c.name} national debt | EU Debt Map`;
  const desc = `Live ticking estimate of ${c.name}'s government debt. Based on Eurostat (last two quarters ${c.prev_date} → ${c.last_date}). Current level around €${nf0.format(
    Math.round(c.last_value_eur || 0)
  )}.`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "article",
    },
    alternates: {
      canonical: `/country/${c.code.toLowerCase()}`,
    },
  };
}

export default function CountryPage({ params: { code } }) {
  const c = findCountry(code);
  if (!c) {
    return (
      <main className="container card">
        Unknown country: {String(code).toUpperCase()}
      </main>
    );
  }
  // Render de client UI (teller + ads)
  return <CountryClient countryCode={c.code} />;
}
export async function generateMetadata({ params }) {
  const c = findCountry(params.code);
  if (!c) return { title: "Unknown country | EU Debt Map" };

  return {
    title: `${c.name} national debt | EU Debt Map`,
    description: `Live ticking estimate of ${c.name}'s government debt...`,
    alternates: {
      canonical: `/country/${c.code.toLowerCase()}`,
      languages: {
        "en": `/country/${c.code.toLowerCase()}`,
        "nl": `/nl/country/${c.code.toLowerCase()}`,
        "de": `/de/country/${c.code.toLowerCase()}`,
        "fr": `/fr/country/${c.code.toLowerCase()}`,
        "x-default": `/country/${c.code.toLowerCase()}`,
      },
    },
  };
}

