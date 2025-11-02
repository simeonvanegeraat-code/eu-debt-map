// app/nl/stability-and-growth-pact/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA (NL)
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/nl/stability-and-growth-pact";
  const title = "Stabiliteits- en Groeipact (SGP): basis, regels en waarom het telt • EU Debt Map";
  const description =
    "In begrijpelijke taal: doelen van het SGP, regels rond schuld en tekort, de rol van de schuld-bbp-ratio, en veelgestelde vragen. Inclusief links naar de methodologie en de live EU-kaart.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/stability-and-growth-pact`,
        nl: `${base}${path}`,
        de: `${base}/de/stability-and-growth-pact`,
        fr: `${base}/fr/stability-and-growth-pact`,
        "x-default": `${base}/stability-and-growth-pact`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      images: [{ url: "/og/debt-explainer-1200x630.jpg", width: 1200, height: 630, alt: "Stabiliteits- en Groeipact" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og/debt-explainer-1200x630.jpg"] },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

function Pill({ children }) {
  return (
    <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:999, background:"var(--muted, #f3f4f6)", fontSize:12, marginRight:6 }}>
      {children}
    </span>
  );
}

export default function SgpNL() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Stabiliteits- en Groeipact (SGP): basis, regels en waarom het telt",
    inLanguage: "nl",
    mainEntityOfPage: "https://www.eudebtmap.com/nl/stability-and-growth-pact",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    about: ["Stabiliteits- en Groeipact","SGP","EU-fiscale regels","schuld-bbp","tekortregels"],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type":"Question", name:"Wat is het doel van het SGP?", acceptedAnswer:{ "@type":"Answer", text:"Het borgen van houdbare overheidsfinanciën in EU‑lidstaten, via gedeelde ankers voor schuld en tekort." } },
      { "@type":"Question", name:"Moet elk land hetzelfde getal halen?", acceptedAnswer:{ "@type":"Answer", text:"Nee. Houdbaarheid hangt af van het pad, de groei, rentes en begrotingskeuzes per land." } },
      { "@type":"Question", name:"Waar zie ik actuele cijfers?", acceptedAnswer:{ "@type":"Answer", text:"Op EU Debt Map: per land een live tikkende schatting op basis van de laatste referentiedata." } }
    ]
  };

  const breadcrumbsLd = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    itemListElement:[
      { "@type":"ListItem", position:1, name:"Home", item:"https://www.eudebtmap.com/nl" },
      { "@type":"ListItem", position:2, name:"Stabiliteits- en Groeipact", item:"https://www.eudebtmap.com/nl/stability-and-growth-pact" }
    ]
  };

  return (
    <main className="container grid" style={{ alignItems:"start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

      <section className="card section" style={{ gridColumn:"1 / -1" }}>
        <header>
          <h1 className="hero-title" style={{ fontSize:"clamp(1.8rem, 4vw + 1rem, 3rem)", background:"linear-gradient(90deg, #2563eb, #00875a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:0 }}>
            Stabiliteits- en Groeipact (SGP)
          </h1>
          <div style={{ maxWidth:"68ch" }}>
            <p className="hero-lede" style={{ marginTop:8 }}>
              Wat de EU‑regels proberen te bereiken, hoe schuld- en tekortankers werken en waarom het <em>pad</em> van de schuld net zo belangrijk is als het niveau.
            </p>
          </div>
        </header>
      </section>

      <article className="card section" style={{ gridColumn:"1 / -1" }}>
        <section>
          <h2 className="article-title">Wat het SGP probeert te doen</h2>
          <p>Het SGP coördineert begrotingsbeleid zodat de overheidsfinanciën <strong>houdbaar</strong> blijven. Het zet gezamenlijke ankers voor <strong>tekorten</strong> en <strong>schuld</strong>, met ruimte voor nationale keuzes.</p>
          <div className="tag" style={{ marginTop:8 }}>Kort: prikkels uitlijnen, risico’s verlagen, de muntunie stabiel houden.</div>
        </section>

        <section>
          <h2 className="article-title">Kernideeën</h2>
          <p><Pill>Schuldhoudbaarheid</Pill><Pill>Gezonde begrotingspaden</Pill><Pill>Vergelijkbaarheid</Pill></p>
          <ul>
            <li><strong>Pad telt:</strong> niet alleen het niveau, maar waar de schuldquote heen beweegt.</li>
            <li><strong>Discipline:</strong> jaarlijkse gaten beheersbaar houden.</li>
            <li><strong>Gezamenlijke maatstaven:</strong> schuld‑bbp maakt landen vergelijkbaar.</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">Schuld, tekort en schuld‑bbp</h2>
          <p>Het SGP scheidt het jaarlijkse <strong>tekort</strong> (stroom) van de totale <strong>schuld</strong> (voorraad). Vergelijken doen we via de <strong>schuld‑bbp‑ratio</strong>.</p>
          <p className="tag" style={{ marginTop:8 }}>
            Verder lezen: <Link href="/nl/debt">Wat is Schuld?</Link> · <Link href="/nl/debt-vs-deficit">Schuld vs Tekort</Link> · <Link href="/nl/debt-to-gdp">Schuld‑bbp uitgelegd</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">Waarom dit telt voor burgers</h2>
          <ul>
            <li><strong>Rentelast:</strong> rente-uitgaven drukken op onderwijs of zorg.</li>
            <li><strong>Stabiliteit:</strong> gezamenlijke regels verlagen het risico op crises.</li>
            <li><strong>Beleidsruimte:</strong> betere dynamiek = meer ruimte voor investeringen en schokdemping.</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>
          <details className="debt-faq"><summary>Bestaat er één ‘veilig’ getal voor schuld?</summary><p className="tag" style={{ marginTop:8 }}>Nee. Houdbaarheid hangt af van groei, rente, demografie en geloofwaardige paden.</p></details>
          <details className="debt-faq"><summary>Remmen de regels investeringen af?</summary><p className="tag" style={{ marginTop:8 }}>Doel is juist duurzame investeringen mogelijk te maken door de schuld op een stabiel pad te houden.</p></details>
          <details className="debt-faq"><summary>Waar zie ik actuele cijfers?</summary><p className="tag" style={{ marginTop:8 }}>Ga naar de{" "}<Link href="/nl" className="btn" style={{ padding:"2px 8px" }}>EU‑kaart</Link>{" "}en kies een land.</p></details>

          <div className="cta card" style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
            <Link href="/nl" className="btn">Bekijk de kaart →</Link>
            <Link href="/nl/debt" className="btn">Wat is Schuld? →</Link>
            <Link href="/nl/debt-to-gdp" className="btn">Schuld‑bbp →</Link>
            <Link href="/nl/methodology" className="btn">Methodologie →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
