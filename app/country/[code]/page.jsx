// app/country/[code]/page.jsx
import { countries } from "@/lib/data";
import CountryClient from "./CountryClient";

// Helper
function findCountry(code) {
  const want = String(code).toLowerCase();
  return countries.find((x) => x.code.toLowerCase() === want) || null;
}

// Dynamische SEO per land + hreflang (EN, NL, DE, FR)
export async function generateMetadata({ params }) {
  const c = findCountry(params.code);

  if (!c) {
    const unknown = String(params.code).toLowerCase();
    return {
      title: `Unknown country (${unknown.toUpperCase()}) | EU Debt Map`,
      description: `Country code ${unknown.toUpperCase()} is not part of the EU-27.`,
      alternates: {
        canonical: `/country/${unknown}`,
        languages: {
          en: `/country/${unknown}`,
          nl: `/nl/country/${unknown}`,
          de: `/de/country/${unknown}`,
          fr: `/fr/country/${unknown}`,
          "x-default": `/country/${unknown}`,
        },
      },
      robots: { index: false, follow: false },
    };
  }

  const nf0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
  const approx = `€${nf0.format(Math.round(c.last_value_eur || 0))}`;

  const title = `${c.name} national debt | EU Debt Map`;
  const description = `Live ticking estimate of ${c.name}'s government debt based on Eurostat (last two quarters ${c.prev_date} → ${c.last_date}). Current level around ${approx}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `/country/${c.code.toLowerCase()}`,
      languages: {
        en: `/country/${c.code.toLowerCase()}`,
        nl: `/nl/country/${c.code.toLowerCase()}`,
        de: `/de/country/${c.code.toLowerCase()}`,
        fr: `/fr/country/${c.code.toLowerCase()}`,
        "x-default": `/country/${c.code.toLowerCase()}`,
      },
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
  return <CountryClient countryCode={c.code} />;
}
