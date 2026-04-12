// app/de/debt/page.jsx
import Link from "next/link";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/de/debt";
  const title =
    "Was ist Staatsverschuldung? Schulden, Defizit und Anleihen einfach erklärt | EU Debt Map";
  const description =
    "Einfache Erklärung der Staatsverschuldung: was öffentliche Schulden sind, wie sie sich vom Defizit unterscheiden, wie Staatsanleihen funktionieren, wer dem Staat Geld leiht und warum die Schuldenquote wichtig ist.";

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
      images: [
        {
          url: "/og/debt-explainer-1200x630.jpg",
          width: 1200,
          height: 630,
          alt: "Erklärung der Staatsverschuldung",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/debt-explainer-1200x630.jpg"],
    },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

function Term({ children, title }) {
  return (
    <abbr
      title={title}
      style={{
        textDecoration: "none",
        borderBottom: "1px dotted var(--border)",
        cursor: "help",
      }}
    >
      {children}
    </abbr>
  );
}

function MiniCard({ label, text }) {
  return (
    <div className="card" style={{ margin: 0 }}>
      <div className="tag">{label}</div>
      <p style={{ margin: "8px 0 0 0", lineHeight: 1.65 }}>{text}</p>
    </div>
  );
}

function CompareCard({ leftTitle, leftText, rightTitle, rightText }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        marginTop: 8,
      }}
    >
      <div className="card" style={{ margin: 0 }}>
        <div className="tag">{leftTitle}</div>
        <p style={{ margin: "8px 0 0 0", lineHeight: 1.65 }}>{leftText}</p>
      </div>
      <div className="card" style={{ margin: 0 }}>
        <div className="tag">{rightTitle}</div>
        <p style={{ margin: "8px 0 0 0", lineHeight: 1.65 }}>{rightText}</p>
      </div>
    </div>
  );
}

function StepGrid({ steps }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        marginTop: 10,
      }}
    >
      {steps.map((step, i) => (
        <div key={i} className="card" style={{ margin: 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              background: "rgba(37,99,235,0.10)",
              color: "#1d4ed8",
              marginBottom: 10,
            }}
          >
            {i + 1}
          </div>
          <strong>{step.title}</strong>
          <p style={{ margin: "8px 0 0 0", lineHeight: 1.6 }}>{step.text}</p>
        </div>
      ))}
    </div>
  );
}

function RatioBand() {
  return (
    <div
      className="card"
      style={{
        marginTop: 10,
        display: "grid",
        gap: 10,
      }}
    >
      <div className="tag">Schuldenquote auf einen Blick</div>

      <div
        role="img"
        aria-label="Illustrative Schuldenquote-Skala mit Referenzpunkt bei 60 Prozent"
        style={{ marginTop: 2 }}
      >
        <div
          style={{
            position: "relative",
            height: 16,
            borderRadius: 999,
            overflow: "hidden",
            background: "#e5e7eb",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, width: "60%", background: "rgba(16,185,129,0.55)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "60%", width: "30%", background: "rgba(245,158,11,0.45)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "90%", width: "10%", background: "rgba(239,68,68,0.45)" }} />
          <div
            style={{
              position: "absolute",
              top: -4,
              bottom: -4,
              left: "60%",
              width: 2,
              background: "#0f172a",
              opacity: 0.7,
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60% 30% 10%",
            fontSize: 12,
            color: "var(--muted)",
            marginTop: 8,
            gap: 8,
          }}
        >
          <span>&lt;60% Referenzzone</span>
          <span>60–90% Beobachtungszone</span>
          <span>&gt;90%</span>
        </div>
      </div>

      <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
        Die Schuldenquote vergleicht die gesamte Staatsverschuldung mit der jährlichen Wirtschaftsleistung. Sie erklärt nicht alles, macht Länder unterschiedlicher Größe aber deutlich besser vergleichbar.
      </p>
    </div>
  );
}

