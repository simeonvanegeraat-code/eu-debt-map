import LocalizedDebtGuidePage from "@/components/debt-guide/LocalizedDebtGuidePage";

export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/de/debt";
  const title =
    "Was ist Staatsverschuldung? Schulden, Defizit und Anleihen einfach erklärt | EU Debt Map";
  const description =
    "Einfache Erklärung der Staatsverschuldung: was öffentliche Schulden sind, wie sie sich vom Defizit unterscheiden, wie Staatsanleihen funktionieren, wer dem Staat Geld leiht und warum die Schuldenquote wichtig ist.";

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt`,
        nl: `${base}/nl/debt`,
        de: `${base}${path}`,
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
        alt: "Erklärung der Staatsverschuldung",
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

export default function DebtExplainerDE() {
  return <LocalizedDebtGuidePage lang="de" />;
}
