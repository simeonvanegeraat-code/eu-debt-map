import MethodologyPreviewPage from "@/components/methodology-preview/MethodologyPreviewPage";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";

export async function generateMetadata() {
  const title = "Méthodologie | Comment EU Debt Map calcule la dette publique en direct";
  const description =
    "Découvrez comment EU Debt Map utilise les données Eurostat pour calculer des estimations en direct de la dette publique pour les 27 pays de l’UE, avec sources, filtres, calcul, limites et mises à jour.";

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
