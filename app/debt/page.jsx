import DebtGuidePreview from "@/components/debt-guide-preview/DebtGuidePreview";

const SITE = "https://www.eudebtmap.com";
const PATH = "/debt";
const REVIEW_DATE = "2026-10-31";

export async function generateMetadata() {
  const title = "What Is Government Debt? Debt, Deficits and Bonds Explained";
  const description =
    "Understand government debt visually: see how deficits become bonds and public debt, who holds it, when it matters, and why debt-to-GDP is used.";

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
      type: "article",
      url: `${SITE}${PATH}`,
      siteName: "EU Debt Map",
      modifiedTime: REVIEW_DATE,
      images: [{
        url: "/og/debt-explainer-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Visual guide explaining government debt, deficits and bonds",
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

export default function DebtExplainer() {
  return <DebtGuidePreview lang="en" preview={false} />;
}
