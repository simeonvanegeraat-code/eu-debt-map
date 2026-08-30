import MethodologyPreviewPage from "@/components/methodology-preview/MethodologyPreviewPage";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";

export async function generateMetadata() {
  const title = "Methodology | How EU Debt Map Calculates Live Government Debt";
  const description =
    "See how EU Debt Map uses Eurostat data to calculate live government debt estimates for all EU-27 countries, including sources, filters, formulas, limitations, and update logic.";

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: `${SITE}${PATH}`,
      languages: {
        en: `${SITE}${PATH}`,
        nl: `${SITE}/nl${PATH}`,
        de: `${SITE}/de${PATH}`,
        fr: `${SITE}/fr${PATH}`,
        "x-default": `${SITE}${PATH}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE}${PATH}`,
      siteName: "EU Debt Map",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  };
}

export default function MethodologyPage() {
  return <MethodologyPreviewPage />;
}
