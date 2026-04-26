// app/fr/methodology/page.jsx
import Link from "next/link";
import { countries } from "@/lib/data";
import { EUROSTAT_UPDATED_AT } from "@/lib/eurostat.debt.gen";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";
const METHOD_VERSION = "1.1";
const METHOD_REVIEWED = "avril 2026";

export async function generateMetadata() {
  const base = new URL(SITE);
  const title = "Méthodologie | Comment EU Debt Map calcule la dette publique en direct";
  const description =
    "Découvrez comment EU Debt Map utilise les données Eurostat pour calculer des estimations en direct de la dette publique pour les 27 pays de l’UE, avec sources, filtres, calcul, limites et mises à jour.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${SITE}/fr${PATH}`,
      languages: {
        en: `${SITE}${PATH}`,
        nl: `${SITE}/nl${PATH}`,
        de: `${SITE}/de${PATH}`,
        fr: `${SITE}/fr${PATH}`,
        "x-default": `${SITE}${PATH}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE}/fr${PATH}`,
      siteName: "EU Debt Map",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  };
}

function formatDateTime(value) {
  if (!value) return "Non disponible";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Non disponible";

  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function getLatestReferencePeriod() {
  const periods = (countries || [])
    .map((country) => country?.official_latest_time || country?.last_date)
    .filter(Boolean);

  if (periods.length === 0) return "Dernières données Eurostat";

  return [...new Set(periods)].sort().at(-1);
}

function Section({ eyebrow, title, intro, children, id }) {
  return (
    <section id={id} className="method-card">
      {eyebrow ? <div className="method-eyebrow">{eyebrow}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {intro ? <p className="method-section-intro">{intro}</p> : null}
      {children}
    </section>
  );
}

function MiniStat({ label, value, note }) {
  return (
    <div className="method-stat">
      <div className="method-stat-label">{label}</div>
      <div className="method-stat-value">{value}</div>
      {note ? <div className="method-stat-note">{note}</div> : null}
    </div>
  );
}

function StepCard({ number, title, children }) {
  return (
    <div className="method-step">
      <div className="method-step-number">{number}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function Callout({ title, children, tone = "info" }) {
  return (
    <div className={`method-callout method-callout-${tone}`}>
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </div>
  );
}

function FilterTable() {
  const rows = [
    ["Jeu de données", "gov_10q_ggdebt"],
    ["Fréquence", "Q, données trimestrielles"],
    ["Secteur", "S13, administrations publiques"],
    ["Poste de dette", "GD, dette brute"],
    ["Unité", "MIO_EUR, converti en euros par × 1 000 000"],
    ["Pays", "Uniquement les 27 États membres de l’UE"],
    ["Code Grèce", "Eurostat utilise EL, EU Debt Map affiche GR"],
    ["Périodes utilisées", "lastTimePeriod=8, puis nous sélectionnons les deux derniers trimestres disponibles par pays"],
  ];

  return (
    <div className="method-table-wrap">
      <table className="method-table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ title, children }) {
  return (
    <div className="method-code" aria-label={title || "Exemple de code"}>
      {title ? <div className="method-code-title">{title}</div> : null}
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function RelatedCard({ href, title, text }) {
  return (
    <Link href={href} className="method-related-card">
      <strong>{title}</strong>
      <span>{text}</span>
    </Link>
  );
}

export default function MethodologyPageFR() {
  const validCountries = (countries || []).filter(
    (country) => country && country.last_value_eur > 0 && country.prev_value_eur > 0
  );

  const latestReferencePeriod = getLatestReferencePeriod();
  const dataGeneratedAt = formatDateTime(EUROSTAT_UPDATED_AT);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quelle source de données EU Debt Map utilise-t-il ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EU Debt Map utilise Eurostat gov_10q_ggdebt, une série trimestrielle sur la dette brute des administrations publiques. Les valeurs sont filtrées pour les 27 États membres de l’UE et converties de millions d’euros en euros.",
        },
      },
      {
        "@type": "Question",
        name: "Le compteur de dette en direct est-il une statistique officielle en temps réel ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Non. Les valeurs sous-jacentes proviennent des données officielles d’Eurostat, mais le compteur en direct est une estimation éducative basée sur les deux dernières valeurs trimestrielles disponibles.",
        },
      },
      {
        "@type": "Question",
        name: "Comment la dette par seconde est-elle calculée ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pour chaque pays, EU Debt Map prend les deux derniers trimestres disponibles, calcule la variation de dette, la divise par le nombre de secondes entre les deux dates de référence et utilise ce rythme pour l’estimation en direct.",
        },
      },
      {
        "@type": "Question",
        name: "Quand les chiffres sont-ils mis à jour ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le site est mis à jour après le chargement de nouvelles données Eurostat pendant le processus de génération. Eurostat publie la dette publique par trimestre, donc les données officielles d’entrée ne changent pas chaque seconde.",
        },
      },
    ],
  };

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Données Eurostat gov_10q_ggdebt sur la dette publique UE-27",
    description:
      "Données trimestrielles sur la dette brute des administrations publiques utilisées par EU Debt Map pour créer des estimations en direct de la dette publique des pays de l’UE-27.",
    creator: {
      "@type": "Organization",
      name: "Eurostat",
    },
    license: "https://ec.europa.eu/eurostat/about/policies/copyright",
    url: "https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT",
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl:
          "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN",
      },
    ],
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: `${SITE}/fr`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Méthodologie",
        item: `${SITE}/fr${PATH}`,
      },
    ],
  };

  return (
    <main className="method-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <section className="method-hero">
        <div className="method-hero-copy">
          <div className="method-kicker">Méthodologie</div>

          <h1>Comment EU Debt Map estime la dette publique en direct</h1>

          <p className="method-lede">
            EU Debt Map commence avec les données trimestrielles officielles d’Eurostat. Les compteurs
            en direct sont ensuite estimés à partir du mouvement de dette le plus récent, afin d’aider
            les visiteurs à comprendre la direction et l’ampleur de la dette publique dans l’UE-27.
          </p>

          <Callout tone="warning" title="Important">
            <p>
              Le compteur en direct est une estimation éducative. Ce n’est pas une statistique
              officielle en temps réel. La source officielle reste Eurostat.
            </p>
          </Callout>

          <div className="method-hero-actions">
            <Link href="/fr" className="method-button method-button-primary">
              Ouvrir la carte en direct
            </Link>
            <Link href="/fr/debt" className="method-button method-button-secondary">
              Lire l’explication sur la dette
            </Link>
          </div>
        </div>

        <aside className="method-hero-panel" aria-label="Résumé de la méthode">
          <MiniStat label="Source" value="Eurostat" note="Données trimestrielles sur la dette publique" />
          <MiniStat label="Couverture" value="UE-27" note={`${validCountries.length} pays avec des données utilisables`} />
          <MiniStat label="Dernière référence" value={latestReferencePeriod} note="Période la plus récente dans les données générées" />
          <MiniStat label="Données générées" value={dataGeneratedAt} note={`Version de méthode ${METHOD_VERSION}`} />
        </aside>
      </section>

      <Section
        eyebrow="Réponse courte"
        title="Que regardez-vous ?"
        intro="Le chiffre sur chaque page pays est une estimation en direct basée sur des données trimestrielles officielles. Le compteur bouge parce que nous convertissons la dernière variation en rythme par seconde."
      >
        <div className="method-steps">
          <StepCard number="1" title="Charger les données officielles">
            Nous utilisons la série trimestrielle d’Eurostat sur la dette publique et chargeons les
            périodes les plus récentes disponibles pour les 27 pays de l’UE.
          </StepCard>

          <StepCard number="2" title="Sélectionner la tendance récente">
            Pour chaque pays, nous gardons les deux derniers trimestres avec des valeurs valides. Cela
            montre un mouvement récent de dette, pas une prévision à long terme.
          </StepCard>

          <StepCard number="3" title="Convertir en euros">
            Eurostat publie cette série en millions d’euros. EU Debt Map la convertit en euros pour les
            grands compteurs en direct.
          </StepCard>

          <StepCard number="4" title="Estimer par seconde">
            La différence entre les deux derniers trimestres est divisée par le nombre de secondes entre
            les deux dates de référence.
          </StepCard>
        </div>
      </Section>

      <Section
        eyebrow="Source"
        title="Source officielle des données"
        intro="EU Debt Map utilise Eurostat gov_10q_ggdebt : données trimestrielles sur la dette brute des administrations publiques selon la définition de Maastricht."
      >
        <div className="method-link-row">
          <a
            className="method-button method-button-secondary"
            href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ouvrir le jeu de données Eurostat
          </a>

          <a
            className="method-button method-button-secondary"
            href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ouvrir l’API JSON
          </a>
        </div>

        <FilterTable />

        <Callout title="Pourquoi Eurostat ?" tone="success">
          <p>
            Eurostat offre une source de données cohérente et comparable pour les États membres de
            l’UE. C’est important, car les données nationales peuvent varier par date, format,
            définition et rythme de publication.
          </p>
        </Callout>
      </Section>

      <Section
        eyebrow="Calcul"
        title="Comment l’estimation en direct est calculée"
        intro="Le calcul est volontairement simple. Cela évite des hypothèses économiques cachées et rend la méthode vérifiable."
      >
        <div className="method-formula-card">
          <div>
            <span className="method-formula-label">Rythme par seconde</span>
            <strong>(dernière dette - dette précédente) / secondes entre les dates de référence</strong>
          </div>
          <div>
            <span className="method-formula-label">Estimation après le dernier trimestre</span>
            <strong>dernière dette + rythme par seconde × secondes depuis la dernière date de référence</strong>
          </div>
        </div>

        <div className="method-example">
          <h3>Exemple simple</h3>
          <p>
            Supposons que la dette d’un pays augmente de €7,8 milliards entre deux dates
            trimestrielles. Un trimestre représente environ 7,8 millions de secondes. Dans cet exemple
            simplifié, l’estimation en direct bouge d’environ €1.000 par seconde.
          </p>
          <p>
            Si la variation est négative, le compteur descend. Si les deux dernières valeurs sont
            identiques, le compteur reste stable.
          </p>
        </div>

        <CodeBlock title="Pseudocode">
{`previous_value_eur = debt value at previous quarter end
latest_value_eur   = debt value at latest quarter end

seconds_between_dates =
  latest_reference_timestamp - previous_reference_timestamp

rate_per_second =
  (latest_value_eur - previous_value_eur) / seconds_between_dates

if now <= latest_reference_timestamp:
  estimate =
    previous_value_eur +
    (latest_value_eur - previous_value_eur) *
    ((now - previous_reference_timestamp) / seconds_between_dates)

if now > latest_reference_timestamp:
  estimate =
    latest_value_eur +
    rate_per_second * (now - latest_reference_timestamp)`}
        </CodeBlock>
      </Section>

      <Section
        eyebrow="Protections"
        title="Comment nous évitons un comportement trompeur du compteur"
        intro="Les compteurs en direct peuvent paraître très précis, mais les données d’entrée sont trimestrielles. Le site utilise donc quelques protections prudentes."
      >
        <div className="method-grid-two">
          <Callout title="Protection contre les valeurs extrêmes" tone="info">
            <p>
              L’application limite les valeurs extrêmes par seconde pour éviter qu’une valeur, une date
              ou un champ généré incorrect ne crée un compteur irréaliste.
            </p>
          </Callout>

          <Callout title="Trimestre précédent manquant" tone="info">
            <p>
              Si une seule valeur récente valide est disponible, nous traitons l’estimation comme stable
              jusqu’à ce que davantage de données soient disponibles.
            </p>
          </Callout>

          <Callout title="Dates de fin de trimestre" tone="info">
            <p>
              Les trimestres comme 2025-Q3 sont convertis en dates de fin de trimestre afin que le
              rythme par seconde soit calculé sur une période cohérente.
            </p>
          </Callout>

          <Callout title="UE-27 uniquement" tone="info">
            <p>
              Le site exclut volontairement les pays hors UE. Cela garde le périmètre clair et rend les
              pays plus comparables.
            </p>
          </Callout>
        </div>
      </Section>

      <Section
        eyebrow="Limites"
        title="Ce que le compteur en direct ne peut pas dire"
        intro="Le site vise à rendre les chiffres publics compréhensibles. Il n’est pas destiné à la comptabilité officielle, au trading, aux prévisions ou aux décisions de politique budgétaire."
      >
        <div className="method-limits">
          <div>
            <h3>Pas une dette officielle en temps réel</h3>
            <p>
              Les gouvernements ne publient pas via Eurostat un chiffre de dette entièrement comparable
              par seconde. Les données officielles sont trimestrielles.
            </p>
          </div>

          <div>
            <h3>Hypothèse linéaire</h3>
            <p>
              En réalité, la dette ne change pas de manière fluide chaque seconde. Le compteur répartit
              le dernier mouvement trimestriel de façon égale dans le temps.
            </p>
          </div>

          <div>
            <h3>Accent sur la dette brute</h3>
            <p>
              La dette brute est utile pour comparer, mais elle ne dit pas tout sur les actifs, les
              obligations futures, la qualité budgétaire ou la force économique.
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Mises à jour"
        title="Quand les chiffres changent"
        intro="Le mouvement en direct change lorsque de nouvelles données officielles d’Eurostat sont chargées et que le site est régénéré."
      >
        <div className="method-update-box">
          <div>
            <strong>Rafraîchissement de la source</strong>
            <span>
              Le script de génération demande les données Eurostat avec <code>lastTimePeriod=8</code>,
              puis sélectionne les deux derniers trimestres disponibles pour chaque pays.
            </span>
          </div>

          <div>
            <strong>Fichier de données généré</strong>
            <span>
              Dernière génération : <b>{dataGeneratedAt}</b>
            </span>
          </div>

          <div>
            <strong>Version de méthode</strong>
            <span>
              Version {METHOD_VERSION}, revue en {METHOD_REVIEWED}
            </span>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Pour les visiteurs techniques"
        title="Reproduire les données d’entrée"
        intro="Les valeurs exactes sont transformées pendant le processus de génération. L’appel API public ci-dessous montre la source et les filtres."
      >
        <CodeBlock title="Exemple d’appel API Eurostat">
{`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt
  ?lang=EN
  &format=JSON
  &freq=Q
  &sector=S13
  &na_item=GD
  &unit=MIO_EUR
  &lastTimePeriod=8
  &geo=FR
  &geo=DE
  &geo=IT`}
        </CodeBlock>

        <p className="method-muted">
          En production, EU Debt Map charge tous les codes pays de l’UE-27. Eurostat utilise{" "}
          <code>EL</code> pour la Grèce, tandis que l’application affiche la Grèce avec <code>GR</code>.
        </p>
      </Section>

      <section className="method-related">
        <div className="method-related-head">
          <div>
            <div className="method-eyebrow">Étape suivante</div>
            <h2>Explorer les chiffres derrière la méthode</h2>
          </div>
        </div>

        <div className="method-related-grid">
          <RelatedCard
            href="/fr"
            title="Carte de la dette UE en direct"
            text="Ouvrez la carte interactive UE-27 et comparez les pays."
          />
          <RelatedCard
            href="/fr/debt"
            title="Qu’est-ce que la dette publique ?"
            text="Comprendre dette, déficit, obligations et pression budgétaire."
          />
          <RelatedCard
            href="/fr/debt-to-gdp"
            title="Dette par rapport au PIB"
            text="Comparer la dette à la taille de l’économie."
          />
          <RelatedCard
            href="/eu-debt"
            title="Tendances de la dette UE"
            text="Voir le mouvement plus large de l’UE et le contexte graphique."
          />
          <RelatedCard
            href="/fr/country/fr"
            title="Dette publique France"
            text="Voir l’estimation en direct et le contexte pour la France."
          />
          <RelatedCard
            href="/fr/country/de"
            title="Dette publique Allemagne"
            text="Voir l’estimation en direct et le contexte pour l’Allemagne."
          />
        </div>
      </section>

      <style>{`
        .method-page {
          width: min(calc(100% - 48px), 1500px);
          max-width: 1500px;
          margin: 0 auto;
          padding: 28px 0 56px;
          display: grid;
          gap: 18px;
          align-items: start;
        }

        .site-header .container,
        .site-header .header-inner {
          max-width: 1500px !important;
        }

        .method-hero,
        .method-card,
        .method-related {
          background: #ffffff;
          border: 1px solid rgba(203, 213, 225, 0.8);
          border-radius: 18px;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.06);
        }

        .method-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
          gap: clamp(24px, 3vw, 46px);
          padding: clamp(28px, 3vw, 44px);
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 36%),
            linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
        }

        .method-kicker,
        .method-eyebrow {
          color: #1d4ed8;
          font-size: 0.78rem;
          line-height: 1;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .method-hero h1 {
          max-width: 900px;
          margin: 12px 0 0;
          color: #0f172a;
          font-family: var(--font-display);
          font-size: clamp(2.45rem, 4.8vw, 5rem);
          line-height: 0.95;
          letter-spacing: -0.065em;
        }

        .method-lede {
          max-width: 780px;
          margin: 18px 0 0;
          color: #334b6b;
          font-size: clamp(1.03rem, 0.7vw + 0.9rem, 1.2rem);
          line-height: 1.62;
        }

        .method-hero-actions,
        .method-link-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 18px;
        }

        .method-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 850;
          font-size: 0.92rem;
          transition:
            transform 0.12s ease,
            box-shadow 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease;
        }

        .method-button:hover {
          transform: translateY(-1px);
          text-decoration: none;
        }

        .method-button-primary {
          color: #ffffff;
          background: linear-gradient(180deg, #1764e8, #0f55d4);
          border: 1px solid #0f55d4;
          box-shadow: 0 14px 26px rgba(37, 99, 235, 0.22);
        }

        .method-button-secondary {
          color: #101827;
          background: #ffffff;
          border: 1px solid #d8e1ec;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
        }

        .method-hero-panel {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          align-self: start;
        }

        .method-stat {
          min-width: 0;
          padding: 16px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #dbe5f0;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);
        }

        .method-stat-label {
          color: #64748b;
          font-size: 0.74rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .method-stat-value {
          margin-top: 9px;
          color: #0f172a;
          font-size: clamp(1.25rem, 1.8vw, 1.75rem);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.04em;
          overflow-wrap: anywhere;
        }

        .method-stat-note {
          margin-top: 8px;
          color: #52647b;
          font-size: 0.8rem;
          line-height: 1.35;
        }

        .method-card,
        .method-related {
          padding: 24px;
          display: grid;
          gap: 16px;
        }

        .method-card h2,
        .method-related h2 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(1.45rem, 1.5vw, 2rem);
          line-height: 1.08;
          letter-spacing: -0.035em;
        }

        .method-section-intro {
          max-width: 880px;
          margin: -4px 0 0;
          color: #52647b;
          font-size: 0.98rem;
          line-height: 1.65;
        }

        .method-steps {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .method-step {
          min-width: 0;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #dbe5f0;
          background: #f8fbff;
        }

        .method-step-number {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          color: #ffffff;
          background: #1d4ed8;
          font-weight: 900;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .method-step h3,
        .method-example h3,
        .method-limits h3 {
          margin: 0;
          color: #0f172a;
          font-size: 1rem;
          letter-spacing: -0.02em;
        }

        .method-step p,
        .method-example p,
        .method-limits p,
        .method-callout p {
          margin: 7px 0 0;
          color: #52647b;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .method-callout {
          padding: 14px 15px;
          border-radius: 14px;
          border: 1px solid #dbe5f0;
          background: #f8fafc;
        }

        .method-callout strong {
          display: block;
          margin-bottom: 4px;
          color: #0f172a;
          font-size: 0.88rem;
        }

        .method-callout-warning {
          margin-top: 18px;
          border-color: #fed7aa;
          background: #fff7ed;
        }

        .method-callout-warning strong,
        .method-callout-warning p {
          color: #7c2d12;
        }

        .method-callout-success {
          border-color: #bbf7d0;
          background: #ecfdf5;
        }

        .method-callout-success strong,
        .method-callout-success p {
          color: #064e3b;
        }

        .method-table-wrap {
          width: 100%;
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid #dbe5f0;
        }

        .method-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 680px;
          background: #ffffff;
        }

        .method-table th,
        .method-table td {
          padding: 13px 14px;
          border-bottom: 1px solid #edf2f7;
          text-align: left;
          vertical-align: top;
          font-size: 0.9rem;
          line-height: 1.45;
        }

        .method-table tr:last-child th,
        .method-table tr:last-child td {
          border-bottom: 0;
        }

        .method-table th {
          width: 190px;
          color: #0f172a;
          background: #f8fafc;
          font-weight: 850;
        }

        .method-table td {
          color: #52647b;
        }

        .method-formula-card {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .method-formula-card > div {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #bfdbfe;
          background: #eff6ff;
        }

        .method-formula-label {
          display: block;
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .method-formula-card strong {
          display: block;
          color: #0f172a;
          font-size: 1rem;
          line-height: 1.45;
        }

        .method-example {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .method-code {
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid #1f2b3a;
          background: #0b1220;
        }

        .method-code-title {
          padding: 12px 14px;
          border-bottom: 1px solid #1f2b3a;
          color: #93c5fd;
          font-size: 0.78rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .method-code pre {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          white-space: pre;
        }

        .method-code code {
          color: #dbeafe;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            "Liberation Mono",
            "Courier New",
            monospace;
          font-size: 0.86rem;
          line-height: 1.62;
        }

        .method-grid-two {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .method-limits {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .method-limits > div {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #fecaca;
          background: #fff7f7;
        }

        .method-limits p {
          color: #7f1d1d;
        }

        .method-update-box {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .method-update-box > div {
          display: grid;
          gap: 7px;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #dbe5f0;
          background: #f8fafc;
        }

        .method-update-box strong {
          color: #0f172a;
          font-size: 0.92rem;
        }

        .method-update-box span {
          color: #52647b;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .method-muted {
          margin: 0;
          color: #64748b;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .method-muted code,
        .method-update-box code {
          padding: 2px 5px;
          border-radius: 6px;
          background: #eef2ff;
          color: #1d4ed8;
          font-size: 0.82em;
        }

        .method-related-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .method-related-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .method-related-card {
          display: grid;
          gap: 7px;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
          color: inherit;
          text-decoration: none;
          transition:
            transform 0.12s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .method-related-card:hover {
          transform: translateY(-2px);
          border-color: #bfdbfe;
          box-shadow: 0 18px 34px rgba(37, 99, 235, 0.1);
          text-decoration: none;
        }

        .method-related-card strong {
          color: #0f172a;
          font-size: 0.95rem;
        }

        .method-related-card span {
          color: #52647b;
          font-size: 0.86rem;
          line-height: 1.45;
        }

        @media (max-width: 1180px) {
          .method-hero {
            grid-template-columns: 1fr;
          }

          .method-hero-panel {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .method-steps {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .method-related-grid,
          .method-limits,
          .method-update-box {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .method-page {
            width: min(calc(100% - 28px), 1500px);
            padding: 18px 0 42px;
            gap: 14px;
          }

          .method-hero,
          .method-card,
          .method-related {
            padding: 18px;
            border-radius: 16px;
          }

          .method-hero h1 {
            font-size: clamp(2.45rem, 12vw, 4rem);
          }

          .method-hero-panel,
          .method-steps,
          .method-formula-card,
          .method-grid-two,
          .method-related-grid,
          .method-limits,
          .method-update-box {
            grid-template-columns: 1fr;
          }

          .method-hero-actions,
          .method-link-row {
            flex-direction: column;
            align-items: stretch;
          }

          .method-button {
            width: 100%;
          }

          .method-table {
            min-width: 620px;
          }

          .method-code pre {
            white-space: pre-wrap;
          }
        }

        @media (max-width: 560px) {
          .method-hero,
          .method-card,
          .method-related {
            padding: 16px;
          }

          .method-hero h1 {
            letter-spacing: -0.06em;
          }

          .method-stat,
          .method-step,
          .method-example,
          .method-limits > div,
          .method-update-box > div,
          .method-related-card {
            padding: 14px;
          }
        }
      `}</style>
    </main>
  );
}