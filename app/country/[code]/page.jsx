// app/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "./CountryClient";
import CountryIntro from "@/components/CountryIntro";
import { countryName } from "@/lib/countries";
import { getLocaleFromPathname, withLocale } from "@/lib/locale";
import { getLatestGDPForGeoEUR } from "@/lib/eurostat.gen"; // <--- NIEUW: Live data functie

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const code = params.code?.toUpperCase() || "";
  const lang = getLocaleFromPathname?.() || "en";
  const name = countryName(code, lang);

  const base = "https://www.eudebtmap.com";
  const path = `/country/${code.toLowerCase()}`;

  const titleMap = {
    en: `${name} public debt & GDP ratio (live) | EU Debt Map`,
    nl: `${name} staatsschuld & bbp-verhouding (live) | EU Debt Map`,
    de: `${name} Staatsverschuldung & BIP-Verhältnis (live) | EU Debt Map`,
    fr: `${name} dette publique & ratio PIB (en direct) | EU Debt Map`,
  };
  const descMap = {
    en: `Track ${name}’s estimated public debt and debt-to-GDP ratio, updated live from Eurostat.`,
    nl: `Bekijk de geschatte staatsschuld van ${name} en de schuld-/bbp-verhouding, live bijgewerkt via Eurostat.`,
    de: `Verfolge die geschätzte Staatsverschuldung von ${name} und das Schulden-zu-BIP-Verhältnis, live von Eurostat.`,
    fr: `Suivez la dette publique estimée de ${name} et son ratio dette/PIB, mis à jour en direct à partir d’Eurostat.`,
  };

  return {
    title: titleMap[lang] || titleMap.en,
    description: descMap[lang] || descMap.en,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        "x-default": `${base}${path}`,
        en: `${base}${withLocale(path, "")}`,
        nl: `${base}${withLocale(path, "nl")}`,
        de: `${base}${withLocale(path, "de")}`,
        fr: `${base}${withLocale(path, "fr")}`,
      },
    },
    openGraph: {
      title: titleMap[lang] || titleMap.en,
      description: descMap[lang] || descMap.en,
      url: `${base}${withLocale(path, lang)}`,
      type: "website",
      images: [
        {
          url: `${base}/og/country-${code.toLowerCase()}.png`,
          width: 1200,
          height: 630,
          alt: `${name} public debt live`,
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

export const dynamic = "force-dynamic"; // <--- BELANGRIJK: Zorgt dat hij de data live ophaalt, niet cached!

export default async function CountryPage({ params: { code } }) {
  const want = String(code).toLowerCase();
  
  // 1. Haal de basisdata uit de statische lijst
  const staticCountry = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!staticCountry) return notFound();

  // 2. Haal LIVE de 'gecorrigeerde' GDP op (met jouw 5.5% fix)
  const gdpData = await getLatestGDPForGeoEUR(staticCountry.code);
  
  // 3. Maak een "Enriched" object met de nieuwe GDP
  // We overschrijven de statische 'gdp' waarde met de nieuwe berekende waarde.
  const country = {
    ...staticCountry,
    gdp: gdpData.valueEUR || staticCountry.gdp, // De nieuwe, hogere GDP
    // We geven ook de periode mee voor de UI (hopelijk pakt CountryClient dit op)
    gdpPeriod: gdpData.period 
      ? `${gdpData.period} (Live Estimate)` 
      : "Live Estimate" 
  };

  const rawLang = getLocaleFromPathname?.() || "en";
  const lang = ["en", "nl", "de", "fr"].includes(rawLang) ? rawLang : "en";
  const localizedCountry = { ...country, name: countryName(country.code, lang) };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient
          country={localizedCountry}
          lang={lang}
          introSlot={<CountryIntro country={localizedCountry} lang={lang} />}
        />
      </section>
    </main>
  );
}