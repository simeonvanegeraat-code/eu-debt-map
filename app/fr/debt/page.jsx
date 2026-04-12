// app/fr/debt/page.jsx
import Link from "next/link";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/fr/debt";
  const title =
    "Qu’est-ce que la dette publique ? Dette, déficit et obligations expliqués | EU Debt Map";
  const description =
    "Une explication simple de la dette publique : ce qu’est la dette de l’État, la différence avec le déficit, le fonctionnement des obligations, les prêteurs de l’État et l’importance du ratio dette/PIB.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt`,
        nl: `${base}/nl/debt`,
        de: `${base}/de/debt`,
        fr: `${base}${path}`,
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
          alt: "Explication de la dette publique",
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
      <div className="tag">Le ratio dette/PIB en un coup d’œil</div>

      <div
        role="img"
        aria-label="Échelle illustrative du ratio dette/PIB avec un point de référence à 60 pour cent"
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
          <span>&lt;60% zone de référence</span>
          <span>60–90% zone d’attention</span>
          <span>&gt;90%</span>
        </div>
      </div>

      <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
        Le ratio dette/PIB compare la dette publique totale à la production économique annuelle. Il n’explique pas tout, mais il permet de mieux comparer des pays de tailles très différentes.
      </p>
    </div>
  );
}

