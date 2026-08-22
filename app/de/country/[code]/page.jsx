import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "@/app/country/[code]/CountryClient";
import CountryIntro from "@/components/CountryIntro";
import CountryRelatedArticleServer from "@/components/CountryRelatedArticleServer";
import { countryName } from "@/lib/countries";
import { withLocale } from "@/lib/locale";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const code = params.code?.toUpperCase() || "";
  const lang = "de";
  const name = countryName(code, lang);
  const country = countries.find((item) => item.code === code);
  const ratio = Number(country?.official_debt_to_gdp_pct);
  const ratioPeriod = country?.official_debt_to_gdp_time || "";
  const ratioYear = ratioPeriod.slice(0, 4) || "2026";
  const ratioText = Number.isFinite(ratio)
    ? `${ratio.toLocaleString("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`
    : null;

  const base = "https://www.eudebtmap.com";
  const path = `/country/${code.toLowerCase()}`;

  const title = ratioText
    ? `${name} Staatsschulden: live & ${ratioText} des BIP (${ratioYear}) | EU Debt Map`
    : `${name} Schuldenuhr (live) | EU Debt Map`;
  const desc = ratioText
    ? `Verfolgen Sie die Staatsschulden von ${name} live und sehen Sie die offizielle Eurostat-Schuldenquote von ${ratioText} für ${ratioPeriod}.`
    : `Verfolge die Staatsverschuldung von ${name} live mit einer aktuellen Schätzung auf Basis von Eurostat. Inklusive Schuldenstand und BIP-Verhältnis.`;

  return {
    title,
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
      title,
      description: desc,
      url: `${base}${withLocale(path, lang)}`,
      type: "website",
      images: [
        {
          url: `${base}/country/${code.toLowerCase()}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${name} Schuldenuhr live`,
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

export const dynamic = "error";

export default async function CountryPageDE({ params: { code } }) {
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  const lang = "de";
  const localizedCountry = { ...country, name: countryName(country.code, lang) };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient
          country={localizedCountry}
          lang={lang}
          introSlot={<CountryIntro country={localizedCountry} lang={lang} />}
          relatedArticleSlot={
            <CountryRelatedArticleServer code={localizedCountry.code} lang={lang} />
          }
        />
      </section>
    </main>
  );
}
