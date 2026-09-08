import { countryFiscalDescription, countrySocialMetadata } from "@/lib/fiscal/discovery";
import { createCountryFiscalSlots } from "@/components/country/CountryFiscalDashboard";
// app/fr/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";
import CountryClient from "@/app/country/[code]/CountryClient";
import CountryIntro from "@/components/CountryIntro";
import CountryRelatedArticleServer from "@/components/CountryRelatedArticleServer";
import FranceDebtClockBreadcrumbs from "@/components/FranceDebtClockBreadcrumbs";
import FranceDebtClockIntro from "@/components/FranceDebtClockIntro";

const SITE = "https://www.eudebtmap.com";
const FRANCE_ARTICLE_SLUG = "dette-publique-france-compteur-live-record";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const { code: routeCode } = await params;
  const code = String(routeCode).toLowerCase();
  const c = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === code
  );

  const name = countryName(code.toUpperCase(), "fr") || c?.name || code.toUpperCase();
  const ratio = c?.official_debt_to_gdp_pct;
  const ratioPeriod = c?.official_debt_to_gdp_time || "";
  const ratioYear = ratioPeriod.slice(0, 4) || "2026";
  const ratioText = Number.isFinite(ratio)
    ? `${ratio.toLocaleString("fr-FR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })} %`
    : null;
  const isFrance = code === "fr";
  const url = `${SITE}/fr/country/${code}`;

  const title = isFrance
      ? `Dette publique de la France en direct ${ratioYear} | EU Debt Map`
      : ratioText
      ? `Dette publique ${name} : direct et ${ratioText} du PIB (${ratioYear}) | EU Debt Map`
      : `Dette publique ${name} (en direct) | EU Debt Map`;
  const description = countryFiscalDescription({ name, lang: "fr", ratio, period: ratioPeriod });

  return {
    title, description,
    ...countrySocialMetadata({ title, description, url, lang: "fr" }),
    alternates: {
      canonical: url,
      languages: {
        "x-default": `${SITE}/country/${code}`,
        en: `${SITE}/country/${code}`,
        nl: `${SITE}/nl/country/${code}`,
        de: `${SITE}/de/country/${code}`,
        fr: `${SITE}/fr/country/${code}`,
      },
    },
  };
}

export const dynamic = "error";

export default async function CountryPageFR({ params }) {
  const { code } = await params;
  const cc = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === cc
  );

  if (!country) return notFound();

  const isFrance = country.code === "FR";

  const fiscal = createCountryFiscalSlots(country.code, "fr");

  return (
    <CountryClient
      fiscalOverviewSlot={fiscal.overview}
      fiscalTrendsSlot={fiscal.trends}
      fiscalComparisonSlot={fiscal.comparisons}
      country={country}
      lang="fr"
      breadcrumbSlot={isFrance ? <FranceDebtClockBreadcrumbs /> : null}
      titleOverride={
        isFrance ? "Compteur de la dette publique française (en direct)" : null
      }
      introSlot={
        isFrance ? (
          <FranceDebtClockIntro country={country} />
        ) : (
          <CountryIntro country={country} lang="fr" />
        )
      }
      relatedArticleSlot={
        <CountryRelatedArticleServer
          code={country.code}
          lang="fr"
          preferredSlug={isFrance ? FRANCE_ARTICLE_SLUG : null}
        />
      }
    />
  );
}
