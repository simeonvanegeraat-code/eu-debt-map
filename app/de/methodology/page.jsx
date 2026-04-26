// app/de/methodology/page.jsx
import Link from "next/link";
import { countries } from "@/lib/data";
import { EUROSTAT_UPDATED_AT } from "@/lib/eurostat.debt.gen";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";
const METHOD_VERSION = "1.1";
const METHOD_REVIEWED = "April 2026";

export async function generateMetadata() {
  const base = new URL(SITE);
  const title = "Methodik | Wie EU Debt Map Live-Staatsschulden berechnet";
  const description =
    "Erfahren Sie, wie EU Debt Map Eurostat-Daten nutzt, um Live-Schätzungen der Staatsschulden für alle EU-27 Länder zu berechnen, einschließlich Quellen, Filtern, Berechnung, Grenzen und Updates.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${SITE}/de${PATH}`,
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
      url: `${SITE}/de${PATH}`,
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
  if (!value) return "Nicht verfügbar";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Nicht verfügbar";

  return new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function getLatestReferencePeriod() {
  const periods = (countries || [])
    .map((country) => country?.official_latest_time || country?.last_date)
    .filter(Boolean);

  if (periods.length === 0) return "Neueste Eurostat-Daten";

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
    ["Datensatz", "gov_10q_ggdebt"],
    ["Frequenz", "Q, Quartalsdaten"],
    ["Sektor", "S13, allgemeiner Staat"],
    ["Schuldenposition", "GD, Bruttoschulden"],
    ["Einheit", "MIO_EUR, umgerechnet in Euro durch × 1.000.000"],
    ["Länder", "Nur EU-27 Mitgliedstaaten"],
    ["Griechenland-Code", "Eurostat verwendet EL, EU Debt Map zeigt GR"],
    ["Rückblick", "lastTimePeriod=8, danach wählen wir pro Land die letzten zwei verfügbaren Quartale"],
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
    <div className="method-code" aria-label={title || "Codebeispiel"}>
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

export default function MethodologyPageDE() {
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
        name: "Welche Datenquelle verwendet EU Debt Map?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EU Debt Map verwendet Eurostat gov_10q_ggdebt, eine Quartalsreihe für Bruttoschulden des Staates. Die Werte werden auf EU-27 Mitgliedstaaten gefiltert und von Millionen Euro in Euro umgerechnet.",
        },
      },
      {
        "@type": "Question",
        name: "Ist der Live-Schuldenticker eine offizielle Echtzeitstatistik?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nein. Die zugrunde liegenden Werte stammen aus offiziellen Eurostat-Daten, aber der Live-Ticker ist eine pädagogische Schätzung auf Basis der letzten zwei verfügbaren Quartalswerte.",
        },
      },
      {
        "@type": "Question",
        name: "Wie wird die Verschuldung pro Sekunde berechnet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Für jedes Land nimmt EU Debt Map die letzten zwei verfügbaren Quartale, berechnet die Veränderung der Schulden, teilt diese durch die Sekunden zwischen den zwei Referenzdaten und nutzt diese Rate für die Live-Schätzung.",
        },
      },
      {
        "@type": "Question",
        name: "Wann werden die Zahlen aktualisiert?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Die Website wird aktualisiert, nachdem neue Eurostat-Daten im Buildprozess geladen wurden. Eurostat veröffentlicht Staatsschulden quartalsweise, daher ändern sich die offiziellen Eingabedaten nicht jede Sekunde.",
        },
      },
    ],
  };

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Eurostat gov_10q_ggdebt EU-27 Staatsschuldendaten",
    description:
      "Quartalsdaten zu Bruttoschulden des Staates, die EU Debt Map nutzt, um Live-Schätzungen der Staatsschulden für EU-27 Länder zu erstellen.",
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
        name: "Startseite",
        item: `${SITE}/de`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Methodik",
        item: `${SITE}/de${PATH}`,
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
          <div className="method-kicker">Methodik</div>

          <h1>Wie EU Debt Map Live-Staatsschulden schätzt</h1>

          <p className="method-lede">
            EU Debt Map beginnt mit offiziellen Quartalsdaten von Eurostat. Die Live-Ticker werden
            anschließend aus der jüngsten Schuldenbewegung geschätzt, damit Besucher Richtung und
            Größenordnung der Staatsschulden in der EU-27 besser verstehen können.
          </p>

          <Callout tone="warning" title="Wichtig">
            <p>
              Der Live-Ticker ist eine pädagogische Schätzung. Er ist keine offizielle
              Echtzeitstatistik. Die offizielle Quelle bleibt Eurostat.
            </p>
          </Callout>

          <div className="method-hero-actions">
            <Link href="/de" className="method-button method-button-primary">
              Live-Karte öffnen
            </Link>
            <Link href="/de/debt" className="method-button method-button-secondary">
              Schuldenerklärung lesen
            </Link>
          </div>
        </div>

        <aside className="method-hero-panel" aria-label="Zusammenfassung der Methode">
          <MiniStat label="Quelle" value="Eurostat" note="Quartalsdaten zu Staatsschulden" />
          <MiniStat label="Abdeckung" value="EU-27" note={`${validCountries.length} Länder mit nutzbaren Daten`} />
          <MiniStat label="Letzte Referenz" value={latestReferencePeriod} note="Neueste Periode in den generierten Daten" />
          <MiniStat label="Daten generiert" value={dataGeneratedAt} note={`Methodenversion ${METHOD_VERSION}`} />
        </aside>
      </section>

      <Section
        eyebrow="Kurz erklärt"
        title="Was sehen Sie hier?"
        intro="Die Zahl auf jeder Länderseite ist eine Live-Schätzung auf Basis offizieller Quartalsdaten. Der Ticker bewegt sich, weil wir die jüngste Veränderung in eine Rate pro Sekunde umrechnen."
      >
        <div className="method-steps">
          <StepCard number="1" title="Offizielle Daten laden">
            Wir verwenden die Eurostat-Quartalsreihe zu Staatsschulden und laden die neuesten
            verfügbaren Perioden für alle EU-27 Länder.
          </StepCard>

          <StepCard number="2" title="Jüngsten Trend wählen">
            Pro Land speichern wir die letzten zwei Quartale mit gültigen Werten. Dadurch zeigen wir
            eine aktuelle Schuldenbewegung, keine langfristige Prognose.
          </StepCard>

          <StepCard number="3" title="In Euro umrechnen">
            Eurostat veröffentlicht diese Reihe in Millionen Euro. EU Debt Map rechnet sie für die
            großen Live-Zähler in Euro um.
          </StepCard>

          <StepCard number="4" title="Schätzung pro Sekunde">
            Die Differenz zwischen den letzten zwei Quartalen wird durch die Anzahl der Sekunden
            zwischen den zwei Referenzdaten geteilt.
          </StepCard>
        </div>
      </Section>

      <Section
        eyebrow="Quelle"
        title="Offizielle Datenquelle"
        intro="EU Debt Map verwendet Eurostat gov_10q_ggdebt: Quartalsdaten zu Bruttoschulden des Staates nach der Maastricht-Definition."
      >
        <div className="method-link-row">
          <a
            className="method-button method-button-secondary"
            href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eurostat-Datensatz öffnen
          </a>

          <a
            className="method-button method-button-secondary"
            href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN"
            target="_blank"
            rel="noopener noreferrer"
          >
            API JSON öffnen
          </a>
        </div>

        <FilterTable />

        <Callout title="Warum Eurostat?" tone="success">
          <p>
            Eurostat bietet eine konsistente und vergleichbare Datenquelle für EU-Mitgliedstaaten.
            Das ist wichtig, weil nationale Schuldendaten in Timing, Format, Definition und
            Veröffentlichungsrhythmus abweichen können.
          </p>
        </Callout>
      </Section>

      <Section
        eyebrow="Berechnung"
        title="Wie die Live-Schätzung berechnet wird"
        intro="Die Berechnung ist bewusst einfach. So vermeiden wir versteckte wirtschaftliche Annahmen und halten die Methode überprüfbar."
      >
        <div className="method-formula-card">
          <div>
            <span className="method-formula-label">Rate pro Sekunde</span>
            <strong>(letzte Schulden - vorherige Schulden) / Sekunden zwischen Referenzdaten</strong>
          </div>
          <div>
            <span className="method-formula-label">Live-Schätzung nach letztem Quartal</span>
            <strong>letzte Schulden + Rate pro Sekunde × Sekunden seit letztem Referenzdatum</strong>
          </div>
        </div>

        <div className="method-example">
          <h3>Ein einfaches Beispiel</h3>
          <p>
            Angenommen, die Schulden eines Landes steigen zwischen zwei Quartalsdaten um €7,8
            Milliarden. Ein Quartal hat grob 7,8 Millionen Sekunden. In diesem vereinfachten Beispiel
            bewegt sich die Live-Schätzung um etwa €1.000 pro Sekunde.
          </p>
          <p>
            Ist die Veränderung negativ, bewegt sich der Ticker nach unten. Sind die letzten zwei Werte
            gleich, bleibt der Ticker stabil.
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
        eyebrow="Schutzmechanismen"
        title="Wie wir irreführendes Tickerverhalten vermeiden"
        intro="Live-Ticker können sehr präzise wirken, aber die Eingabedaten sind Quartalsdaten. Deshalb nutzt die Website einige konservative Schutzmaßnahmen."
      >
        <div className="method-grid-two">
          <Callout title="Schutz vor Ausreißern" tone="info">
            <p>
              Die App begrenzt extreme Werte pro Sekunde, damit ein fehlerhafter Wert, ein Datum oder
              ein generiertes Feld keinen unrealistischen Ticker verursacht.
            </p>
          </Callout>

          <Callout title="Fehlendes Vorquartal" tone="info">
            <p>
              Wenn nur ein aktueller gültiger Wert vorhanden ist, behandeln wir die Schätzung als
              stabil, bis mehr Daten verfügbar sind.
            </p>
          </Callout>

          <Callout title="Quartalsenddaten" tone="info">
            <p>
              Quartale wie 2025-Q3 werden in Quartalsenddaten umgewandelt, damit die Rate pro Sekunde
              über einen konsistenten Zeitraum berechnet wird.
            </p>
          </Callout>

          <Callout title="Nur EU-27" tone="info">
            <p>
              Die Website schließt Nicht-EU-Länder bewusst aus. So bleibt der Umfang klar und die
              Länder bleiben besser vergleichbar.
            </p>
          </Callout>
        </div>
      </Section>

      <Section
        eyebrow="Grenzen"
        title="Was der Live-Ticker nicht sagen kann"
        intro="Die Website soll öffentliche Zahlen verständlich machen. Sie ist nicht für offizielle Buchhaltung, Handel, Prognosen oder Fiskalpolitik gedacht."
      >
        <div className="method-limits">
          <div>
            <h3>Keine offizielle Echtzeitverschuldung</h3>
            <p>
              Staaten veröffentlichen über Eurostat keine vollständig vergleichbare Schuldenzahl pro
              Sekunde. Die offiziellen Daten sind Quartalsdaten.
            </p>
          </div>

          <div>
            <h3>Lineare Annahme</h3>
            <p>
              Schulden verändern sich in Wirklichkeit nicht jede Sekunde gleichmäßig. Der Ticker verteilt
              die jüngste Quartalsbewegung gleichmäßig über die Zeit.
            </p>
          </div>

          <div>
            <h3>Fokus auf Bruttoschulden</h3>
            <p>
              Bruttoschulden sind nützlich für Vergleiche, sagen aber nicht alles über Vermögen,
              zukünftige Verpflichtungen, Haushaltsqualität oder wirtschaftliche Stärke.
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Updates"
        title="Wann sich die Zahlen ändern"
        intro="Die Live-Bewegung ändert sich, wenn neue offizielle Eurostat-Daten geladen und die Website neu generiert wurde."
      >
        <div className="method-update-box">
          <div>
            <strong>Datenquelle aktualisieren</strong>
            <span>
              Das Build-Skript lädt Eurostat-Daten mit <code>lastTimePeriod=8</code> und wählt danach
              pro Land die letzten zwei verfügbaren Quartale.
            </span>
          </div>

          <div>
            <strong>Generierte Datendatei</strong>
            <span>
              Zuletzt generiert: <b>{dataGeneratedAt}</b>
            </span>
          </div>

          <div>
            <strong>Methodenversion</strong>
            <span>
              Version {METHOD_VERSION}, geprüft im {METHOD_REVIEWED}
            </span>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Für technische Besucher"
        title="Eingabedaten reproduzieren"
        intro="Die exakten Werte werden während des Buildprozesses umgewandelt. Der öffentliche Eurostat API-Aufruf unten zeigt Quelldaten und Filter."
      >
        <CodeBlock title="Beispiel Eurostat API-Aufruf">
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
          In Produktion lädt EU Debt Map alle EU-27 Ländercodes. Eurostat verwendet <code>EL</code>{" "}
          für Griechenland, während die App Griechenland als <code>GR</code> anzeigt.
        </p>
      </Section>

      <section className="method-related">
        <div className="method-related-head">
          <div>
            <div className="method-eyebrow">Nächster Schritt</div>
            <h2>Entdecken Sie die Zahlen hinter der Methode</h2>
          </div>
        </div>

        <div className="method-related-grid">
          <RelatedCard
            href="/de"
            title="Live EU-Schuldenkarte"
            text="Öffnen Sie die interaktive EU-27 Karte und vergleichen Sie Länder."
          />
          <RelatedCard
            href="/de/debt"
            title="Was sind Staatsschulden?"
            text="Verstehen Sie Schulden, Defizite, Anleihen und fiskalischen Druck."
          />
          <RelatedCard
            href="/de/debt-to-gdp"
            title="Schulden im Verhältnis zum BIP"
            text="Vergleichen Sie Schulden mit der Größe der Wirtschaft."
          />
          <RelatedCard
            href="/eu-debt"
            title="EU-Schuldentrends"
            text="Sehen Sie die breitere EU-Bewegung und den Chart-Kontext."
          />
          <RelatedCard
            href="/de/country/fr"
            title="Staatsschulden Frankreich"
            text="Sehen Sie die Live-Schätzung und den Kontext für Frankreich."
          />
          <RelatedCard
            href="/de/country/de"
            title="Staatsschulden Deutschland"
            text="Sehen Sie die Live-Schätzung und den Kontext für Deutschland."
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