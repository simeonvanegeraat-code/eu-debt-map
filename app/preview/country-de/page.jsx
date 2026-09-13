import { countries } from "@/lib/data";
import CountryPreviewExperience from "@/components/country-preview/CountryPreviewExperience";

export const metadata = {
  title: "Germany country page design preview | EU Debt Map",
  description: "Private design preview for a redesigned EU Debt Map country page.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const dynamic = "error";

export default function GermanyCountryPagePreview() {
  const country = countries.find((item) => item.code === "DE");

  return (
    <CountryPreviewExperience
      country={country}
      lang="en"
      title="Germany’s public debt"
      isPreview
    />
  );
}
