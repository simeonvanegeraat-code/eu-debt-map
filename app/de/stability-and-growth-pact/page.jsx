// app/de/stability-and-growth-pact/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA (DE)
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/de/stability-and-growth-pact";
  const title = "Stabilitäts- und Wachstumspakt (SWP): Grundlagen, Regeln und Bedeutung • EU Debt Map";
  const description =
    "Einfach erklärt: Ziele des Stabilitäts- und Wachstumspakts, Schulden- und Defizitregeln, Rolle der Schuldenquote (Debt-to-GDP) und häufige Fragen. Mit Links zur Methodik und Live-Karte.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/stability-and-growth-pact`,
        nl: `${base}/nl/stability-and-growth-pact`,
        de: `${base}${path}`,
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
      images: [{ url: "/og/debt-explainer-1200x630.jpg", width: 1200, height: 630, alt: "Stabilitäts- und Wachstumspakt" }],
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

export default function SgpDE() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Stabilitäts- und Wachstumspakt (SWP): Grundlagen, Regeln und Bedeutung",
    inLanguage: "de",
    mainEntityOfPage: "https://www.eudebtmap.com/de/stability-and-growth-pact",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    about: ["Stabilitäts- und Wachstumspakt","SWP","EU-Fiskalregeln","Schuldenquote","Defizitregeln"],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type":"Question", name:"Wozu dient der SWP?", acceptedAnswer:{ "@type":"Answer", text:"Er soll die öffentlichen Finanzen in der EU tragfähig halten, indem er gemeinsame Anker für Defizit und Schulden setzt." } },
      { "@type":"Question", name:"Gilt eine einheitliche Zielzahl für alle?", acceptedAnswer:{ "@type":"Answer", text:"Nein. Entscheidend ist die Tragfähigkeitspfad eines Landes, abhängig von Wachstum, Zinsen und Fiskalpolitik." } },
      { "@type":"Question", name:"Wo sehe ich aktuelle Schuldendaten?", acceptedAnswer:{ "@type":"Answer", text:"Auf der EU Debt Map finden Sie pro Land eine live hochzählende Schätzung basierend auf den neuesten Referenzdaten." } }
    ]
  };

  const breadcrumbsLd = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    itemListElement:[
      { "@type":"ListItem", position:1, name:"Start", item:"https://www.eudebtmap.com/de" },
      { "@type":"ListItem", position:2, name:"Stabilitäts- und Wachstumspakt", item:"https://www.eudebtmap.com/de/stability-and-growth-pact" }
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
            Stabilitäts- und Wachstumspakt (SWP)
          </h1>
          <div style={{ maxWidth:"68ch" }}>
            <p className="hero-lede" style={{ marginTop:8 }}>
              Was die EU-Fiskalregeln erreichen wollen, wie Schulden- und Defizitkennzahlen genutzt werden und warum der <em>Pfad</em> der Schulden so wichtig ist.
            </p>
          </div>
        </header>
      </section>

      <article className="card section" style={{ gridColumn:"1 / -1" }}>
        <section>
          <h2 className="article-title">Ziele des SWP</h2>
          <p>Der SWP koordiniert die Fiskalpolitik, um die öffentlichen Finanzen <strong>tragfähig</strong> zu halten. Er setzt gemeinsame Anker für <strong>Defizite</strong> und <strong>Schulden</strong>, lässt aber nationale Wege offen.</p>
          <div className="tag" style={{ marginTop:8 }}>Kurz: Anreize ausrichten, Risiken mindern, die Währungsunion stabil halten.</div>
        </section>

        <section>
          <h2 className="article-title">Kernprinzipien</h2>
          <p><Pill>Schuldentragfähigkeit</Pill><Pill>Solide Budgetpfade</Pill><Pill>Vergleichbarkeit</Pill></p>
          <ul>
            <li><strong>Pfad statt nur Level:</strong> Entscheidend ist, wohin die Schuldenquote steuert.</li>
            <li><strong>Defizitdisziplin:</strong> Jährliche Lücken begrenzen, um Risiken nicht zu verstärken.</li>
            <li><strong>Gemeinsame Maßstäbe:</strong> Schulden/BIP erleichtert faire Vergleiche.</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">Schulden, Defizit und Schulden/BIP</h2>
          <p>Der SWP unterscheidet zwischen jährlichem <strong>Defizit</strong> (Fluss) und gesamter <strong>Schuld</strong> (Bestand). Vergleiche erfolgen meist über die <strong>Schulden/BIP-Quote</strong>.</p>
          <p className="tag" style={{ marginTop:8 }}>
            Grundlagen: <Link href="/de/debt">Was ist Schulden?</Link> · <Link href="/de/debt-vs-deficit">Schulden vs Defizit</Link> · <Link href="/de/debt-to-gdp">Schulden/BIP erklärt</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">Warum es Bürger betrifft</h2>
          <ul>
            <li><strong>Zinslast:</strong> Zinsen binden Mittel, die sonst in Bildung oder Gesundheit fließen könnten.</li>
            <li><strong>Stabilität:</strong> Gemeinsame Regeln reduzieren Krisenrisiken.</li>
            <li><strong>Politischer Spielraum:</strong> Bessere Dynamik = mehr Raum für Investitionen und Schocks.</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>
          <details className="debt-faq"><summary>Gibt es eine „sichere“ Schuldenzahl?</summary><p className="tag" style={{ marginTop:8 }}>Nein. Tragfähigkeit hängt von Wachstum, Zinsen, Demografie und glaubwürdigen Budgetpfaden ab.</p></details>
          <details className="debt-faq"><summary>Blockieren die Regeln Investitionen?</summary><p className="tag" style={{ marginTop:8 }}>Ziel ist tragfähige Investitionen zu ermöglichen, nicht zu bremsen.</p></details>
          <details className="debt-faq"><summary>Wo sehe ich aktuelle Daten?</summary><p className="tag" style={{ marginTop:8 }}>Zur{" "}<Link href="/de" className="btn" style={{ padding:"2px 8px" }}>EU‑Karte</Link>{" "}und ein Land wählen.</p></details>

          <div className="cta card" style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
            <Link href="/de" className="btn">EU‑Karte →</Link>
            <Link href="/de/debt" className="btn">Was ist Schulden? →</Link>
            <Link href="/de/debt-to-gdp" className="btn">Schulden/BIP →</Link>
            <Link href="/de/methodology" className="btn">Methodik →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
