import MethodologyPreviewPage from "@/components/methodology-preview/MethodologyPreviewPage";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";

export async function generateMetadata() {
  const title = "Methodik | Wie EU Debt Map Live-Staatsschulden berechnet";
  const description =
    "Erfahren Sie, wie EU Debt Map Eurostat-Daten nutzt, um Live-Schätzungen der Staatsschulden für alle EU-27-Länder zu berechnen, einschließlich Quellen, Filtern, Berechnung, Grenzen und Updates.";

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
