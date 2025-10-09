// app/fr/debt/page.jsx
import Link from "next/link";
import CTASidebar from "@/components/CTASidebar";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title = "Qu’est-ce que la dette publique ? • EU Debt Map";
  const description =
    "Explication simple de la dette publique : pourquoi les pays empruntent, comment fonctionne le ratio dette/PIB et pourquoi cela compte.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/fr${path}`,
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
        "La dette publique expliquée simplement avec des exemples, une FAQ et des liens vers des sources officielles.",
      type: "article",
      url: `${base}/fr${path}`,
      siteName: "EU Debt Map",
    },
  };
}

export default function DebtExplainerFR() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Qu’est-ce que la dette publique ?",
    inLanguage: "fr",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/fr/debt",
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        {/* Contenu provisoirement en anglais */}
        <h2>What is Government Debt?</h2>
        <p><strong>Government debt</strong> is the money a country owes...</p>
        {/* ... */}
      </section>

      <CTASidebar lang="fr" homeHref="/fr" methodologyHref="/fr/methodology" />
    </main>
  );
}
