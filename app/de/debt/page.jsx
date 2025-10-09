// app/de/debt/page.jsx
import Link from "next/link";
import CTASidebar from "@/components/CTASidebar";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title = "Was ist Staatsverschuldung? • EU Debt Map";
  const description =
    "Einfache Erklärung der Staatsverschuldung: warum Länder leihen, wie die Schulden-zu-BIP-Quote funktioniert und warum sie wichtig ist.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/de${path}`,
      languages: {
        en: `${base}${path}`,
        nl: `${base}/nl${path}`,
        de: `${base}/de${path}`,
        fr: `${base}/fr${path}`,
        "x-default": `${base}${path}`,
      },
    },
    openGraph: {
      title,
      description:
        "Staatsverschuldung verständlich erklärt mit Beispielen, FAQ und Links zu offiziellen Quellen.",
      type: "article",
      url: `${base}/de${path}`,
      siteName: "EU Debt Map",
    },
  };
}

export default function DebtExplainerDE() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Was ist Staatsverschuldung?",
    inLanguage: "de",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/de/debt",
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        {/* Inhalt vorerst auf Englisch */}
        <h2>What is Government Debt?</h2>
        <p><strong>Government debt</strong> is the money a country owes...</p>
        {/* ... (zelfde content als EN) ... */}
      </section>

      <CTASidebar lang="de" homeHref="/de" methodologyHref="/de/methodology" />
    </main>
  );
}
