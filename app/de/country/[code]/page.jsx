import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
// Let op de import pad: we verwijzen nu naar de component in de bovenliggende map
import CountryClient from "@/app/country/[code]/CountryClient";
import CountryIntro from "@/components/CountryIntro";
import { countryName } from "@/lib/countries";
import { withLocale } from "@/lib/locale";
import { getLatestGDPForGeoEUR } from "@/lib/eurostat.live";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const code = params.code?.toUpperCase() || "";
  // We forceren hier 'de' omdat we in de Duitse map zitten
  const lang = "de";
  const name = countryName(code, lang);

  const base = "https://www.eudebtmap.com";
  // Basis pad zonder taal prefix voor canonicals
  const path = `/country/${code.toLowerCase()}`;

  // --- AANPASSING VOOR SEO: Schuldenuhr ---
  // Dit is wat Google leest voor de blauwe link in de zoekresultaten
  const title = `${name} Schuldenuhr: Aktuelle Staatsverschuldung (Live) | EU Debt Map`;
  const desc = `Verfolge die offizielle Schuldenuhr von ${name} live. Aktuelle Staatsverschuldung, Pro-Kopf-Verschuldung und BIP-Verhältnis in Echtzeit.`;

  return {
    title: title,
    description: desc,
    alternates: {
      canonical: `${base}${withLocale(path, "de")}`,
      languages: {
        "x-default": `${base}${path}`,
        en: `${base}${withLocale(path, "")}`,
        nl: `${base}${withLocale(path, "nl")}`,
        de: `${base}${withLocale(path, "de")}`,
        fr: `${base}${withLocale(path, "fr")}`,
      },
    },
    openGraph: {
      title: title,
      description: desc,
      url: `${base}${withLocale(path, lang)}`,
      type: "website",
      images: [
        {
          url: `${base}/og/country-${code.toLowerCase()}.png`,
          width: 1200,
          height: 630,
          alt: `${name} Schuldenuhr Live`,
        },
        {
          url: `${base}/og/eu-debt-map.jpg`,
          width: 1200,
          height: 630,
          alt: "EU Debt Map",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

// BELANGRIJK: Force dynamic om de live data fetch te laten werken
export const dynamic = "force-dynamic";

export default async function CountryPageDE({ params: { code } }) {
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  // 1. Haal LIVE de correcte GDP data op (Quarterly Run Rate), net als in de Engelse versie
  const { valueEUR, period } = await getLatestGDPForGeoEUR(country.code);

  const lang = "de";
  const localizedCountry = { ...country, name: countryName(country.code, lang) };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient
          country={localizedCountry}
          lang={lang}
          introSlot={<CountryIntro country={localizedCountry} lang={lang} />}
          // 2. Geef data door aan SSR, zodat Google en gebruiker direct Q3 2025 zien
          gdpAbs={valueEUR}
          gdpPeriod={period}
        />
      </section>
    </main>
  );
}