import LocalizedDebtGuidePage from "@/components/debt-guide/LocalizedDebtGuidePage";

export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/nl/debt";
  const title =
    "Wat is overheidsschuld? Schuld, tekort en obligaties uitgelegd | EU Debt Map";
  const description =
    "Eenvoudige uitleg over overheidsschuld: wat publieke schuld is, het verschil tussen schuld en tekort, hoe staatsobligaties werken, wie de overheid geld leent en waarom schuld/bbp belangrijk is.";

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt`,
        nl: `${base}${path}`,
        de: `${base}/de/debt`,
        fr: `${base}/fr/debt`,
        "x-default": `${base}/debt`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      images: [{
        url: "/og/debt-explainer-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Uitleg overheidsschuld",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/debt-explainer-1200x630.jpg"],
    },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export default function DebtExplainerNL() {
  return <LocalizedDebtGuidePage lang="nl" />;
}
