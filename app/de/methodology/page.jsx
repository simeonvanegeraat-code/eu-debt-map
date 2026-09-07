import MethodologyPreviewPage from "@/components/methodology-preview/MethodologyPreviewPage";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";

export async function generateMetadata() {
  const title = "Methodik & Eurostat-Quellen | EU Debt Map";
  const description =
    "Europäische Staatsschulden, Haushaltssalden, Zinsen, Ausgaben und Einnahmen bis zu Eurostat zurückverfolgen. Offizielle Beobachtungen, Berechnungen von EU Debt Map und Live-Schätzungen bleiben klar getrennt.";

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: `${SITE}/de${PATH}`,
      languages: {
        en: `${SITE}${PATH}`,
        nl: `${SITE}/nl${PATH}`,
        de: `${SITE}/de${PATH}`,
        fr: `${SITE}/fr${PATH}`,
        "x-default": `${SITE}${PATH}`,
      },
    },
    openGraph: { title, description, url: `${SITE}/de${PATH}`, siteName: "EU Debt Map", type: "article" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export default function MethodologyPageDE() {
  return <MethodologyPreviewPage lang="de" />;
}
