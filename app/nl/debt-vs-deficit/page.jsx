// app/nl/debt-vs-deficit/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA (NL)
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/nl/debt-vs-deficit";
  const title = "Schuld vs. Tekort — Het verschil in 5 minuten • EU Debt Map";
  const description =
    "Snap het verschil tussen overheidsschuld (voorraad) en begrotingstekort (stroom). Heldere, visuele uitleg met voorbeelden, analogie, FAQ en links naar debt-to-GDP en het Stabiliteits- en Groeipact.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt-vs-deficit`,
        nl: `${base}${path}`,
        de: `${base}/de/debt-vs-deficit`,
        fr: `${base}/fr/debt-vs-deficit`,
        "x-default": `${base}/debt-vs-deficit`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      images: [{ url: "/og/debt-explainer-1200x630.jpg", width: 1200, height: 630, alt: "Schuld vs Tekort infographic" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og/debt-explainer-1200x630.jpg"] },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

/** -----------------------------
 * INLINE SVG: Flow vs Stock
 * ----------------------------- */
function StockFlowSVG() {
  const w = 420, h = 160;
  return (
    <figure style={{ marginTop: 8 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Tekort (stroom) vs Schuld (voorraad)">
        {/* Tank (voorraad) */}
        <rect x="240" y="30" width="160" height="100" rx="10" fill="#e5e7eb" />
        <text x="320" y="88" textAnchor="middle" fontSize="12">Schuld (voorraad)</text>

        {/* Inflow (tekort) */}
        <line x1="40" y1="60" x2="220" y2="60" stroke="#10b981" strokeWidth="6" />
        <polygon points="220,56 220,64 234,60" fill="#10b981" />
        <text x="40" y="50" fontSize="12" fill="#065f46">Tekort (jaarlijkse stroom)</text>

        {/* Outflow (overschot) */}
        <line x1="320" y1="130" x2="320" y2="150" stroke="#ef4444" strokeWidth="6" />
        <text x="326" y="152" fontSize="12" fill="#7f1d1d">Aflossing / overschot</text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        Het <em>tekort</em> is een jaarlijkse <em>stroom</em>; de <em>schuld</em> is de <em>voorraad</em> die zich opbouwt (of daalt) door de tijd.
      </figcaption>
    </figure>
  );
}

/** -----------------------------
 * MAIN PAGE (NL)
 * ----------------------------- */
export default function DebtVsDeficitNL() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Schuld vs. Tekort — Het verschil in 5 minuten",
    inLanguage: "nl",
    mainEntityOfPage: "https://www.eudebtmap.com/nl/debt-vs-deficit",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    about: ["overheidsschuld","begrotingstekort","schuld vs tekort","schuld-bbp-ratio","overheidsfinanciën"],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wat is het verschil tussen schuld en tekort?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Het tekort is de jaarlijkse kloof tussen uitgaven en inkomsten; de schuld is het opgetelde totaal uit het verleden.",
        },
      },
      {
        "@type": "Question",
        name: "Kan de schuldquote dalen zonder overschot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Als de nominale groei (g) langdurig boven de rente (r) ligt, kan de schuld-bbp-ratio dalen ondanks kleine tekorten.",
        },
      },
      {
        "@type": "Question",
        name: "Waarom stijgt de schuld soms terwijl de economie groeit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Omdat het primair saldo negatief kan zijn of eenmalige factoren meespelen; die kunnen de schuld sneller laten toenemen dan het bbp.",
        },
      },
    ],
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.eudebtmap.com/nl" },
      { "@type": "ListItem", position: 2, name: "Schuld vs Tekort", item: "https://www.eudebtmap.com/nl/debt-vs-deficit" },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

      {/* HERO */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <header>
          <h1 className="hero-title" style={{
            fontSize: "clamp(1.8rem, 4vw + 1rem, 3rem)",
            background: "linear-gradient(90deg, #2563eb, #00875a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>
            Schuld vs. Tekort — Het verschil in 5 minuten
          </h1>
          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              Kort gezegd: het <strong>tekort</strong> is wat er dit jaar bij komt; de <strong>schuld</strong> is het totaal dat openstaat.
            </p>
          </div>
        </header>
      </section>

      {/* ARTICLE */}
      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">Kern: stroom vs. voorraad</h2>
          <p>
            Een <strong>begrotingstekort</strong> is een <em>stroom</em> per jaar.{" "}
            <strong>Overheidsschuld</strong> is een <em>voorraad</em> door de tijd.
          </p>
          <StockFlowSVG />
        </section>

        <section>
          <h2 className="article-title">Een herkenbare analogie</h2>
          <p>
            Denk aan je creditcard: het <strong>tekort</strong> is de nieuwe maandlast; de <strong>schuld</strong> is het totale openstaande saldo.
          </p>
        </section>

        <section>
          <h2 className="article-title">Waarom dit ertoe doet</h2>
          <ul>
            <li><strong>Korte vs. lange termijn:</strong> tekorten zijn cyclisch; schuld bouwt structureel op.</li>
            <li><strong>Rentelast:</strong> meer schuld = hogere rente en minder beleidsruimte.</li>
            <li><strong>Vergelijkbaarheid:</strong> landen vergelijk je via de <em>schuld-bbp-ratio</em>, niet via bedragen.</li>
          </ul>
          <p className="tag" style={{ marginTop: 8 }}>
            Verder lezen: <Link href="/nl/debt-to-gdp">Debt-to-GDP uitgelegd</Link> ·{" "}
            <Link href="/nl/stability-and-growth-pact">Stabiliteits- en Groeipact</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>
          <details className="debt-faq">
            <summary>Daalt de schuldquote automatisch bij overschot?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Een primair overschot helpt, maar de ratio hangt ook af van groei (g) en rente (r).
            </p>
          </details>
          <details className="debt-faq">
            <summary>Kan de ratio dalen met een klein tekort?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Ja, als <strong>g &gt; r</strong> — het bbp groeit dan sneller dan de schuld.
            </p>
          </details>
          <details className="debt-faq">
            <summary>Waar zie ik actuele cijfers?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Ga naar de{" "}
              <Link href="/nl" className="btn" style={{ padding: "2px 8px" }}>
                EU-kaart
              </Link>{" "}
              en kies een land.
            </p>
          </details>

          <div className="cta card" style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/nl" className="btn">Bekijk de EU-kaart →</Link>
            <Link href="/nl/debt" className="btn">Wat is Schuld? →</Link>
            <Link href="/nl/stability-and-growth-pact" className="btn">SGP uitgelegd →</Link>
            <Link href="/nl/methodology" className="btn">Methodologie →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
