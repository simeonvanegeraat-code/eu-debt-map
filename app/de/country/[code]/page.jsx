import { countryFiscalDescription } from "@/lib/fiscal/discovery";
import { createCountryFiscalSlots } from "@/components/country/CountryFiscalDashboard";
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "@/app/country/[code]/CountryClient";
import CountryIntro from "@/components/CountryIntro";
import CountryRelatedArticleServer from "@/components/CountryRelatedArticleServer";
import GermanyDebtClockBreadcrumbs from "@/components/GermanyDebtClockBreadcrumbs";
import GermanyDebtClockIntro from "@/components/GermanyDebtClockIntro";
import { countryName } from "@/lib/countries";
import { withLocale } from "@/lib/locale";

const GERMANY_ARTICLE_SLUG =
  "aktuelle-staatsverschuldung-deutschland-live-schuldenuhr";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const { code: routeCode } = await params;
  const code = routeCode?.toUpperCase() || "";
  const lang = "de";
  const name = countryName(code, lang);
  const country = countries.find((item) => item.code === code);
  const ratio = country?.official_debt_to_gdp_pct;
  const ratioPeriod = country?.official_debt_to_gdp_time || "";
  const ratioYear = ratioPeriod.slice(0, 4) || "2026";
  const ratioText = Number.isFinite(ratio)
    ? `${ratio.toLocaleString("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`
    : null;
  const isGermany = code === "DE";

  const base = "https://www.eudebtmap.com";
  const path = `/country/${code.toLowerCase()}`;

  const title = isGermany
    ? `Schuldenuhr Deutschland live ${ratioYear} | EU Debt Map`
    : ratioText
    ? `${name} Staatsschulden: live & ${ratioText} des BIP (${ratioYear}) | EU Debt Map`
    : `${name} Schuldenuhr (live) | EU Debt Map`;
  const desc = countryFiscalDescription({ name, lang: "de", ratio, period: ratioPeriod });

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
          alt: isGermany
            ? "Schuldenuhr Deutschland live"
            : `${name} Schuldenuhr live`,
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

export default async function CountryPageDE({ params }) {
  const { code } = await params;
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  const lang = "de";
  const localizedCountry = { ...country, name: countryName(country.code, lang) };
  const isGermany = localizedCountry.code === "DE";

  const fiscal = createCountryFiscalSlots(country.code, "de");

  return (
    <CountryClient
      fiscalOverviewSlot={fiscal.overview}
      fiscalTrendsSlot={fiscal.trends}
      fiscalComparisonSlot={fiscal.comparisons}
      country={localizedCountry}
      lang={lang}
      breadcrumbSlot={isGermany ? <GermanyDebtClockBreadcrumbs /> : null}
      titleOverride={isGermany ? "Schuldenuhr Deutschland (live)" : null}
      introSlot={
        isGermany ? (
          <GermanyDebtClockIntro />
        ) : (
          <CountryIntro country={localizedCountry} lang={lang} />
        )
      }
      relatedArticleSlot={
        <CountryRelatedArticleServer
          code={localizedCountry.code}
          lang={lang}
          preferredSlug={isGermany ? GERMANY_ARTICLE_SLUG : null}
        />
      }
    />
  );
}
