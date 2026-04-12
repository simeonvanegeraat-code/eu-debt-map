// app/nl/debt/page.jsx
import Link from "next/link";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/nl/debt";
  const title =
    "Wat is overheidsschuld? Schuld, tekort en obligaties uitgelegd | EU Debt Map";
  const description =
    "Eenvoudige uitleg over overheidsschuld: wat publieke schuld is, het verschil tussen schuld en tekort, hoe staatsobligaties werken, wie de overheid geld leent en waarom schuld/bbp belangrijk is.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt`,
        nl: `${base}${path}`,
        de: `${base}/de${path}`,
        fr: `${base}/fr${path}`,
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
          alt: "Uitleg overheidsschuld",
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
      <div className="tag">Schuld/bbp in één oogopslag</div>

      <div
        role="img"
        aria-label="Illustratieve schuld-bbp-schaal met een referentiepunt op 60%"
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
          <span>&lt;60% referentiezone</span>
          <span>60–90% waakzone</span>
          <span>&gt;90%</span>
        </div>
      </div>

      <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
        De schuld-bbp-ratio vergelijkt de totale overheidsschuld met de jaarlijkse economische productie. Het zegt niet alles, maar maakt landen van verschillende grootte wel beter vergelijkbaar.
      </p>
    </div>
  );
}

