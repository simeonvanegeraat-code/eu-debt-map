// app/fr/debt/page.jsx
import Link from "next/link";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/fr/debt";
  const title =
    "Qu’est-ce que la dette ? Guide simple de la dette personnelle et de la dette publique • EU Debt Map";
  const description =
    "La dette expliquée simplement. Dette personnelle (bonne vs mauvaise), qu’est-ce que la dette publique, différence entre dette et déficit, fonctionnement des obligations, détenteurs de la dette et ratio dette/PIB (debt-to-GDP) avec visuels et FAQ.";

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
      <svg width={width} height={height} role="img" aria-label={`Ratio dette/PIB ${pct}%`} style={{ display: "block" }}>
        <rect x="0" y="0" width={width} height={height} rx="9" fill="#e5e7eb" />
        <rect x="0" y="0" width={filled} height={height} rx="9" />
        <text x={width - 6} y={height - 5} textAnchor="end" fontSize="12" fill="#111827" aria-hidden="true">
          {pct}%
        </text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        50 % signifie : la dette publique équivaut à la moitié de la production annuelle.
      </figcaption>
    </figure>
  );
}

function RGDiagram() {
  const w = 360, h = 200;
  return (
    <figure style={{ margin: "12px 0 0 0" }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Schéma : intérêt (r) vs croissance (g)">
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
        <text x="44" y="20" fontSize="11" fill="#111827">La ratio baisse souvent quand g &gt; r</text>
        <text x="44" y={h - 12} fontSize="11" fill="#6b7280">Temps</text>
        <text x="12" y="22" transform={`rotate(-90 12,22)`} fontSize="11" fill="#6b7280">Niveau</text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        Si <strong>g</strong> (croissance) dépasse <strong>r</strong> (intérêt), la ratio dette/PIB peut se stabiliser ou baisser.
      </figcaption>
    </figure>
  );
}

export default function DebtExplainerFR() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Qu’est-ce que la dette ? Guide simple de la dette personnelle et publique",
    inLanguage: "fr",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/fr/debt",
    about: ["définition de la dette","dette personnelle","dette publique","dette/PIB","différence dette et déficit"],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Qu’est-ce que la dette ? Guide simple",
    url: "https://www.eudebtmap.com/fr/debt",
    description:
      "La dette en termes simples : dette personnelle (bonne vs mauvaise), dette publique et déficit, obligations, détenteurs et ratio dette/PIB.",
    inLanguage: "fr",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.eudebtmap.com/fr" },
      { "@type": "ListItem", position: 2, name: "Guide de la dette", item: "https://www.eudebtmap.com/fr/debt" },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quelle est la différence entre dette et déficit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le déficit est le manque annuel quand les dépenses dépassent les recettes. La dette est le montant total cumulé au fil du temps.",
        },
      },
      {
        "@type": "Question",
        name: "Un pays doit-il rembourser toute sa dette ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "C’est possible, mais rare. La plupart des grandes économies refinancent la dette à l’échéance via de nouvelles obligations. L’objectif est la soutenabilité.",
        },
      },
      {
        "@type": "Question",
        name: "Toute dette personnelle est-elle mauvaise ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Non. La “bonne” dette peut créer de la valeur ou du revenu (logement, études, entreprise). La dette de consommation à taux élevé est généralement nuisible.",
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
            Qu’est-ce que la dette ? Guide simple de la dette personnelle et publique
          </h1>

          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              Le mot <em>dette</em> paraît souvent complexe. En réalité, c’est une promesse : recevoir de l’argent aujourd’hui, le rembourser demain.
            </p>

            <div className="divider-soft" aria-hidden />

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              On commence par la <strong>dette personnelle</strong>, puis on passe à la{" "}
              <strong>dette publique</strong>. On explique la{" "}
              <strong>différence entre dette et déficit</strong>, comment fonctionne le{" "}
              <Term title="Dette publique en pourcentage de la production annuelle">ratio dette/PIB</Term>,
              et pourquoi un peu de dette peut aider alors qu’un excès devient risqué.
            </p>

            <p className="tag" style={{ marginTop: 8 }}>
              Vous préférez la vue d’ensemble ?{" "}
              <Link href="/fr" className="btn" style={{ padding: "6px 10px", marginLeft: 6 }}>
                Voir la carte de l’UE →
              </Link>
            </p>
          </div>
        </header>
      </section>

      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">Les bases : qu’est-ce que la dette personnelle ?</h2>
          <p className="article-body">
            C’est de l’argent emprunté que l’on rembourse avec des{" "}
            <Term title="Prix de l’argent emprunté, en pourcentage annuel">intérêts</Term>.
            L’<strong>emprunteur</strong> reçoit l’argent maintenant ; le <strong>prêteur</strong> facture des intérêts.
          </p>
          <div className="tag" role="note" style={{ marginTop: 8 }}>
            <strong>Exemple.</strong> 5 € payés par carte et facture en retard → les intérêts rendent l’achat plus cher.
          </div>

          <h3 className="article-subtitle" style={{ marginTop: 14 }}>Bonne vs mauvaise dette</h3>
          <div className="card" style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <div><strong>Bonne dette (investissement)</strong> — logement, études, entreprise.</div>
            <div><strong>Mauvaise dette (consommation)</strong> — soldes de cartes à intérêt élevé, prêts courts.</div>
          </div>
        </section>

        <section>
          <h2 className="article-title">Changer d’échelle : qu’est-ce que la dette publique ?</h2>
          <p className="article-body">
            C’est le total que l’État doit. Recettes (impôts) et dépenses (infrastructures, santé, éducation, défense).
            S’il manque, l’État emprunte.
          </p>

        <h3 className="article-subtitle">Dette vs déficit</h3>
          <p>
            <strong>Déficit</strong> = une année. <strong>Dette</strong> = cumul sur plusieurs années.
            Analogie : le déficit est l’ajout <em>du mois</em> ; la dette est le <em>solde total</em>.
          </p>

          <h3 className="article-subtitle">Comment l’État emprunte-t-il ?</h3>
          <p>
            Surtout via des <strong>obligations</strong>. L’investisseur achète, reçoit des intérêts et le nominal à l’échéance.
            Les acheteurs sont des ménages, des banques, des fonds de pension, d’autres pays ou parfois la banque centrale.
          </p>
        </section>

        <section>
          <h2 className="article-title">La dette publique est-elle toujours mauvaise ?</h2>
          <div className="card" style={{ display: "grid", gap: 8 }}>
            <div><strong>Le bon.</strong> Financer des investissements durables, soutenir l’économie en récession.</div>
            <div><strong>Le mauvais.</strong> Trop de dette = intérêts élevés → moins d’argent pour écoles ou hôpitaux.</div>
            <div><strong>Le pire.</strong> Si la confiance chute, les taux exigés montent et la crise menace.</div>
          </div>
        </section>

        <section>
          <h2 className="article-title">L’indicateur clé : ratio dette/PIB</h2>
          <p>
            Pour juger l’ampleur, on compare la dette totale à la taille de l’économie :
            le <Term title="Dette publique divisée par la production annuelle">ratio dette/PIB</Term>.
          </p>
          <DebtMeter value={50} />
          <div className="tag" style={{ marginTop: 10 }}>
            <strong>Le contexte compte.</strong> Une grande économie en croissance supporte plus de dette qu’une petite en recul.
          </div>
        </section>

        <section>
          <h2 className="article-title">Ce qui fait bouger la ratio dans le temps</h2>
          <ol>
            <li><strong>Solde primaire</strong> — budget avant intérêts.</li>
            <li><strong>Croissance vs intérêt (r–g)</strong> — si <Term title="Croissance nominale du PIB">g</Term> &gt; <Term title="Taux d’intérêt effectif moyen">r</Term>.</li>
            <li><strong>Mesures ponctuelles</strong> — sauvetages bancaires, ventes d’actifs, inflation, change.</li>
          </ol>
          <RGDiagram />
          <p className="tag" style={{ marginTop: 10 }}>
            Détails méthodo : <Link href="/fr/methodology">comment nous estimons et mettons à jour</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>
          <details className="debt-faq">
            <summary>Différence entre dette et déficit ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Déficit = manque annuel ; dette = montant cumulé au fil du temps.
            </p>
          </details>
          <details className="debt-faq">
            <summary>Un pays peut-il rembourser toute sa dette ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Possible mais rare. On refinance généralement à l’échéance. L’objectif est la soutenabilité.
            </p>
          </details>
          <details className="debt-faq">
            <summary>Toute dette personnelle est-elle mauvaise ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Non. La dette d’investissement peut aider ; la dette de consommation à taux élevé nuit souvent.
            </p>
          </details>

          <p className="tag" style={{ marginTop: 10 }}>
            Sources : Eurostat et ministères nationaux des Finances. Contenu éducatif ; pas de conseil en investissement.
          </p>

          <div className="cta card" style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/fr" className="btn">Voir la carte de l’UE →</Link>
            <Link href="/fr/debt-to-gdp" className="btn">Dette/PIB expliqué →</Link>
            <Link href="/fr/debt-vs-deficit" className="btn">Dette vs déficit →</Link>
            <Link href="/fr/stability-and-growth-pact" className="btn">Pacte de stabilité →</Link>
            <Link href="/fr/methodology" className="btn">Méthodologie →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
