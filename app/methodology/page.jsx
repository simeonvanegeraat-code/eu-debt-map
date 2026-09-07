import MethodologyPreviewPage from "@/components/methodology-preview/MethodologyPreviewPage";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";

export async function generateMetadata() {
  const title = "Methodology & Eurostat Sources | EU Debt Map";
  const description =
    "Trace European government debt, budget balances, interest, spending and revenue back to Eurostat. Official observations, EU Debt Map calculations and live estimates are clearly separated.";

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
