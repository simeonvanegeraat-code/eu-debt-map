// app/fr/methodology/page.jsx

export const metadata = {
  title: "Méthodologie • EU Debt Map",
  description:
    "Comment EU Debt Map collecte, transforme et interpole les données de dette publique pour l’UE-27.",
  openGraph: {
    title: "Méthodologie • EU Debt Map",
    description:
      "Source des données, filtres, conversion et interpolation du compteur en direct d’EU Debt Map.",
    url: "https://eudebtmap.com/fr/methodology",
    siteName: "EU Debt Map",
    type: "article",
  },
  metadataBase: new URL("https://eudebtmap.com"),
  alternates: {
    canonical: "https://eudebtmap.com/fr/methodology",
    languages: {
      en: "https://eudebtmap.com/methodology",
      nl: "https://eudebtmap.com/nl/methodology",
      de: "https://eudebtmap.com/de/methodology",
      fr: "https://eudebtmap.com/fr/methodology",
      "x-default": "https://eudebtmap.com/methodology",
    },
  },
};

function Callout({ type = "info", title, children }) {
  const styles = {
    info: { bg: "#0b1220", bd: "#1f2b3a" },
    warn: { bg: "#1b1320", bd: "#3a2637" },
    ok: { bg: "#0b2b1d", bd: "#1f5d43" },
  }[type] || { bg: "#0b1220", bd: "#1f2b3a" };

  return (
    <div style={{ background: styles.bg, border: `1px solid ${styles.bd}`, borderRadius: 12, padding: 12 }}>
      {title && <div className="tag" style={{ marginBottom: 8 }}>{title}</div>}
      <div>{children}</div>
    </div>
  );
}

function CodeBlock({ title, children }) {
  return (
    <div style={{ background: "#0b1220", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label={title || "Exemple de code"}>
      {title && <div className="tag" style={{ marginBottom: 8 }}>{title}</div>}
      <pre className="mono" style={{ whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.5, fontSize: 13 }}>{children}</pre>
    </div>
  );
}

export default function MethodologyFR() {
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Méthodologie</h2>
        <p style={{ margin: 0 }}>
          Cette page explique la source des données, les filtres appliqués et
          l’interpolation simple que nous utilisons pour afficher une estimation
          en direct de la dette publique dans l’UE-27.
        </p>
        <ul style={{ marginTop: 10 }}>
          <li>Source : série trimestrielle Eurostat pour les administrations publiques (S.13).</li>
          <li>Nous conservons les <strong>deux derniers trimestres</strong> par pays et calculons un taux en €/s.</li>
          <li>Les mises à jour suivent les nouvelles publications d’Eurostat.</li>
        </ul>
        <div className="tag" style={{ marginTop: 6 }}>
          Dernière mise à jour : {todayISO}
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Source officielle</h3>
        <p style={{ marginTop: 0 }}>
          Nous utilisons le jeu de données trimestriel d’Eurostat <strong>gov_10q_ggdebt</strong>
          {" "} (dette brute des administrations publiques ; définition de Maastricht).
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          <a className="btn" href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN" target="_blank" rel="noopener noreferrer">
            Ouvrir l’API (gov_10q_ggdebt)
          </a>
          <a className="btn" href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT" target="_blank" rel="noopener noreferrer">
            Page du jeu de données
          </a>
          <a className="btn" href="/fr/about">À propos du projet</a>
        </div>

        <div style={{ marginTop: 14 }}>
          <h4 style={{ margin: "10px 0" }}>Filtres de sélection</h4>
          <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "6px 12px" }}>
            <dt className="mono tag">freq</dt><dd>Q (trimestriel)</dd>
            <dt className="mono tag">sector</dt><dd>S13 (administrations publiques)</dd>
            <dt className="mono tag">na_item</dt><dd>GD (dette brute)</dd>
            <dt className="mono tag">unit</dt><dd>MIO_EUR (converti en euros ×1 000 000)</dd>
            <dt className="mono tag">geo</dt><dd>États membres de l’UE-27 (Eurostat utilise EL pour la Grèce)</dd>
          </dl>
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Conversion & structure</h3>
        <p style={{ marginTop: 0 }}>
          Les valeurs arrivent en <em>millions d’euros</em> et sont converties en euros.
          Pour chaque pays, nous conservons les deux derniers trimestres (valeur + date ISO)
          et calculons un taux en €/s sécurisé (limitation des valeurs extrêmes).
        </p>
        <Callout type="info" title="Pourquoi une méthode simple ?">
          Pour le MVP, nous privilégions la clarté et la performance : une
          interpolation simple garde l’interface rapide et la méthode transparente.
          Des modèles plus avancés pourront être ajoutés ultérieurement.
        </Callout>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Compteur en direct (interpolation simple)</h3>
        <CodeBlock title="Logique d’interpolation (pseudocode)">
{`rate_per_second = (last_value - prev_value) / seconds_between_quarters

current_estimate(now) =
  if now <= last_quarter_end:
      // interpolation linéaire entre prev et last
      prev_value + (last_value - prev_value) * (now - prev_quarter_end) / (last_quarter_end - prev_quarter_end)
  else:
      // extrapolation après le dernier point avec rate_per_second
      last_value + rate_per_second * (now - last_quarter_end)
`}
        </CodeBlock>
        <div className="tag" style={{ marginTop: 10 }}>
          Remarque : les valeurs extrêmes en €/s sont limitées pour éviter les entrées erronées.
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Limites</h3>
        <Callout type="warn">
          <ul style={{ margin: 0 }}>
            <li>Données trimestrielles → les variations intra-trimestre sont interpolées.</li>
            <li>Certains pays peuvent n’avoir qu’un seul point récent → affichage stable jusqu’à la prochaine mise à jour.</li>
            <li>De légères différences d’arrondi par rapport aux sources nationales peuvent apparaître.</li>
          </ul>
        </Callout>
        <div className="tag" style={{ marginTop: 10 }}>
          Source : API statistiques d’Eurostat — jeu <em>gov_10q_ggdebt</em>.
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Transparence</h3>
        <p style={{ marginTop: 0 }}>
          Notre objectif : rendre des chiffres massifs lisibles d’un coup d’œil.
          Voir aussi <a href="/fr/debt">Qu’est-ce que la dette publique ?</a>,{" "}
          <a href="/fr/about">À propos</a> et{" "}
          <a href="/fr/privacy">Confidentialité & Cookies</a>.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Quelle est la source des données ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Eurostat gov_10q_ggdebt : administrations publiques (S.13), dette brute (GD), trimestriel (freq=Q), valeurs en millions d’euros (unit=MIO_EUR), UE-27.",
                },
              },
              {
                "@type": "Question",
                name: "Comment est calculé le compteur en direct ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Interpolation linéaire entre les deux derniers trimestres puis, après le dernier point, extrapolation avec un taux en €/s dérivé de leur différence.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
