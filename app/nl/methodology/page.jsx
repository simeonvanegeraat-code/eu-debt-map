import MethodologyPreviewPage from "@/components/methodology-preview/MethodologyPreviewPage";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";

export async function generateMetadata() {
  const title = "Methodologie & Eurostat-bronnen | EU Debt Map";
  const description =
    "Herleid Europese overheidsschuld, begrotingssaldi, rente, uitgaven en inkomsten tot Eurostat. Officiële waarnemingen, berekeningen van EU Debt Map en live schattingen worden duidelijk onderscheiden.";

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: `${SITE}/nl${PATH}`,
      languages: {
        en: `${SITE}${PATH}`,
        nl: `${SITE}/nl${PATH}`,
        de: `${SITE}/de${PATH}`,
        fr: `${SITE}/fr${PATH}`,
        "x-default": `${SITE}${PATH}`,
      },
    },
    openGraph: { title, description, url: `${SITE}/nl${PATH}`, siteName: "EU Debt Map", type: "article" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export default function MethodologyPageNL() {
  return <MethodologyPreviewPage lang="nl" />;
}