export default function DebtExplainerDE() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Was ist Staatsverschuldung? Schulden, Defizit und Anleihen einfach erklärt",
    inLanguage: "de",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/de/debt",
    about: [
      "Staatsverschuldung",
      "öffentliche Schulden",
      "Schulden vs Defizit",
      "Staatsanleihen",
      "Schuldenquote",
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Was ist Staatsverschuldung? Schulden, Defizit und Anleihen einfach erklärt",
    url: "https://www.eudebtmap.com/de/debt",
    description:
      "Einfache Erklärung der Staatsverschuldung: was öffentliche Schulden sind, wie sie sich vom Defizit unterscheiden, wie Staatsanleihen funktionieren, wer dem Staat Geld leiht und warum die Schuldenquote wichtig ist.",
    inLanguage: "de",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: "https://www.eudebtmap.com/de" },
      { "@type": "ListItem", position: 2, name: "Leitfaden Staatsverschuldung", item: "https://www.eudebtmap.com/de/debt" },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was ist Staatsverschuldung?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Staatsverschuldung ist der gesamte Betrag, den der Staat nach Jahren des Borrowings noch schuldet. Sie steigt meist, wenn Ausgaben höher sind als Einnahmen.",
        },
      },
      {
        "@type": "Question",
        name: "Was ist der Unterschied zwischen Schulden und Defizit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ein Defizit ist die Lücke in einer Haushaltsperiode, wenn Ausgaben höher sind als Einnahmen. Schulden sind der gesamte angesammelte Bestand über viele Jahre.",
        },
      },
      {
        "@type": "Question",
        name: "Wer kauft Staatsanleihen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Staatsanleihen werden meist von Banken, Pensionsfonds, Versicherern, Investmentfonds, ausländischen Investoren und manchmal von Zentralbanken gekauft.",
        },
      },
      {
        "@type": "Question",
        name: "Warum ist die Schuldenquote wichtig?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Die Schuldenquote vergleicht die Staatsverschuldung mit der Größe der Wirtschaft. So wird die Schuldenlast besser sichtbar als mit einem reinen Eurobetrag.",
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
        <header style={{ display: "grid", gap: 14 }}>
          <h1
            className="hero-title"
            style={{
              fontSize: "clamp(1.9rem, 4vw + 1rem, 3.1rem)",
              background: "linear-gradient(90deg, #2563eb, #00875a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            Was ist Staatsverschuldung?
          </h1>

          <div style={{ maxWidth: "70ch", display: "grid", gap: 10 }}>
            <p className="hero-lede" style={{ margin: 0 }}>
              Staatsverschuldung ist der gesamte Geldbetrag, den ein Staat nach Jahren des Borrowings noch schuldet. Wenn Regierungen mehr ausgeben als sie einnehmen, wird die Lücke oft über Anleihen finanziert.
            </p>

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              Diese Seite konzentriert sich nur auf <strong>öffentliche Schulden</strong>, nicht auf persönliche Finanzen. Sie erklärt, was Staatsverschuldung ist, wie sie sich vom Defizit unterscheidet, wer Regierungen Geld leiht und warum die <Term title="Staatsschulden als Anteil der jährlichen Wirtschaftsleistung">Schuldenquote</Term> so wichtig ist.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              <Link href="/de" className="btn">Zur live EU-Karte →</Link>
              <Link href="/de/debt-to-gdp" className="btn">Schuldenquote erklärt →</Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 6,
            }}
          >
            <MiniCard
              label="Schulden"
              text="Der gesamte offene Betrag, den der Staat noch zurückzahlen muss."
            />
            <MiniCard
              label="Defizit"
              text="Die Lücke in einer Haushaltsperiode, wenn Ausgaben höher sind als Einnahmen."
            />
            <MiniCard
              label="Anleihe"
              text="Das wichtigste IOU, mit dem Regierungen Geld von Investoren aufnehmen."
            />
            <MiniCard
              label="Schuldenquote"
              text="Schulden im Verhältnis zur Wirtschaftsleistung, nicht nur als Eurobetrag."
            />
          </div>
        </header>
      </section>

      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">Staatsverschuldung in einem Satz</h2>
          <p className="article-body">
            Staatsverschuldung ist das angesammelte Ergebnis früherer Kreditaufnahme. Ein Land hat zeitweise Defizite, finanziert sie über Anleihen und trägt die offene Schuld so lange weiter, bis sie getilgt oder refinanziert wird.
          </p>
          <div className="tag" style={{ marginTop: 8 }}>
            Einfach gesagt: Das <strong>Defizit</strong> ist die Lücke eines Jahres, die <strong>Schulden</strong> sind die Summe, die danach noch offen bleibt.
          </div>
        </section>

        <section>
          <h2 className="article-title">Schulden vs. Defizit</h2>
          <CompareCard
            leftTitle="Defizit"
            leftText="Eine Flussgröße. Sie zeigt, wie viel neues Geld in einer Haushaltsperiode aufgenommen werden muss, wenn Ausgaben höher sind als Einnahmen."
            rightTitle="Schulden"
            rightText="Eine Bestandsgröße. Sie zeigt, wie viel insgesamt nach Jahren des Borrowings, Tilgens und Rollovers offensteht."
          />
        </section>

        <section>
          <h2 className="article-title">Wie leiht sich ein Staat Geld?</h2>
          <p className="article-body">
            Staaten leihen vor allem über <strong>Staatsanleihen</strong>. Das sind offizielle Schuldscheine, mit denen Investoren dem Staat heute Geld geben und dafür Zinsen sowie Rückzahlung später erhalten.
          </p>

          <StepGrid
            steps={[
              {
                title: "Der Staat emittiert Anleihen",
                text: "Die Regierung bietet Schuldpapiere an, um Geld am Markt aufzunehmen.",
              },
              {
                title: "Investoren kaufen sie",
                text: "Banken, Fonds, Pensionskassen und andere Anleger stellen Kapital bereit.",
              },
              {
                title: "Zinsen werden gezahlt",
                text: "Die Halter erhalten während der Laufzeit laufende Zinszahlungen.",
              },
              {
                title: "Tilgung oder Roll-over",
                text: "Am Ende wird zurückgezahlt oder durch neue Schulden ersetzt.",
              },
            ]}
          />
        </section>

        <section>
          <h2 className="article-title">Wer hält diese Schulden?</h2>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 8,
            }}
          >
            <MiniCard
              label="Inländische Investoren"
              text="Lokale Banken, Versicherer, Pensionsfonds und teilweise auch Haushalte halten oft große Anteile."
            />
            <MiniCard
              label="Ausländische Investoren"
              text="Internationale Fonds und ausländische Institutionen können ebenfalls wichtige Gläubiger sein."
            />
            <MiniCard
              label="Zentralbanken"
              text="In bestimmten Phasen halten Zentralbanken Staatsanleihen im Rahmen der Geldpolitik."
            />
          </div>
        </section>

        <section>
          <h2 className="article-title">Wann wird Schuld zum Problem?</h2>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 8,
            }}
          >
            <MiniCard
              label="Zinskosten steigen"
              text="Mehr Steuergeld fließt in den Schuldendienst statt in öffentliche Leistungen."
            />
            <MiniCard
              label="Schwaches Wachstum"
              text="Wenn die Wirtschaft langsam wächst, wird dieselbe Schuldenlast schwerer zu tragen."
            />
            <MiniCard
              label="Vertrauen sinkt"
              text="Investoren können höhere Renditen verlangen, wodurch neue Schulden teurer werden."
            />
          </div>
        </section>

        <section>
          <h2 className="article-title">Warum die Schuldenquote zählt</h2>
          <p className="article-body">
            Der reine Schuldenbetrag kann irreführend sein. Ein hoher Betrag kann für eine starke Volkswirtschaft tragbar sein, während ein kleinerer Betrag für ein schwächeres Land problematisch wird. Deshalb vergleichen Ökonomen Schulden mit dem jährlichen BIP.
          </p>
          <RatioBand />
          <p className="tag" style={{ marginTop: 10 }}>
            Ein Land mit starkem Wachstum, niedrigen Zinsen und glaubwürdigen Institutionen kann oft mehr Schulden tragen als eine kleinere oder schwächere Wirtschaft.
          </p>
        </section>

        <section>
          <h2 className="article-title">Häufige Fragen</h2>

          <details className="debt-faq">
            <summary>Sind Staatsschulden immer schlecht?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Nein. Kreditaufnahme kann sinnvoll sein, um langfristige Investitionen zu finanzieren oder die Wirtschaft in einer Rezession zu stabilisieren. Entscheidend ist, ob die Schulden nachhaltig bleiben.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Muss ein Land alle Schulden jemals vollständig tilgen?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Meist nicht. Viele Staaten refinanzieren einen Teil ihrer Schulden, wenn Anleihen auslaufen. Das Ziel ist Tragfähigkeit, nicht null Schulden.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Warum kann ein reiches Land oft mehr Schulden tragen?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Weil die Rückzahlungsfähigkeit von der Größe und Stärke der Wirtschaft abhängt, nicht nur von der absoluten Schuldenhöhe.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Warum betont EU Debt Map die Schuldenquote so stark?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Weil sie die klarste Methode ist, Länder unterschiedlicher Größe fair miteinander zu vergleichen.
            </p>
          </details>
        </section>
      </article>

      <section
        className="card section"
        style={{
          gridColumn: "1 / -1",
          display: "grid",
          gap: 14,
        }}
      >
        <h2 className="article-title" style={{ marginBottom: 0 }}>Nächster Schritt</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/de" className="btn">Live EU-Karte ansehen →</Link>
          <Link href="/de/debt-to-gdp" className="btn">Schuldenquote erklärt →</Link>
          <Link href="/de/debt-vs-deficit" className="btn">Schulden vs. Defizit →</Link>
          <Link href="/de/methodology" className="btn">Methodik →</Link>
        </div>

        <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/de/country/de" className="nav-link">Deutschland</Link>
          <Link href="/de/country/fr" className="nav-link">Frankreich</Link>
          <Link href="/de/country/it" className="nav-link">Italien</Link>
          <Link href="/de/country/es" className="nav-link">Spanien</Link>
          <Link href="/de/country/nl" className="nav-link">Niederlande</Link>
        </div>

        <p className="tag" style={{ margin: 0 }}>
          Quellen: Eurostat-Daten zu Staatsfinanzen und nationale öffentliche Finanzinstitutionen. Bildungsinhalt, keine Anlageberatung.
        </p>
      </section>
    </main>
  );
}