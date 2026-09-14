import { notFound } from "next/navigation";
import CountryPreviewExperience from "@/components/country-preview/CountryPreviewExperience";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";

export const metadata = {
  title: "Country navigation preview | EU Debt Map",
  description: "Private preview of country navigation below the live debt monitor.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return countries.map((country) => ({ code: country.code.toLowerCase() }));
}

export default async function CountryNavigationPreview({ params }) {
  const { code } = await params;
  const country = countries.find((item) => item.code.toLowerCase() === code.toLowerCase());
  if (!country) notFound();

  const name = countryName(country.code, "en");
  return (
    <CountryPreviewExperience
      country={country}
      lang="en"
      title={`${name} public debt (live)`}
      displayName={name}
      isPreview
      countryNavigationBase="/preview/country-navigation"
    />
  );
}
