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

function formatFrenchQuarter(value) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(value || "").trim());
  return match ? `T${match[2]} ${match[1]}` : value;
}

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
  const ratio = Number(c?.official_debt_to_gdp_pct);
  const ratioPeriod = c?.official_debt_to_gdp_time || "";
  const ratioYear = ratioPeriod.slice(0, 4) || "2026";
  const ratioText = Number.isFinite(ratio)
    ? `${ratio.toLocaleString("fr-FR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })} %`
    : null;
  const isFrance = code === "fr";
  const ratioPeriodText = formatFrenchQuarter(ratioPeriod);
  const url = `${SITE}/fr/country/${code}`;

  return {
    title: isFrance
      ? `Dette publique de la France en direct ${ratioYear} | EU Debt Map`
      : ratioText
      ? `Dette publique ${name} : direct et ${ratioText} du PIB (${ratioYear}) | EU Debt Map`
      : `Dette publique ${name} (en direct) | EU Debt Map`,
    description: isFrance
      ? ratioText
        ? `Dette publique de la France en direct : estimation par seconde fondée sur Eurostat, ratio officiel de ${ratioText} au ${ratioPeriodText} et méthode transparente.`
        : "Dette publique de la France en direct : estimation par seconde fondée sur les données officielles d’Eurostat et méthode transparente."
      : ratioText
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

export default async function CountryPageFR({ params }) {
  const { code } = await params;
  const cc = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === cc
  );

  if (!country) return notFound();

  const isFrance = country.code === "FR";

  return (
    <CountryClient
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
