// app/nl/debt/page.jsx
import Link from "next/link";
import CTASidebar from "@/components/CTASidebar";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title = "Wat is Staatsschuld? • EU Debt Map";
  const description =
    "Eenvoudige uitleg van staatsschuld: waarom landen lenen, hoe de schuld/BBP-verhouding werkt en waarom dat ertoe doet voor economie en burgers.";

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
        "Staatsschuld uitgelegd in begrijpelijke taal met voorbeelden, FAQ en links naar officiële bronnen.",
      type: "article",
      url: `${base}/nl${path}`,
      siteName: "EU Debt Map",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function DebtExplainerNL() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wat is Staatsschuld?",
    inLanguage: "nl",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/nl/debt",
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        {/* Inhoud voorlopig Engels; later kun je vertalen */}
        <h2>What is Government Debt?</h2>
        <p>
          <strong>Government debt</strong> is the money a country owes. It’s similar to a
          family taking a mortgage to buy a house or a student loan for school:
          big costs are spread out over time.
        </p>

        <h3>Why do governments borrow?</h3>
        <ul>
          <li><strong>To build and invest:</strong> roads, schools, hospitals, clean energy.</li>
          <li><strong>To handle crises:</strong> disasters, recessions, pandemics.</li>
          <li><strong>To smooth timing:</strong> when tax income and spending don’t match.</li>
        </ul>

        <h3>How is debt measured?</h3>
        <p>
          Debt is shown in euros (€) and also as a share of the economy:
          the <strong>debt-to-GDP ratio</strong>.
        </p>
        <div className="tag" role="note" style={{ marginTop: 6, lineHeight: 1.5 }}>
          <strong>Example:</strong> If a country produces €1 trillion in a year (GDP) and
          owes €500 billion, the debt-to-GDP ratio is <strong>50%</strong>.
        </div>

        <h3>Why does debt matter?</h3>
        <ul>
          <li><strong>Interest costs:</strong> more debt means more money spent on interest.</li>
          <li><strong>Policy room:</strong> high interest bills leave less for schools,
            healthcare, or tax cuts.</li>
          <li><strong>Stability:</strong> in the EU, debt levels are monitored to keep
            economies healthy and stable.</li>
        </ul>

        <h3>FAQ</h3>
        <p><strong>Who do countries borrow from?</strong><br/>
          Mostly investors who buy government bonds: banks, pension funds, and sometimes
          other countries or institutions.
        </p>
        <p><strong>What is a “safe” level of debt?</strong><br/>
          There is no single magic number. The EU often uses <strong>60% of GDP</strong>
          as a guideline, but actual levels differ by country and over time.
        </p>
        <p><strong>Where can I see current debt figures?</strong><br/>
          Use the <Link href="/nl" className="btn" style={{ padding: "2px 8px" }}>EU map</Link> and click a country for a live estimate based on the latest reference dates.
        </p>

        <p className="tag" style={{ marginTop: 10 }}>
          Sources: Eurostat (government finance statistics) and national finance ministries.
        </p>
      </section>

      <CTASidebar lang="nl" homeHref="/nl" methodologyHref="/nl/methodology" />
    </main>
  );
}
