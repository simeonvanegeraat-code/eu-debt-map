// app/nl/debt/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA (NL)
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/nl/debt";
  const title =
    "Wat is Schuld? Een simpele gids voor persoonlijke en overheidsschuld • EU Debt Map";
  const description =
    "Heldere uitleg over schuld. Persoonlijke schuld (goed vs. slecht), wat is overheidsschuld, het verschil tussen schuld en tekort, hoe staatsobligaties werken, wie overheidsschuld bezit en debt-to-GDP eenvoudig uitgelegd — met visuals en FAQ.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt`,
        nl: `${base}${path}`,
        de: `${base}/de/debt`,
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
          alt: "EU debt explainer hero",
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

/** -----------------------------
 * UI HULP
 * ----------------------------- */
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

/** -----------------------------
 * INLINE SVG: Debt-to-GDP meter
 * ----------------------------- */
function DebtMeter({ value = 50 }) {
  const width = 320;
  const height = 18;
  const pct = Math.max(0, Math.min(100, value));
  const filled = (width * pct) / 100;

  return (
    <figure style={{ margin: "8px 0 0 0" }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`Schuldquote (debt-to-GDP) ${pct}%`}
        style={{ display: "block" }}
      >
        <rect x="0" y="0" width={width} height={height} rx="9" fill="#e5e7eb" />
        <rect x="0" y="0" width={filled} height={height} rx="9" />
        <text x={width - 6} y={height - 5} textAnchor="end" fontSize="12" fill="#111827" aria-hidden="true">
          {pct}%
        </text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        Een schuldquote van 50% betekent dat de staatsschuld gelijk is aan de helft van de jaarlijkse economie.
      </figcaption>
    </figure>
  );
}

/** -----------------------------
 * INLINE SVG: r–g diagram
 * r = effectieve rente op schuld, g = nominale bbp-groei
 * ----------------------------- */
