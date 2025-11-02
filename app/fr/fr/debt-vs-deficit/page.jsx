// app/fr/debt-vs-deficit/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA (FR)
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/fr/debt-vs-deficit";
  const title = "Dette vs Déficit — La différence en 5 minutes • EU Debt Map";
  const description =
    "Comprenez la différence entre dette publique (stock) et déficit (flux). Explication claire et visuelle avec exemples, analogie, FAQ et liens vers dette/PIB et le Pacte de stabilité et de croissance.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/debt-vs-deficit`,
        nl: `${base}/nl/debt-vs-deficit`,
        de: `${base}/de/debt-vs-deficit`,
        fr: `${base}${path}`,
        "x-default": `${base}/debt-vs-deficit`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      images: [{ url: "/og/debt-explainer-1200x630.jpg", width: 1200, height: 630, alt: "Dette vs Déficit infographie" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og/debt-explainer-1200x630.jpg"] },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

/** -----------------------------
 * INLINE SVG: Flux vs Stock
 * ----------------------------- */
function StockFlowSVG() {
  const w = 420, h = 160;
  return (
    <figure style={{ marginTop: 8 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Déficit (flux) vs Dette (stock)">
        {/* Réservoir (stock) */}
        <rect x="240" y="30" width="160" height="100" rx="10" fill="#e5e7eb" />
        <text x="320" y="88" textAnchor="middle" fontSize="12">Dette (stock)</text>

        {/* Arrivée (déficit) */}
        <line x1="40" y1="60" x2="220" y2="60" stroke="#10b981" strokeWidth="6" />
        <polygon points="220,56 220,64 234,60" fill="#10b981" />
        <text x="40" y="50" fontSize="12" fill="#065f46">Déficit (flux annuel)</text>

        {/* Sortie (excédent) */}
        <line x1="320" y1="130" x2="320" y2="150" stroke="#ef4444" strokeWidth="6" />
        <text x="326" y="152" fontSize="12" fill="#7f1d1d">Remboursement / excédent</text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        Le <em>déficit</em> est un <em>flux</em> annuel ; la <em>dette</em> est le <em>stock</em> qui s’accumule (ou baisse) dans le temps.
      </figcaption>
    </figure>
  );
}

/** -----------------------------
 * MAIN PAGE (FR)
 * ----------------------------- */
export default function DebtVsDeficitFR() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Dette vs Déficit — La différence en 5 minutes",
    inLanguage: "fr",
    mainEntityOfPage: "https://www.eudebtmap.com/fr/debt-vs-deficit",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    about: ["dette publique","déficit budgétaire","dette vs déficit","dette/PIB","finances publiques"],
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
          text: "Le déficit est le manque annuel entre dépenses et recettes ; la dette est le montant total accumulé au fil des années.",
        },
      },
      {
        "@type": "Question",
        name: "La dette peut-elle baisser sans excédent ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Si la croissance nominale (g) dépasse le taux d’intérêt moyen (r), le ratio dette/PIB peut baisser malgré de petits déficits.",
        },
      },
      {
        "@type": "Question",
        name: "Pourquoi la dette peut-elle augmenter alors que l’économie croît ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Parce que le solde primaire peut rester négatif ou que des mesures ponctuelles (sauvetages bancaires, achats d’actifs) gonflent la dette plus vite que le PIB.",
        },
      },
    ],
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.eudebtmap.com/fr" },
      { "@type": "ListItem", position: 2, name: "Dette vs Déficit", item: "https://www.eudebtmap.com/fr/debt-vs-deficit" },
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
            Dette vs Déficit — La différence en 5 minutes
          </h1>
          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              En bref : le <strong>déficit</strong> est ce qui s’ajoute cette année ; la <strong>dette</strong> est ce qui reste dû au total.
            </p>
          </div>
        </header>
      </section>

      {/* ARTICLE */}
      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">Concept clé : flux vs stock</h2>
          <p>
            Un <strong>déficit budgétaire</strong> est un <em>flux</em> annuel. La <strong>dette publique</strong> est un <em>stock</em> accumulé.
          </p>
          <StockFlowSVG />
        </section>

        <section>
          <h2 className="article-title">Une analogie parlante</h2>
          <p>
            Pensez à votre carte de crédit : le <strong>déficit</strong> correspond au nouveau solde du mois ; la <strong>dette</strong> est le solde total restant.
          </p>
        </section>

        <section>
          <h2 className="article-title">Pourquoi cela compte</h2>
          <ul>
            <li><strong>Horizon temporel :</strong> déficit = court terme ; dette = accumulation de long terme.</li>
            <li><strong>Charge d’intérêts :</strong> plus de dette = plus d’intérêts et moins de marge de manœuvre.</li>
            <li><strong>Comparabilité :</strong> on compare via le ratio dette/PIB, pas les montants bruts.</li>
          </ul>
          <p className="tag" style={{ marginTop: 8 }}>
            À lire aussi : <Link href="/fr/debt-to-gdp">Dette/PIB expliqué</Link> ·{" "}
            <Link href="/fr/stability-and-growth-pact">Pacte de stabilité et de croissance</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>
          <details className="debt-faq">
            <summary>La dette baisse-t-elle automatiquement en cas d’excédent ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Un excédent primaire aide, mais le ratio dépend aussi de g (croissance) et r (taux d’intérêt).
            </p>
          </details>
          <details className="debt-faq">
            <summary>Le ratio peut-il baisser malgré un petit déficit ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Oui, si <strong>g &gt; r</strong> — lorsque le PIB progresse plus vite que la dette.
            </p>
          </details>
          <details className="debt-faq">
            <summary>Où voir les chiffres à jour ?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Ouvrez la{" "}
              <Link href="/fr" className="btn" style={{ padding: "2px 8px" }}>
                carte de l’UE
              </Link>{" "}
              puis choisissez un pays.
            </p>
          </details>

          <div className="cta card" style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/fr" className="btn">Voir la carte →</Link>
            <Link href="/fr/debt" className="btn">Qu’est-ce que la dette ? →</Link>
            <Link href="/fr/stability-and-growth-pact" className="btn">PSC (SGP) →</Link>
            <Link href="/fr/methodology" className="btn">Méthodologie →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
