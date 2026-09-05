import DutchGovernmentBondGuide from "@/components/government-bonds/DutchGovernmentBondGuide";
import { countries } from "@/lib/data";

const SITE = "https://www.eudebtmap.com";
const PATH = "/nl/staatsobligaties-nederland";
const PAGE_URL = `${SITE}${PATH}`;
const IMAGE = `${SITE}/images/guides/nederlandse-staatsobligaties-kopen-hero.jpg`;

export const metadata = {
  metadataBase: new URL(SITE),
  title: "Nederlandse staatsobligaties kopen: stappen en risico’s",
  description:
    "Nederlandse staatsobligaties kopen kan via een bank of broker. Bekijk de praktische stappen, ISIN, kosten, rendement, risico’s en officiële bronnen.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Nederlandse staatsobligaties kopen: stappen en risico’s",
    description:
      "Een onafhankelijke uitleg over de kooproute, marktprijs, ISIN, kosten en risico’s van Nederlandse staatsobligaties.",
    url: PAGE_URL,
    siteName: "EU Debt Map",
    locale: "nl_NL",
    type: "article",
    images: [
      {
        url: IMAGE,
        width: 1672,
        height: 941,
        alt: "Particuliere belegger die informatie over Nederlandse staatsobligaties bestudeert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nederlandse staatsobligaties kopen: stappen en risico’s",
    description:
      "Praktische uitleg over de kooproute, ISIN, kosten, rendement en risico’s.",
    images: [IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const dynamic = "error";

export default function DutchGovernmentBondGuidePage() {
  const netherlands = countries.find((country) => country.code === "NL");
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Nederlandse staatsobligaties kopen: hoe werkt dat?",
    description: metadata.description,
    inLanguage: "nl-NL",
    datePublished: "2026-09-05",
    dateModified: "2026-09-05",
    mainEntityOfPage: PAGE_URL,
    image: [IMAGE],
    author: { "@type": "Organization", name: "EU Debt Map", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "EU Debt Map",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/eu_favicon_512.png` },
    },
  };
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "EU Debt Map", item: `${SITE}/nl` },
      { "@type": "ListItem", position: 2, name: "Nederland", item: `${SITE}/nl/country/nl` },
      { "@type": "ListItem", position: 3, name: "Nederlandse staatsobligaties kopen", item: PAGE_URL },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd).replace(/</g, "\\u003c") }}
      />
      <DutchGovernmentBondGuide country={netherlands} />
    </>
  );
}
