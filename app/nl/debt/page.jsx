// app/nl/debt/page.jsx
import Link from "next/link";
import CTASidebar from "@/components/CTASidebar";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title = "Wat is Staatsschuld? • EU Debt Map";
  const description =
    "Heldere uitleg van staatsschuld: waarom landen lenen, hoe de schuld/BBP-verhouding (debt-to-GDP) werkt en waarom dat belangrijk is voor economie en burgers.";

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
        <h2>Wat is staatsschuld?</h2>
        <p>
          <strong>Staatsschuld</strong> is het geld dat een land verschuldigd is. Je kunt het
          vergelijken met een hypotheek of studielening: grote uitgaven worden uitgesmeerd over tijd.
        </p>

        <h3>Waarom lenen overheden?</h3>
        <ul>
          <li><strong>Investeren:</strong> wegen, scholen, ziekenhuizen, schone energie.</li>
          <li><strong>Schokken opvangen:</strong> rampen, recessies, pandemieën.</li>
          <li><strong>Tijd overbruggen:</strong> als belastinginkomsten en uitgaven niet gelijk lopen.</li>
        </ul>

        <h3>Hoe meten we schuld?</h3>
        <p>
          We tonen schuld in euro’s (€) en als aandeel van de economie:
          de <strong>schuld/BBP-verhouding</strong> (debt-to-GDP).
        </p>
        <div className="tag" role="note" style={{ marginTop: 6, lineHeight: 1.5 }}>
          <strong>Voorbeeld:</strong> produceert een land in een jaar €1 biljoen (BBP) en
          is de schuld €500 miljard, dan is de schuld/BBP-ratio <strong>50%</strong>.
        </div>

        <h3>Waarom is schuld belangrijk?</h3>
        <ul>
          <li><strong>Rente-lasten:</strong> meer schuld = meer geld naar rente.</li>
          <li><strong>Beleidsruimte:</strong> hoge rente-lasten laten minder over voor onderwijs, zorg of lastenverlichting.</li>
          <li><strong>Stabiliteit:</strong> in de EU worden schuldniveaus gemonitord om economieën gezond te houden.</li>
        </ul>

        <h3>FAQ</h3>
        <p><strong>Van wie leent een land?</strong><br/>
          Voornamelijk beleggers die staatsobligaties kopen: banken, pensioenfondsen en soms andere landen of instellingen.
        </p>
        <p><strong>Wat is een “veilig” niveau?</strong><br/>
          Er is geen magisch getal. De EU hanteert vaak <strong>60% van het BBP</strong> als richtlijn,
          maar werkelijke niveaus verschillen per land en in de tijd.
        </p>
        <p><strong>Waar zie ik actuele cijfers?</strong><br/>
          Gebruik de <Link href="/nl" className="btn" style={{ padding: "2px 8px" }}>EU-kaart</Link> en klik op een land
          voor een live schatting op basis van de laatste referentieperioden.
        </p>

        <p className="tag" style={{ marginTop: 10 }}>
          Bronnen: Eurostat (overheidsfinanciën) en nationale ministeries van Financiën.
        </p>
      </section>

      {/* CTA-sidebar met NL-routes */}
      <CTASidebar lang="nl" homeHref="/nl" methodologyHref="/nl/methodology" />
    </main>
  );
}
