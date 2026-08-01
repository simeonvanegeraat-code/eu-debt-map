// app/nl/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "@/app/country/[code]/CountryClient";
import CountryIntro from "@/components/CountryIntro";
import CountryRelatedArticleServer from "@/components/CountryRelatedArticleServer";
import { countryName } from "@/lib/countries";

const SITE = "https://www.eudebtmap.com";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const code = String(params.code).toLowerCase();
  const name = countryName(code.toUpperCase(), "nl") || code.toUpperCase();
  const country = countries.find((item) => item.code === code.toUpperCase());
  const ratio = Number(country?.official_debt_to_gdp_pct);
  const ratioPeriod = country?.official_debt_to_gdp_time || "";
  const ratioYear = ratioPeriod.slice(0, 4) || "2026";
  const ratioText = Number.isFinite(ratio)
    ? `${ratio.toLocaleString("nl-NL", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`
    : null;
  const url = `${SITE}/nl/country/${code}`;

  return {
    title: ratioText
      ? `Staatsschuld ${name}: live en ${ratioText} van bbp (${ratioYear}) | EU Debt Map`
      : `Staatsschuld ${name} (live) | EU Debt Map`,
    description: ratioText
      ? `Bekijk de staatsschuld van ${name} live en de officiële Eurostat-schuldquote van ${ratioText} voor ${ratioPeriod}.`
      : `Bekijk de staatsschuld van ${name} live met een actuele schatting op basis van Eurostat. Inclusief schuldniveau en bbp-verhouding.`,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE}/country/${code}`,
        nl: `${SITE}/nl/country/${code}`,
        de: `${SITE}/de/country/${code}`,
        fr: `${SITE}/fr/country/${code}`,
      },
    },
  };
}

export const dynamic = "error";

export default function CountryPageNL({ params: { code } }) {
  const cc = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === cc
  );
  if (!country) return notFound();

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient
          country={country}
          lang="nl"
          introSlot={<CountryIntro country={country} lang="nl" />}
          relatedArticleSlot={
            <CountryRelatedArticleServer code={country.code} lang="nl" />
          }
        />
      </section>
    </main>
  );
}
