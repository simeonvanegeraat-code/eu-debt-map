// app/fr/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";
import CountryClient from "@/app/country/[code]/CountryClient";
import CountryIntro from "@/components/CountryIntro";

const SITE = "https://www.eudebtmap.com";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const code = String(params.code).toLowerCase();
  const c = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === code
  );

  const name = countryName(code.toUpperCase(), "fr") || c?.name || code.toUpperCase();
  const ratio = Number(c?.official_debt_to_gdp_pct);
  const ratioPeriod = c?.official_debt_to_gdp_time || "";
  const ratioYear = ratioPeriod.slice(0, 4) || "2026";
  const ratioText = Number.isFinite(ratio)
    ? `${ratio.toLocaleString("fr-FR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })} %`
    : null;
  const url = `${SITE}/fr/country/${code}`;

  return {
    title: ratioText
      ? `Dette publique ${name} : direct et ${ratioText} du PIB (${ratioYear}) | EU Debt Map`
      : `Dette publique ${name} (en direct) | EU Debt Map`,
    description: ratioText
      ? `Suivez la dette publique de ${name} en direct et consultez le ratio officiel d’Eurostat de ${ratioText} pour ${ratioPeriod}.`
      : `Suivez la dette publique de ${name} en direct avec une estimation actuelle basée sur Eurostat. Inclut le niveau de dette et le ratio dette/PIB.`,
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

export default function CountryPageFR({ params: { code } }) {
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
          lang="fr"
          introSlot={<CountryIntro country={country} lang="fr" />}
        />
      </section>
    </main>
  );
}
