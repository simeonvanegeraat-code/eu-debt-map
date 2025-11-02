// app/de/debt/page.jsx
import Link from "next/link";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/de/debt";
  const title =
    "Was ist Schulden? Ein einfacher Leitfaden zu privaten und staatlichen Schulden • EU Debt Map";
  const description =
    "Schulden einfach erklärt. Private Schulden (gut vs. schlecht), was ist Staatsverschuldung, Unterschied zwischen Schulden und Defizit, wie Anleihen funktionieren, wer Staatsanleihen hält und die Schuldenquote (Debt-to-GDP) mit klaren Visualisierungen und FAQ.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt`,
        nl: `${base}/nl/debt`,
        de: `${base}${path}`,
        fr: `${base}/fr/debt`,
        "x-default": `${base}/debt`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      images: [{ url: "/og/debt-explainer-1200x630.jpg", width: 1200, height: 630, alt: "EU debt explainer hero" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og/debt-explainer-1200x630.jpg"] },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

function Term({ children, title }) {
  return (
    <abbr title={title} style={{ textDecoration: "none", borderBottom: "1px dotted var(--border)", cursor: "help" }}>
      {children}
    </abbr>
  );
}

function DebtMeter({ value = 50 }) {
  const width = 320, height = 18;
  const pct = Math.max(0, Math.min(100, value));
  const filled = (width * pct) / 100;
  return (
    <figure style={{ margin: "8px 0 0 0" }}>
      <svg width={width} height={height} role="img" aria-label={`Schuldenquote ${pct}%`} style={{ display: "block" }}>
        <rect x="0" y="0" width={width} height={height} rx="9" fill="#e5e7eb" />
        <rect x="0" y="0" width={filled} height={height} rx="9" />
        <text x={width - 6} y={height - 5} textAnchor="end" fontSize="12" fill="#111827" aria-hidden="true">
          {pct}%
        </text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        50 % bedeuten: Staatsschulden entsprechen der Hälfte der jährlichen Wirtschaftsleistung.
      </figcaption>
    </figure>
  );
}

function RGDiagram() {
  const w = 360, h = 200;
  return (
    <figure style={{ margin: "12px 0 0 0" }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Diagramm: Zins (r) vs. Wachstum (g) ">
        <line x1="40" y1="10" x2="40" y2={h - 30} stroke="#9ca3af" />
        <line x1="40" y1={h - 30} x2={w - 10} y2={h - 30} stroke="#9ca3af" />
        <path d={`M 40 ${h - 80} L ${w - 10} ${h - 60}`} fill="none" stroke="#ef4444" strokeWidth="2" />
        <text x={w - 14} y={h - 62} textAnchor="end" fontSize="12">r</text>
        <path d={`M 40 ${h - 40} L ${w - 10} ${h - 100}`} fill="none" stroke="#10b981" strokeWidth="2" />
        <text x={w - 14} y={h - 102} textAnchor="end" fontSize="12">g</text>
        <rect x="41" y="11" width={w - 52} height={h - 42} fill="url(#fade)" opacity="0.08" />
        <defs>
          <linearGradient id="fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <text x="44" y="20" fontSize="11" fill="#111827">Quote sinkt häufig, wenn g &gt; r</text>
        <text x="44" y={h - 12} fontSize="11" fill="#6b7280">Zeit</text>
        <text x="12" y="22" transform={`rotate(-90 12,22)`} fontSize="11" fill="#6b7280">Niveau</text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        Übersteigt <strong>g</strong> (Wachstum) den <strong>r</strong> (Zins), kann die Schuldenquote stabilisieren oder fallen.
      </figcaption>
    </figure>
  );
}

export default function DebtExplainerDE() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Was ist Schulden? Ein einfacher Leitfaden zu privaten und staatlichen Schulden",
    inLanguage: "de",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/de/debt",
    about: ["Schulden Definition","private Schulden","Staatsverschuldung","debt-to-GDP","Unterschied Schulden Defizit"],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Was ist Schulden? Ein einfacher Leitfaden",
    url: "https://www.eudebtmap.com/de/debt",
    description:
      "Schulden verständlich: private Schulden (gut vs. schlecht), Staatsschulden und Defizite, Anleihen, Gläubiger und die Schuldenquote.",
    inLanguage: "de",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: "https://www.eudebtmap.com/de" },
      { "@type": "ListItem", position: 2, name: "Schulden Guide", item: "https://www.eudebtmap.com/de/debt" },
    ],
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
          text: "Das Defizit ist die jährliche Lücke zwischen Ausgaben und Einnahmen. Die Schulden sind der aufsummierte Bestand im Zeitverlauf.",
        },
      },
      {
        "@type": "Question",
        name: "Muss ein Land seine Schulden vollständig tilgen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Theoretisch möglich, praktisch rollen große Volkswirtschaften Schulden meist: neue Anleihen lösen fällige ab. Ziel: Nachhaltigkeit.",
        },
      },
      {
        "@type": "Question",
        name: "Sind alle privaten Schulden schlecht?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nein. Gute Schulden schaffen Werte oder Einkommen (Hypothek, Studium, Unternehmen). Hohe Kreditkartenzinsen sind meist problematisch.",
        },
      },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <header>
          <h1 className="hero-title" style={{
            fontSize: "clamp(1.8rem, 4vw + 1rem, 3rem)",
            background: "linear-gradient(90deg, #2563eb, #00875a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>
            Was ist Schulden? Ein einfacher Leitfaden zu privaten und staatlichen Schulden
          </h1>

          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              Schulden klingen groß und kompliziert, sind im Kern aber ein Versprechen: heute Geld erhalten, morgen zurückzahlen.
            </p>

            <div className="divider-soft" aria-hidden />

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              Wir starten mit <strong>privaten Schulden</strong> und zoomen dann zur{" "}
              <strong>Staatsverschuldung</strong>. Unterwegs erklären wir den{" "}
              <strong>Unterschied zwischen Schulden und Defizit</strong>, wie{" "}
              <Term title="Staatsschulden in Prozent der jährlichen Wirtschaftsleistung">Debt-to-GDP</Term> funktioniert
              und warum manche Schulden helfen, zu viele aber schaden.
            </p>

            <p className="tag" style={{ marginTop: 8 }}>
              Visual lieber?{" "}
              <Link href="/de" className="btn" style={{ padding: "6px 10px", marginLeft: 6 }}>
                Zur EU-Karte →
              </Link>
            </p>
          </div>
        </header>
      </section>

      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">Grundlagen: Was sind private Schulden?</h2>
          <p className="article-body">
            Private Schulden sind geliehenes Geld, das mit <Term title="Preis des geliehenen Geldes pro Jahr">Zinsen</Term> zurückgezahlt wird.
            Der <strong>Schuldner</strong> erhält Geld jetzt; der <strong>Gläubiger</strong> verlangt als Gegenleistung Zinsen.
          </p>
          <div className="tag" role="note" style={{ marginTop: 8 }}>
            <strong>Beispiel.</strong> 5 € Kaffee mit Kreditkarte und verspäteter Zahlung → durch Zinsen wird er teurer.
          </div>

          <h3 className="article-subtitle" style={{ marginTop: 14 }}>Gute vs. schlechte Schulden</h3>
          <div className="card" style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <div><strong>Gute Schulden (Investition)</strong> — Hypothek, Studium, Unternehmen.</div>
            <div><strong>Schlechte Schulden (Konsum)</strong> — teure Kreditkartensalden, Kurzzeitkredite.</div>
          </div>
        </section>

        <section>
          <h2 className="article-title">Eine Ebene höher: Was sind Staatsschulden?</h2>
          <p className="article-body">
            Staatsschulden sind die Summe dessen, was der Staat schuldet. Einnahmen (Steuern) vs. Ausgaben (Infrastruktur,
            Gesundheitswesen, Bildung, Verteidigung). Reicht es nicht, wird geliehen.
          </p>

          <h3 className="article-subtitle">Schuld vs. Defizit</h3>
          <p>
            <strong>Defizit</strong> = Einjahresblick. <strong>Schulden</strong> = kumulierter Bestand.
            Analogie: Defizit ist der neue Monatsumsatz auf der Karte; Schulden sind der Gesamtsaldo.
          </p>

          <h3 className="article-subtitle">Wie leiht der Staat Geld?</h3>
          <p>
            Über <strong>Anleihen</strong>. Anleger kaufen eine Anleihe, erhalten Zinsen und am Ende den Nominalbetrag zurück.
            Käufer sind Haushalte, Banken, Pensionskassen, andere Staaten oder die Zentralbank.
          </p>
        </section>

        <section>
          <h2 className="article-title">Sind Staatsschulden immer schlecht?</h2>
          <div className="card" style={{ display: "grid", gap: 8 }}>
            <div><strong>Das Gute.</strong> Finanzierung langlebiger Investitionen und Stabilisierung in Rezessionen.</div>
            <div><strong>Das Schlechte.</strong> Hohe Zinslast verdrängt Ausgaben für Schulen oder Gesundheit.</div>
            <div><strong>Das Hässliche.</strong> Vertrauensverlust treibt Zinsen hoch → Krisenrisiko.</div>
          </div>
        </section>

        <section>
          <h2 className="article-title">Die Kennzahl: Schuldenquote (Debt-to-GDP)</h2>
          <p>
            Zur Einordnung vergleichen Ökonomen Gesamtschulden mit der Wirtschaftsleistung:
            die <Term title="Schulden geteilt durch jährliche Wirtschaftsleistung">Schuldenquote</Term>.
          </p>
          <DebtMeter value={50} />
          <div className="tag" style={{ marginTop: 10 }}>
            <strong>Kontext zählt.</strong> Große, wachsende Volkswirtschaften tragen mehr Schulden als kleine, schrumpfende.
          </div>
        </section>

        <section>
          <h2 className="article-title">Was bewegt die Quote im Zeitverlauf?</h2>
          <ol>
            <li><strong>Primärsaldo</strong> — Budget vor Zinsen.</li>
            <li><strong>Wachstum vs. Zins (r–g)</strong> — wenn <Term title="Nominales BIP-Wachstum">g</Term> &gt; <Term title="Durchschnittlicher effektiver Zinssatz">r</Term>.</li>
            <li><strong>Einmaleffekte</strong> — Bankenrettungen, Asset-Verkäufe, Inflation, Wechselkurs.</li>
          </ol>
          <RGDiagram />
          <p className="tag" style={{ marginTop: 10 }}>
            Methodik: <Link href="/de/methodology">so schätzen und aktualisieren wir Zahlen</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>
          <details className="debt-faq">
            <summary>Unterschied zwischen Schulden und Defizit?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Defizit = Jahreslücke; Schulden = Bestand über Jahre.
            </p>
          </details>
          <details className="debt-faq">
            <summary>Können Länder Schulden komplett tilgen?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Möglich, aber selten. Meist Roll-over über neue Anleihen. Ziel ist Nachhaltigkeit.
            </p>
          </details>
          <details className="debt-faq">
            <summary>Sind alle privaten Schulden schlecht?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Nein. Investitionsschulden können nützen; Hochzins-Konsumkredite schaden meist.
            </p>
          </details>

          <p className="tag" style={{ marginTop: 10 }}>
            Quellen: Eurostat und nationale Finanzministerien. Bildung; keine Anlageberatung.
          </p>

          <div className="cta card" style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/de" className="btn">Zur EU-Karte →</Link>
            <Link href="/de/debt-to-gdp" className="btn">Debt-to-GDP erklärt →</Link>
            <Link href="/de/debt-vs-deficit" className="btn">Schulden vs. Defizit →</Link>
            <Link href="/de/stability-and-growth-pact" className="btn">Stabilitäts- und Wachstumspakt →</Link>
            <Link href="/de/methodology" className="btn">Methodik →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
