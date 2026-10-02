import { notFound } from "next/navigation";
import CountryPreviewExperience from "@/components/country-preview/CountryPreviewExperience";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";

const LANGUAGES = ["en", "nl", "de", "fr"];

const TITLES = {
  en: (name) => `${name} public debt (live)`,
  nl: (name) => `Staatsschuld ${name} (live)`,
  de: (name) => `${name} Schuldenuhr (live)`,
  fr: (name) => `Dette publique ${name} (en direct)`,
};

export const metadata = {
  title: "Country metric animation preview | EU Debt Map",
  description: "Private preview of animated country finance metrics.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.flatMap((lang) => countries.map((country) => ({
    lang,
    code: country.code.toLowerCase(),
  })));
}

export default async function CountryMetricAnimationPreview({ params }) {
  const { lang, code } = await params;
  if (!LANGUAGES.includes(lang)) notFound();

  const country = countries.find((item) => item.code.toLowerCase() === code.toLowerCase());
  if (!country) notFound();

  const name = countryName(country.code, lang);
  return (
    <CountryPreviewExperience
      country={country}
      lang={lang}
      title={TITLES[lang](name)}
      displayName={name}
      isPreview
      animateSnapshotMetrics
      countryNavigationBase={`/preview/country-metrics/${lang}`}
    />
  );
}
