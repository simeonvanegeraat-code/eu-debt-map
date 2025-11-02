// app/de/debt-vs-deficit/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA (DE)
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/de/debt-vs-deficit";
  const title = "Schulden vs. Defizit — Der Unterschied in 5 Minuten erklärt • EU Debt Map";
  const description =
    "Verstehen Sie den Unterschied zwischen Staatsschulden (Bestand) und Defizit (Strom). Klare, visuelle Erklärung mit Beispielen, Analogie, FAQ und Links zu Debt-to-GDP und Stabilitäts- und Wachstumspakt.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt-vs-deficit`,
        nl: `${base}/nl/debt-vs-deficit`,
        de: `${base}${path}`,
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
      images: [{ url: "/og/debt-explainer-1200x630.jpg", width: 1200, height: 630, alt: "Schulden vs. Defizit Infografik" }],
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
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Defizit (Fluss) vs Schulden (Bestand)">
        {/* Tank (Bestand) */}
        <rect x="240" y="30" width="160" height="100" rx="10" fill="#e5e7eb" />
        <text x="320" y="88" textAnchor="middle" fontSize="12">Schulden (Bestand)</text>

        {/* Zufluss (Defizit) */}
        <line x1="40" y1="60" x2="220" y2="60" stroke="#10b981" strokeWidth="6" />
        <polygon points="220,56 220,64 234,60" fill="#10b981" />
        <text x="40" y="50" fontSize="12" fill="#065f46">Defizit (jährlicher Fluss)</text>

        {/* Abfluss (Überschuss) */}
        <line x1="320" y1="130" x2="320" y2="150" stroke="#ef4444" strokeWidth="6" />
        <text x="326" y="152" fontSize="12" fill="#7f1d1d">Tilgung / Überschuss</text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        Das <em>Defizit</em> ist ein jährlicher <em>Fluss</em>; die <em>Schulden</em> sind der <em>Bestand</em>, der sich über die Zeit aufbaut (oder sinkt).
      </figcaption>
    </figure>
  );
}

/** -----------------------------
 * MAIN PAGE (DE)
 * ----------------------------- */
export default function DebtVsDeficitDE() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Schulden vs. Defizit — Der Unterschied in 5 Minuten erklärt",
    inLanguage: "de",
    mainEntityOfPage: "https://www.eudebtmap.com/de/debt-vs-deficit",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    about: ["Staatsverschuldung","Haushaltsdefizit","Schulden vs Defizit","Schuldenquote","Öffentliche Finanzen"],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was ist der Unterschied zwischen Schulden und Defizit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Das Defizit ist die jährliche Lücke zwischen Ausgaben und Einnahmen. Die Schulden sind der akkumulierte Bestand aus vergangenen Defiziten und Überschüssen.",
        },
      },
      {
        "@type": "Question",
        name: "Kann die Schuldenquote ohne Überschuss sinken?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Wenn das nominale BIP-Wachstum (g) über dem durchschnittlichen Zinssatz (r) liegt, kann die Schuldenquote trotz kleiner Defizite sinken.",
        },
      },
      {
        "@type": "Question",
        name: "Warum steigen Schulden, obwohl die Wirtschaft wächst?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Weil der Primärsaldo negativ sein kann (Defizit) oder Einmaleffekte (z. B. Bankenrettungen) die Schulden schneller erhöhen als das BIP.",
        },
      },
    ],
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: "https://www.eudebtmap.com/de" },
      { "@type": "ListItem", position: 2, name: "Schulden vs Defizit", item: "https://www.eudebtmap.com/de/debt-vs-deficit" },
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
            Schulden vs. Defizit — Der Unterschied in 5 Minuten
          </h1>
          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              Kurz gesagt: <strong>Defizit</strong> ist das, was in diesem Jahr hinzukommt;{" "}
              <strong>Schulden</strong> sind das, was bereits aus der Vergangenheit besteht.
            </p>
          </div>
        </header>
      </section>

      {/* ARTICLE */}
      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">Kernidee: Fluss vs. Bestand</h2>
          <p>
            Ein <strong>Haushaltsdefizit</strong> ist ein <em>Fluss</em> — die jährliche Lücke zwischen Ausgaben und Einnahmen.
            <strong> Staatsschulden</strong> sind ein <em>Bestand</em> — die Summe der Vergangenheit.
          </p>
          <StockFlowSVG />
        </section>

        <section>
          <h2 className="article-title">Eine greifbare Analogie</h2>
          <p>
            Denken Sie an Ihre Kreditkarte: Das <strong>Defizit</strong> ist die neue Monatslast.
            Die <strong>Schulden</strong> sind der Gesamtsaldo, der noch offen ist.
          </p>
        </section>

        <section>
          <h2 className="article-title">Warum das wichtig ist</h2>
          <ul>
            <li><strong>Zeithorizont:</strong> Defizite sind kurzfristig; Schulden langfristig.</li>
            <li><strong>Zinslast:</strong> Mehr Schulden bedeuten höhere Zinszahlungen und weniger Spielraum.</li>
            <li><strong>Vergleichbarkeit:</strong> Schulden-BIP-Quoten erlauben faire Länder­vergleiche.</li>
          </ul>
          <p className="tag" style={{ marginTop: 8 }}>
            Weiterführend: <Link href="/de/debt-to-gdp">Debt-to-GDP erklärt</Link> ·{" "}
            <Link href="/de/stability-and-growth-pact">Stabilitäts- und Wachstumspakt</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>
          <details className="debt-faq">
            <summary>Sinkt die Schuldenquote automatisch bei Überschuss?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Ein Primärüberschuss hilft, doch die Quote hängt auch von Wachstum (g) und Zins (r) ab.
            </p>
          </details>
          <details className="debt-faq">
            <summary>Kann die Quote trotz kleinem Defizit fallen?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Ja, wenn <strong>g &gt; r</strong> — das BIP wächst schneller als die Schulden.
            </p>
          </details>
          <details className="debt-faq">
            <summary>Wo finde ich aktuelle Zahlen?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Zur{" "}
              <Link href="/de" className="btn" style={{ padding: "2px 8px" }}>
                EU-Karte
              </Link>{" "}
              und ein Land auswählen.
            </p>
          </details>

          <div className="cta card" style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/de" className="btn">Zur EU-Karte →</Link>
            <Link href="/de/debt" className="btn">Was ist Schulden? →</Link>
            <Link href="/de/stability-and-growth-pact" className="btn">SGP erklärt →</Link>
            <Link href="/de/methodology" className="btn">Methodik →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