export default function DebtExplainerFR() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Qu’est-ce que la dette publique ? Dette, déficit et obligations expliqués",
    inLanguage: "fr",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/fr/debt",
    about: [
      "dette publique",
      "dette de l’État",
      "dette vs déficit",
      "obligations d’État",
      "ratio dette/PIB",
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Qu’est-ce que la dette publique ? Dette, déficit et obligations expliqués",
    url: "https://www.eudebtmap.com/fr/debt",
    description:
      "Une explication simple de la dette publique : ce qu’est la dette de l’État, la différence avec le déficit, le fonctionnement des obligations, les prêteurs de l’État et l’importance du ratio dette/PIB.",
    inLanguage: "fr",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.eudebtmap.com/fr" },
      { "@type": "ListItem", position: 2, name: "Guide de la dette publique", item: "https://www.eudebtmap.com/fr/debt" },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Qu’est-ce que la dette publique ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La dette publique est le montant total que l’État doit encore après des années d’emprunt. Elle augmente généralement lorsque les dépenses dépassent les recettes.",
        },
      },
      {
        "@type": "Question",
        name: "Quelle est la différence entre dette et déficit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le déficit est le manque constaté sur une période budgétaire lorsque les dépenses sont supérieures aux recettes. La dette est le stock total accumulé au fil des années.",
        },
      },
      {
        "@type": "Question",
        name: "Qui achète les obligations d’État ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Les obligations d’État sont généralement achetées par des banques, des fonds de pension, des assureurs, des fonds d’investissement, des investisseurs étrangers et parfois des banques centrales.",
        },
      },
      {
        "@type": "Question",
        name: "Pourquoi le ratio dette/PIB est-il important ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le ratio dette/PIB compare la dette publique à la taille de l’économie. Il montre donc mieux le poids de la dette qu’un simple montant en euros.",
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
            Qu’est-ce que la dette publique ?
          </h1>

          <div style={{ maxWidth: "70ch", display: "grid", gap: 10 }}>
            <p className="hero-lede" style={{ margin: 0 }}>
              La dette publique est le montant total que l’État doit encore après des années d’emprunt. Quand un gouvernement dépense plus qu’il ne perçoit, l’écart est souvent financé par des obligations.
            </p>

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              Cette page se concentre uniquement sur la <strong>dette publique</strong>, pas sur les finances personnelles. Elle explique ce qu’est la dette de l’État, en quoi elle diffère du déficit, qui prête aux gouvernements et pourquoi le <Term title="Dette publique en pourcentage de la production économique annuelle">ratio dette/PIB</Term> compte autant.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              <Link href="/fr" className="btn">Ouvrir la carte de l’UE →</Link>
              <Link href="/fr/debt-to-gdp" className="btn">Dette/PIB expliqué →</Link>
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
              label="Dette"
              text="Le montant total restant que l’État doit encore rembourser."
            />
            <MiniCard
              label="Déficit"
              text="L’écart observé sur une période budgétaire lorsque les dépenses dépassent les recettes."
            />
            <MiniCard
              label="Obligation"
              text="Le principal IOU utilisé par les États pour emprunter aux investisseurs."
            />
            <MiniCard
              label="Dette/PIB"
              text="La dette comparée à la taille de l’économie, pas seulement à un montant en euros."
            />
          </div>
        </header>
      </section>

      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">La dette publique en une phrase</h2>
          <p className="article-body">
            La dette publique est le résultat cumulé des emprunts passés. Un pays enregistre parfois des déficits, les finance par des obligations, puis reporte la dette restante dans le temps jusqu’à son remboursement ou son refinancement.
          </p>
          <div className="tag" style={{ marginTop: 8 }}>
            En bref : le <strong>déficit</strong> est l’écart d’une période, tandis que la <strong>dette</strong> est la somme qui reste ouverte ensuite.
          </div>
        </section>

        <section>
          <h2 className="article-title">Dette vs déficit</h2>
          <CompareCard
            leftTitle="Déficit"
            leftText="Une grandeur de flux. Il montre combien l’État doit emprunter sur une période budgétaire lorsque les dépenses sont supérieures aux recettes."
            rightTitle="Dette"
            rightText="Une grandeur de stock. Elle montre le montant total encore dû après des années d’emprunts, de remboursements et de refinancements."
          />
        </section>

        <section>
          <h2 className="article-title">Comment l’État emprunte-t-il ?</h2>
          <p className="article-body">
            Les États empruntent surtout via des <strong>obligations d’État</strong>. Ce sont des titres de dette officiels par lesquels les investisseurs avancent de l’argent aujourd’hui contre des intérêts et un remboursement plus tard.
          </p>

          <StepGrid
            steps={[
              {
                title: "L’État émet des obligations",
                text: "Le gouvernement propose des titres de dette pour lever des fonds sur le marché.",
              },
              {
                title: "Les investisseurs achètent",
                text: "Banques, fonds, caisses de retraite et autres acteurs apportent le capital.",
              },
              {
                title: "Des intérêts sont versés",
                text: "Les détenteurs reçoivent des paiements d’intérêt pendant la durée de vie du titre.",
              },
              {
                title: "Remboursement ou refinancement",
                text: "À l’échéance, la dette est remboursée ou remplacée par une nouvelle émission.",
              },
            ]}
          />
        </section>

        <section>
          <h2 className="article-title">Qui détient cette dette ?</h2>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 8,
            }}
          >
            <MiniCard
              label="Investisseurs domestiques"
              text="Les banques locales, assureurs, fonds de pension et parfois les ménages détiennent souvent une large part."
            />
            <MiniCard
              label="Investisseurs étrangers"
              text="Les fonds internationaux et les institutions étrangères peuvent aussi être des prêteurs importants."
            />
            <MiniCard
              label="Banques centrales"
              text="Dans certaines périodes, les banques centrales détiennent des obligations d’État au titre de la politique monétaire."
            />
          </div>
        </section>

        <section>
          <h2 className="article-title">Quand la dette devient-elle un problème ?</h2>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 8,
            }}
          >
            <MiniCard
              label="Les intérêts coûtent plus cher"
              text="Une part plus importante des recettes fiscales part au service de la dette plutôt qu’aux politiques publiques."
            />
            <MiniCard
              label="La croissance reste faible"
              text="Si l’économie progresse peu, le même niveau de dette devient plus lourd à porter."
            />
            <MiniCard
              label="La confiance recule"
              text="Les investisseurs peuvent demander des taux plus élevés, ce qui renchérit encore l’endettement."
            />
          </div>
        </section>

        <section>
          <h2 className="article-title">Pourquoi le ratio dette/PIB compte</h2>
          <p className="article-body">
            Le montant brut de la dette peut être trompeur. Un niveau élevé peut rester soutenable pour une grande économie solide, alors qu’un montant plus faible peut devenir risqué dans une économie plus fragile. C’est pourquoi les économistes comparent la dette au PIB annuel.
          </p>
          <RatioBand />
          <p className="tag" style={{ marginTop: 10 }}>
            Un pays avec une croissance solide, des taux modérés et des institutions crédibles peut souvent supporter davantage de dette qu’une économie plus petite ou plus faible.
          </p>
        </section>

        <section>
          <h2 className="article-title">Questions fréquentes</h2>

          <details className="debt-faq">
            <summary>La dette publique est-elle toujours mauvaise ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Non. L’emprunt peut être utile pour financer l’investissement de long terme ou stabiliser l’économie en période difficile. La vraie question est celle de la soutenabilité.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Un pays doit-il rembourser toute sa dette un jour ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Pas forcément. De nombreux États refinancent une partie de leur dette à mesure que les obligations arrivent à échéance. L’objectif est la soutenabilité, pas zéro dette.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Pourquoi un pays riche peut-il souvent supporter plus de dette ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Parce que la capacité de remboursement dépend de la taille et de la solidité de l’économie, pas uniquement du montant brut de la dette.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Pourquoi EU Debt Map insiste-t-il autant sur le ratio dette/PIB ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Parce que c’est la manière la plus claire de comparer équitablement des pays de tailles très différentes.
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
        <h2 className="article-title" style={{ marginBottom: 0 }}>Étape suivante</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/fr" className="btn">Voir la carte en direct →</Link>
          <Link href="/fr/debt-to-gdp" className="btn">Dette/PIB expliqué →</Link>
          <Link href="/fr/debt-vs-deficit" className="btn">Dette vs déficit →</Link>
          <Link href="/fr/methodology" className="btn">Méthodologie →</Link>
        </div>

        <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/fr/country/de" className="nav-link">Allemagne</Link>
          <Link href="/fr/country/fr" className="nav-link">France</Link>
          <Link href="/fr/country/it" className="nav-link">Italie</Link>
          <Link href="/fr/country/es" className="nav-link">Espagne</Link>
          <Link href="/fr/country/nl" className="nav-link">Pays-Bas</Link>
        </div>

        <p className="tag" style={{ margin: 0 }}>
          Sources : données Eurostat sur les finances publiques et institutions financières publiques nationales. Contenu éducatif, pas un conseil en investissement.
        </p>
      </section>
    </main>
  );
}