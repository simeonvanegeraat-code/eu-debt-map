// app/fr/methodology/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/methodology";
  const title = "Méthodologie • EU Debt Map";
  const description =
    "Comment EU Debt Map collecte, convertit et interpole les données pour afficher des estimations en direct de la dette publique dans l’UE-27.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/fr${path}`,
      languages: {
        en: `${base}${path}`,
        nl: `${base}/nl${path}`,
        de: `${base}/de${path}`,
        fr: `${base}/fr${path}`,
        "x-default": `${base}${path}`,
      },
    },
    openGraph: {
      title,
      description:
        "Source des données, filtres, conversion et interpolation utilisées par EU Debt Map.",
      url: `${base}/fr${path}`,
      siteName: "EU Debt Map",
      type: "article",
    },
  };
}

function Callout({ type = "info", title, children }) {
  const styles = {
    info: { bg: "#0b1220", bd: "#1f2b3a" },
    warn: { bg: "#1b1320", bd: "#3a2637" },
  }[type] || { bg: "#0b1220", bd: "#1f2b3a" };

  return (
    <div style={{ background: styles.bg, border: `1px solid ${styles.bd}`, borderRadius: 12, padding: 12 }}>
      {title && <div className="tag" style={{ marginBottom: 8 }}>{title}</div>}
      <div>{children}</div>
    </div>
  );
}

export default function MethodologyPageFR() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quelle source de données est utilisée ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Eurostat gov_10q_ggdebt : gouvernement général (S.13), dette brute (GD), trimestrielle (freq=Q), valeurs en millions d’euros (unit=MIO_EUR), UE-27.",
        },
      },
      {
        "@type": "Question",
        name: "Comment le compteur en direct est-il calculé ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nous interpolons linéairement entre les deux derniers trimestres et extrapolons ensuite à l’aide d’un taux par seconde.",
        },
      },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Méthodologie</h2>
        <p>
          Cette page explique la source des données, les filtres appliqués et la méthode
          d’interpolation utilisée pour calculer une estimation en direct de la dette publique.
        </p>
        <ul>
          <li>Source : série trimestrielle d’Eurostat pour le secteur des administrations publiques (S.13).</li>
          <li>Nous conservons les <strong>deux trimestres les plus récents</strong> et calculons un taux par seconde.</li>
          <li>Les mises à jour sont publiées dès qu’Eurostat diffuse de nouvelles données.</li>
        </ul>
        <div className="tag">Dernière mise à jour de la méthode : {todayISO}</div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3>Source officielle</h3>
        <p>
          Nous utilisons l’ensemble de données <strong>gov_10q_ggdebt</strong> d’Eurostat
          (dette brute, définition de Maastricht).
        </p>
        <a className="btn" href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT" target="_blank">Accéder au jeu de données</a>
        <div className="tag" style={{ marginTop: 10 }}>
          Pays couverts : UE-27 (Eurostat utilise <strong>EL</strong> pour la Grèce)
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3>Pourquoi une approche simple ?</h3>
        <Callout type="info">
          L’objectif est la clarté et la rapidité : une interpolation linéaire garde la méthode
          transparente et les performances optimales. Des modèles plus complexes pourront être ajoutés plus tard.
        </Callout>
      </section>
    </main>
  );
}
