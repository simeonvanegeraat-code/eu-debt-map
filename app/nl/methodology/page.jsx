// app/nl/methodology/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/methodology";
  const title = "Methodologie • EU Debt Map";
  const description =
    "Hoe EU Debt Map data verzamelt, omzet en interpoleert voor een live schatting van de EU-27 staatsschuld.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/nl${path}`,
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
        "Datasets, filters, conversie en de live-tellerinterpolatie gebruikt door EU Debt Map.",
      url: `${base}/nl${path}`,
      siteName: "EU Debt Map",
      type: "article",
    },
  };
}

export default function MethodologyPageNL() {
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

      {/* Inhoud voorlopig Engels */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Methodology</h2>
        <p style={{ margin: 0 }}>This page explains the data source...</p>
      </section>
    </main>
  );
}
