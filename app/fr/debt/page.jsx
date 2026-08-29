import LocalizedDebtGuidePage from "@/components/debt-guide/LocalizedDebtGuidePage";

export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/fr/debt";
  const title =
    "Qu’est-ce que la dette publique ? Dette, déficit et obligations expliqués | EU Debt Map";
  const description =
    "Une explication simple de la dette publique : ce qu’est la dette de l’État, la différence avec le déficit, le fonctionnement des obligations, les prêteurs de l’État et l’importance du ratio dette/PIB.";

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt`,
        nl: `${base}/nl/debt`,
        de: `${base}/de/debt`,
        fr: `${base}${path}`,
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
        alt: "Explication de la dette publique",
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

export default function DebtExplainerFR() {
  return <LocalizedDebtGuidePage lang="fr" />;
}
