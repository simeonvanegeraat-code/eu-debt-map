import MethodologyPreviewPage from "@/components/methodology-preview/MethodologyPreviewPage";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";

export async function generateMetadata() {
  const title = "Méthodologie et sources Eurostat | EU Debt Map";
  const description =
    "Retrouvez chez Eurostat l’origine des dettes publiques, soldes budgétaires, intérêts, dépenses et recettes européens. Observations officielles, calculs d’EU Debt Map et estimations en direct restent distincts.";

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: `${SITE}/fr${PATH}`,
      languages: {
        en: `${SITE}${PATH}`,
        nl: `${SITE}/nl${PATH}`,
        de: `${SITE}/de${PATH}`,
        fr: `${SITE}/fr${PATH}`,
        "x-default": `${SITE}${PATH}`,
      },
    },
    openGraph: { title, description, url: `${SITE}/fr${PATH}`, siteName: "EU Debt Map", type: "article" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export default function MethodologyPageFR() {
  return <MethodologyPreviewPage lang="fr" />;
}
