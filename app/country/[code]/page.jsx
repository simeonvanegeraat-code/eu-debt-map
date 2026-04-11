import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "./CountryClient";
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
  const lang = "en";
  const name = countryName(code, lang);

  const base = "https://www.eudebtmap.com";
  const path = `/country/${code.toLowerCase()}`;

  const title = `${name} public debt (live) | EU Debt Map`;
  const description = `Track ${name} public debt live with a real-time estimate based on Eurostat data. See debt levels, GDP ratio, and country details.`;

  return {
    title,
    description,
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
      title,
      description,
      url: `${base}${withLocale(path, "")}`,
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

export const revalidate = 3600;

export default async function CountryPage({ params: { code } }) {
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  const { valueEUR, period } = await getLatestGDPForGeoEUR(country.code);

  const lang = "en";
  const localizedCountry = { ...country, name: countryName(country.code, lang) };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1", minHeight: "600px" }}>
        <CountryClient
          country={localizedCountry}
          lang={lang}
          introSlot={<CountryIntro country={localizedCountry} lang={lang} />}
          gdpAbs={valueEUR}
          gdpPeriod={period}
        />
      </section>
    </main>
  );
}