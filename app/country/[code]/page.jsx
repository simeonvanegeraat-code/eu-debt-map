import { countryFiscalDescription } from "@/lib/fiscal/discovery";
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryPublicPage from "@/components/country/CountryPublicPage";
import CountryIntro from "@/components/CountryIntro";
import CountryRelatedArticleServer from "@/components/CountryRelatedArticleServer";
import { countryName } from "@/lib/countries";
import { withLocale } from "@/lib/locale";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const { code: routeCode } = await params;
  const code = routeCode?.toUpperCase() || "";
  const lang = "en";
  const name = countryName(code, lang);
  const country = countries.find((item) => item.code === code);
  const ratio = country?.official_debt_to_gdp_pct;
  const ratioPeriod = country?.official_debt_to_gdp_time || "";
  const ratioYear = ratioPeriod.slice(0, 4) || "2026";
  const ratioText = Number.isFinite(ratio)
    ? `${ratio.toLocaleString("en-GB", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`
    : null;

  const base = "https://www.eudebtmap.com";
  const path = `/country/${code.toLowerCase()}`;

  const title = ratioText
    ? `${name} public debt: live & ${ratioText} of GDP (${ratioYear}) | EU Debt Map`
    : `${name} public debt (live) | EU Debt Map`;
  const description = countryFiscalDescription({ name, lang: "en", ratio, period: ratioPeriod });

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
          url: `${base}/country/${code.toLowerCase()}/opengraph-image`,
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

export const dynamic = "error";

export default async function CountryPage({ params }) {
  const { code } = await params;
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  const lang = "en";
  const localizedCountry = { ...country, name: countryName(country.code, lang) };

  return (
    <CountryPublicPage
      country={localizedCountry}
      lang={lang}
      introSlot={<CountryIntro country={localizedCountry} lang={lang} />}
      relatedArticleSlot={
        <CountryRelatedArticleServer code={localizedCountry.code} lang={lang} />
      }
    />
  );
}