function RGDiagram() {
  const w = 360;
  const h = 200;

  return (
    <figure style={{ margin: "12px 0 0 0" }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Conceptueel diagram dat rente (r) en groei (g) vergelijkt"
        style={{ display: "block", maxWidth: "100%" }}
      >
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
        <text x="44" y="20" fontSize="11" fill="#111827">Schuldquote daalt vaak als g &gt; r</text>
        <text x="44" y={h - 12} fontSize="11" fill="#6b7280">Tijd</text>
        <text x="12" y="22" transform={`rotate(-90 12,22)`} fontSize="11" fill="#6b7280">Niveau</text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        Als <strong>g</strong> (groei) hoger is dan <strong>r</strong> (rente), kan de schuldquote stabiliseren of dalen.
      </figcaption>
    </figure>
  );
}

export default function DebtExplainerNL() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wat is Schuld? Een simpele gids voor persoonlijke en overheidsschuld",
    inLanguage: "nl",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/nl/debt",
    about: [
      "schuld definitie",
      "persoonlijke schuld",
      "overheidsschuld",
      "debt-to-GDP",
      "verschil schuld en tekort",
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Wat is Schuld? Een simpele gids voor persoonlijke en overheidsschuld",
    url: "https://www.eudebtmap.com/nl/debt",
    description:
      "Schuld eenvoudig uitgelegd: persoonlijke schuld (goed vs. slecht), overheidsschuld en tekorten, obligaties, wie overheidsschuld bezit en debt-to-GDP.",
    inLanguage: "nl",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.eudebtmap.com/nl" },
      { "@type": "ListItem", position: 2, name: "Schuld Gids", item: "https://www.eudebtmap.com/nl/debt" },
    ],
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
          text: "Het tekort is het jaarlijkse verschil als uitgaven hoger zijn dan inkomsten. De schuld is het totale uitstaande bedrag door de jaren heen.",
        },
      },
      {
        "@type": "Question",
        name: "Moet een land zijn schuld ooit volledig aflossen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Het kan, maar grote economieën rollen schuld meestal door: nieuwe obligaties lossen aflopende af. Doel is houdbaarheid, niet nul.",
        },
      },
      {
        "@type": "Question",
        name: "Is alle persoonlijke schuld slecht?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nee. ‘Goede’ schuld bouwt vermogen of inkomen op (hypotheek, studie, bedrijf). ‘Slechte’ schuld financiert consumptie met hoge rente.",
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
            Wat is Schuld? Een simpele gids voor persoonlijke en overheidsschuld
          </h1>

          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              Het woord <em>schuld</em> voelt vaak groot en ingewikkeld. Toch is het in de kern simpel:
              een belofte om iets — meestal geld — later terug te betalen.
            </p>

            <div className="divider-soft" aria-hidden />

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              We starten bij <strong>persoonlijke schuld</strong> (zoals een studielening) en zoomen
              daarna uit naar <strong>overheidsschuld</strong>. Onderweg leggen we het{" "}
              <strong>verschil tussen schuld en tekort</strong> uit, hoe{" "}
              <Term title="Overheidsschuld als percentage van de jaarlijkse economische productie">debt-to-GDP</Term> werkt
              en waarom sommige schuld nuttig kan zijn terwijl te veel risico’s geeft.
            </p>

            <p className="tag" style={{ marginTop: 8 }}>
              Liever meteen de visualisatie?{" "}
              <Link href="/nl" className="btn" style={{ padding: "6px 10px", marginLeft: 6 }}>
                Bekijk de EU-kaart →
              </Link>
            </p>
          </div>
        </header>
      </section>

      {/* ARTIKEL */}
      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">De basis: wat is persoonlijke schuld?</h2>
          <p className="article-body">
            Persoonlijke schuld is geld dat je leent en met{" "}
            <Term title="Vergoeding voor het lenen, meestal een jaarlijks percentage">rente</Term> terugbetaalt.
            De <strong>lener</strong> (debiteur) krijgt nu geld; de <strong>verstrekker</strong> (crediteur) ontvangt rente als vergoeding.
          </p>
          <div className="tag" role="note" style={{ marginTop: 8 }}>
            <strong>Voorbeeld.</strong> Betaal je een koffie van €5 met creditcard en niet op tijd terug, dan kan het door rente €6+ worden.
          </div>

          <h3 className="article-subtitle" style={{ marginTop: 14 }}>Goede vs. slechte schuld</h3>
          <div className="card" style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <div>
              <strong>Goede schuld (investering)</strong> — hypotheek, studie, bedrijf: iets dat waarde of inkomen opbouwt.
            </div>
            <div>
              <strong>Slechte schuld (consumptie)</strong> — hoge-rente creditcards of flitskrediet voor dingen die snel in waarde dalen.
            </div>
          </div>
          <div className="tag" style={{ marginTop: 8 }}>
            <strong>Moraal.</strong> Goede schuld bouwt vermogen; slechte schuld vreet eraan.
          </div>
        </section>

        <section>
          <h2 className="article-title">Opschalen: wat is overheidsschuld?</h2>
          <p className="article-body">
            Overheidsschuld (ook wel <em>publieke</em> of <em>nationale</em> schuld) is wat de staat totaal verschuldigd is.
            Overheden hebben <strong>inkomsten</strong> (belastingen) en <strong>uitgaven</strong> (infrastructuur, zorg, onderwijs, defensie).
            Als uitgaven hoger zijn dan inkomsten, wordt geleend.
          </p>

          <h3 className="article-subtitle">Schuld vs. tekort</h3>
          <p>
            Het <strong>tekort</strong> is één jaar: uitgaven min inkomsten. De <strong>schuld</strong> is het
            opgetelde totaal van eerdere jaren. Denk aan: het tekort is wat je <em>deze maand</em> bijschrijft;
            de schuld is je <em>openstaande saldo</em>.
          </p>

          <h3 className="article-subtitle">Hoe leent een overheid?</h3>
          <p>
            Meestal via <strong>(staats)obligaties</strong> — een formele IOU. Beleggers kopen een obligatie (bijv. €1.000),
            ontvangen rente en krijgen aan het einde de €1.000 terug. Beleggers zijn huishoudens, banken, pensioenfondsen,
            andere landen of soms de centrale bank.
          </p>

          <h3 className="article-subtitle">Aan wie is de overheid geld verschuldigd?</h3>
          <ul>
            <li><strong>Binnenlandse beleggers</strong>: gezinnen, banken, verzekeraars, pensioenfondsen</li>
            <li><strong>Buitenlandse beleggers</strong>: andere landen, wereldwijde fondsen</li>
            <li><strong>Centrale bank</strong>: kan obligaties aanhouden om de economie te sturen</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">Is overheidsschuld altijd slecht?</h2>
          <p className="article-body">
            Anders dan huishoudens hoeft een overheid niet naar nul schuld. Enige schuld kan nuttig zijn — soms noodzakelijk.
          </p>
          <div className="card" style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <div><strong>Het goede.</strong> Financiering van projecten met langetermijnbaten; steun tijdens recessies.</div>
            <div><strong>Het slechte.</strong> Te hoge schuld → veel belastinggeld naar rente, minder ruimte voor zorg of onderwijs.</div>
            <div><strong>Het lelijke.</strong> Vertrouwen weg? Dan stijgt de rente hard en kan een crisis volgen.</div>
          </div>
        </section>

        <section>
          <h2 className="article-title">De kernmetriek: debt-to-GDP (schuldquote)</h2>
          <p>
            Om schaal te duiden, vergelijken economen totale schuld met de omvang van de economie:
            de <Term title="Overheidsschuld gedeeld door jaarlijkse economische productie">schuld-bbp-ratio</Term>.
            Zie bbp als het ‘jaarloon’ van een land.
          </p>
          <p>
            Voorbeeld: €50.000 verdienen en €25.000 schuld = <strong>50%</strong>. Bij €200.000 schuld = <strong>400%</strong>.
            Hetzelfde idee helpt landen vergelijken.
          </p>
          <DebtMeter value={50} />
          <div className="tag" style={{ marginTop: 10 }}>
            <strong>Context telt.</strong> Een grote, groeiende economie kan meer schuld dragen dan een kleine, krimpende.
          </div>
        </section>

        <section>
          <h2 className="article-title">Wat beweegt de schuldquote door de tijd?</h2>
          <p>Drie krachten sturen het pad:</p>
          <ol>
            <li><strong>Primair saldo</strong> — begroting vóór rente. Overschot drukt schuld; tekort verhoogt die.</li>
            <li><strong>Groei vs. rente (r–g)</strong> — als <Term title="Nominale bbp-groei">g</Term> groter is dan <Term title="Gemiddelde effectieve rente op schuld">r</Term>, daalt of stabiliseert de ratio vaak.</li>
            <li><strong>Eenmalige factoren</strong> — bankreddingen, verkoop van activa, inflatieschokken, wisselkoers.</li>
          </ol>
          <RGDiagram />
          <p className="tag" style={{ marginTop: 10 }}>
            Methodologische details: <Link href="/nl/methodology">hoe we cijfers schatten en bijwerken</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">Veelgestelde vragen (FAQ)</h2>

          <details className="debt-faq">
            <summary>Wat is het verschil tussen schuld en tekort?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Tekort = één jaar waarin uitgaven hoger zijn dan inkomsten. Schuld = totaalbedrag dat door de tijd is opgebouwd.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Kan een land zijn schuld volledig aflossen?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Het kan, maar is ongebruikelijk. Meestal wordt schuld doorgerold: nieuwe obligaties lossen oude af. Doel is houdbare schuld.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Is alle persoonlijke schuld slecht?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Nee. Schuld die vermogen of inkomen opbouwt (hypotheek, studie, bedrijf) kan nuttig zijn; hoge-rente consumptieschuld meestal niet.
            </p>
          </details>

          <p className="tag" style={{ marginTop: 10 }}>
            Bronnen: Eurostat (overheidsfinanciën) en nationale ministeries van Financiën. Educatieve uitleg; geen beleggingsadvies.
          </p>

          <div className="cta card" style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/nl" className="btn">Bekijk de live EU-kaart →</Link>
            <Link href="/nl/debt-to-gdp" className="btn">Debt-to-GDP uitgelegd →</Link>
            <Link href="/nl/debt-vs-deficit" className="btn">Schuld vs. tekort →</Link>
            <Link href="/nl/stability-and-growth-pact" className="btn">Stabiliteits- en Groeipact →</Link>
            <Link href="/nl/methodology" className="btn">Methodologie →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