export default function DebtExplainerNL() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wat is overheidsschuld? Schuld, tekort en obligaties uitgelegd",
    inLanguage: "nl",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/nl/debt",
    about: [
      "overheidsschuld",
      "publieke schuld",
      "schuld vs tekort",
      "staatsobligaties",
      "schuld-bbp-ratio",
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Wat is overheidsschuld? Schuld, tekort en obligaties uitgelegd",
    url: "https://www.eudebtmap.com/nl/debt",
    description:
      "Eenvoudige uitleg over overheidsschuld: wat publieke schuld is, het verschil tussen schuld en tekort, hoe staatsobligaties werken, wie de overheid geld leent en waarom schuld/bbp belangrijk is.",
    inLanguage: "nl",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.eudebtmap.com/nl" },
      { "@type": "ListItem", position: 2, name: "Gids overheidsschuld", item: "https://www.eudebtmap.com/nl/debt" },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wat is overheidsschuld?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Overheidsschuld is het totale bedrag dat de staat nog verschuldigd is na jaren van lenen. Die schuld loopt meestal op wanneer de overheid meer uitgeeft dan zij ontvangt.",
        },
      },
      {
        "@type": "Question",
        name: "Wat is het verschil tussen schuld en tekort?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Een tekort is het gat in één begrotingsperiode wanneer uitgaven hoger zijn dan inkomsten. Schuld is de totale opgebouwde voorraad over meerdere jaren.",
        },
      },
      {
        "@type": "Question",
        name: "Wie koopt staatsobligaties?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Staatsobligaties worden meestal gekocht door banken, pensioenfondsen, verzekeraars, beleggingsfondsen, buitenlandse investeerders en soms centrale banken.",
        },
      },
      {
        "@type": "Question",
        name: "Waarom is schuld/bbp belangrijk?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Schuld/bbp vergelijkt de overheidsschuld met de omvang van de economie. Daardoor zie je beter hoe zwaar de schuldenlast is dan met alleen een bedrag in euro’s.",
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
            Wat is overheidsschuld?
          </h1>

          <div style={{ maxWidth: "70ch", display: "grid", gap: 10 }}>
            <p className="hero-lede" style={{ margin: 0 }}>
              Overheidsschuld is het totale geldbedrag dat een staat nog verschuldigd is na jaren van lenen. Als een overheid meer uitgeeft dan zij binnenkrijgt, wordt dat verschil vaak gefinancierd met obligaties.
            </p>

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              Deze pagina gaat alleen over <strong>publieke schuld</strong>, niet over persoonlijke financiën. Je leest hier wat overheidsschuld is, hoe het verschilt van een tekort, wie overheden geld lenen en waarom de <Term title="Overheidsschuld als aandeel van de jaarlijkse economische productie">schuld-bbp-ratio</Term> zo belangrijk is.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              <Link href="/nl" className="btn">Open de live EU-kaart →</Link>
              <Link href="/nl/debt-to-gdp" className="btn">Schuld/bbp uitgelegd →</Link>
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
              label="Schuld"
              text="De totale openstaande som die de overheid nog moet terugbetalen."
            />
            <MiniCard
              label="Tekort"
              text="Het gat in één begrotingsperiode wanneer uitgaven hoger zijn dan inkomsten."
            />
            <MiniCard
              label="Obligatie"
              text="De belangrijkste IOU waarmee overheden geld lenen van investeerders."
            />
            <MiniCard
              label="Schuld/bbp"
              text="Schuld vergeleken met de omvang van de economie, niet alleen met een eurobedrag."
            />
          </div>
        </header>
      </section>

      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">Overheidsschuld in één zin</h2>
          <p className="article-body">
            Overheidsschuld is het opgebouwde resultaat van eerder lenen. Een land heeft soms een tekort, financiert dat met obligaties en neemt de openstaande schuld vervolgens mee naar de toekomst totdat die wordt afgelost of doorgerold.
          </p>
          <div className="tag" style={{ marginTop: 8 }}>
            Simpel gezegd: een <strong>tekort</strong> is het gat van één jaar, terwijl <strong>schuld</strong> de optelsom is die daarna overblijft.
          </div>
        </section>

        <section>
          <h2 className="article-title">Schuld vs. tekort</h2>
          <CompareCard
            leftTitle="Tekort"
            leftText="Een stroomgrootheid. Het laat zien hoeveel extra geld de overheid in één begrotingsperiode moet lenen als uitgaven hoger zijn dan inkomsten."
            rightTitle="Schuld"
            rightText="Een voorraadgrootheid. Het laat zien hoeveel er totaal nog openstaat na jaren van lenen, aflossen en doorrollen."
          />
        </section>

        <section>
          <h2 className="article-title">Hoe leent een overheid geld?</h2>
          <p className="article-body">
            Overheden lenen meestal via <strong>staatsobligaties</strong>. Dat zijn officiële schuldbewijzen waarmee investeerders de staat vandaag geld geven in ruil voor rente en terugbetaling later.
          </p>

          <StepGrid
            steps={[
              {
                title: "De staat geeft obligaties uit",
                text: "De overheid biedt schuldpapier aan om geld op te halen.",
              },
              {
                title: "Investeerders kopen mee",
                text: "Banken, fondsen, pensioenbeheerders en andere beleggers verstrekken het geld.",
              },
              {
                title: "Rente wordt betaald",
                text: "De houders ontvangen gedurende de looptijd rente als vergoeding.",
              },
              {
                title: "Aflossen of doorrollen",
                text: "Bij afloop wordt terugbetaald of vervangen door nieuw uitgegeven schuld.",
              },
            ]}
          />
        </section>

        <section>
          <h2 className="article-title">Wie houdt die schuld aan?</h2>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 8,
            }}
          >
            <MiniCard
              label="Binnenlandse beleggers"
              text="Lokale banken, verzekeraars, pensioenfondsen en soms huishoudens bezitten vaak een groot deel."
            />
            <MiniCard
              label="Buitenlandse beleggers"
              text="Internationale fondsen en buitenlandse instellingen kunnen ook belangrijke financiers zijn."
            />
            <MiniCard
              label="Centrale banken"
              text="In sommige periodes houden centrale banken staatsobligaties aan voor monetair beleid."
            />
          </div>
        </section>

        <section>
          <h2 className="article-title">Wanneer wordt schuld een probleem?</h2>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 8,
            }}
          >
            <MiniCard
              label="Rentelasten lopen op"
              text="Meer belastinggeld gaat naar schuldendienst in plaats van naar publieke voorzieningen."
            />
            <MiniCard
              label="Groei blijft zwak"
              text="Bij een trage economie wordt dezelfde schuldenlast zwaarder om te dragen."
            />
            <MiniCard
              label="Vertrouwen neemt af"
              text="Beleggers kunnen hogere rentes eisen, waardoor lenen nog duurder wordt."
            />
          </div>
        </section>

        <section>
          <h2 className="article-title">Waarom schuld/bbp telt</h2>
          <p className="article-body">
            Alleen naar het ruwe schuldbedrag kijken kan misleidend zijn. Een groot bedrag kan voor een sterke economie best draaglijk zijn, terwijl een kleiner bedrag voor een zwakker land juist problematisch kan zijn. Daarom vergelijken economen schuld met het jaarlijkse bbp.
          </p>
          <RatioBand />
          <p className="tag" style={{ marginTop: 10 }}>
            Een land met sterke groei, lage rente en geloofwaardige instellingen kan vaak meer schuld dragen dan een kleinere of zwakkere economie.
          </p>
        </section>

        <section>
          <h2 className="article-title">Veelgestelde vragen</h2>

          <details className="debt-faq">
            <summary>Is overheidsschuld altijd slecht?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Nee. Lenen kan nuttig zijn voor langetermijninvesteringen of om de economie te steunen tijdens een recessie. De kernvraag is of de schuld houdbaar blijft.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Moet een land al zijn schuld ooit helemaal aflossen?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Meestal niet. Veel overheden rollen een deel van de schuld door wanneer obligaties aflopen. Het doel is houdbaarheid, niet nul schuld.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Waarom kan een rijk land vaak meer schuld dragen?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Omdat aflossingscapaciteit afhangt van de grootte en kracht van de economie, niet alleen van het schuldbedrag zelf.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Waarom legt EU Debt Map zoveel nadruk op schuld/bbp?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Omdat dit de duidelijkste manier is om landen van verschillende omvang eerlijk met elkaar te vergelijken.
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
        <h2 className="article-title" style={{ marginBottom: 0 }}>Volgende stap</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/nl" className="btn">Bekijk de live EU-kaart →</Link>
          <Link href="/nl/debt-to-gdp" className="btn">Schuld/bbp uitgelegd →</Link>
          <Link href="/nl/debt-vs-deficit" className="btn">Schuld vs. tekort →</Link>
          <Link href="/nl/methodology" className="btn">Methodologie →</Link>
        </div>

        <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/nl/country/de" className="nav-link">Duitsland</Link>
          <Link href="/nl/country/fr" className="nav-link">Frankrijk</Link>
          <Link href="/nl/country/it" className="nav-link">Italië</Link>
          <Link href="/nl/country/es" className="nav-link">Spanje</Link>
          <Link href="/nl/country/nl" className="nav-link">Nederland</Link>
        </div>

        <p className="tag" style={{ margin: 0 }}>
          Bronnen: Eurostat overheidsfinanciën en nationale publieke financiële instellingen. Educatieve uitleg, geen beleggingsadvies.
        </p>
      </section>
    </main>
  );
}