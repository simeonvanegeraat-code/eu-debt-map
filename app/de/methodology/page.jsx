// app/de/methodology/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/methodology";
  const title = "Methodik • EU Debt Map";
  const description =
    "Wie EU Debt Map Daten bezieht, transformiert und interpoliert, um Live-Schätzungen für die EU-27 anzuzeigen.";

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
        "Datenquelle, Filter, Konvertierung und die Live-Ticker-Interpolation von EU Debt Map.",
      url: `${base}/de${path}`,
      siteName: "EU Debt Map",
      type: "article",
    },
  };
}

export default function MethodologyPageDE() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Which data source is used?", acceptedAnswer: { "@type": "Answer", text: "Eurostat gov_10q_ggdebt..." } },
      { "@type": "Question", name: "How is the live ticker calculated?", acceptedAnswer: { "@type": "Answer", text: "Linear interpolation..." } },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {/* Inhalt vorerst Englisch */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Methodology</h2>
        <p style={{ margin: 0 }}>This page explains the data source...</p>
      </section>
    </main>
  );
}
