// app/nl/methodology/page.jsx
import Link from "next/link";
import { countries } from "@/lib/data";
import { EUROSTAT_UPDATED_AT } from "@/lib/eurostat.debt.gen";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";
const METHOD_VERSION = "1.1";
const METHOD_REVIEWED = "april 2026";

export async function generateMetadata() {
  const base = new URL(SITE);
  const title = "Methodologie | Hoe EU Debt Map live staatsschuld berekent";
  const description =
    "Lees hoe EU Debt Map Eurostat-data gebruikt om live schattingen van overheidsschuld te tonen voor alle EU-27 landen, inclusief bronnen, filters, berekening, beperkingen en updates.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${SITE}/nl${PATH}`,
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
      url: `${SITE}/nl${PATH}`,
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
  if (!value) return "Niet beschikbaar";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Niet beschikbaar";

  return new Intl.DateTimeFormat("nl-NL", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function getLatestReferencePeriod() {
  const periods = (countries || [])
    .map((country) => country?.official_latest_time || country?.last_date)
    .filter(Boolean);

  if (periods.length === 0) return "Laatste Eurostat-data";

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
    ["Dataset", "gov_10q_ggdebt"],
    ["Frequentie", "Q, kwartaaldata"],
    ["Sector", "S13, algemene overheid"],
    ["Schulditem", "GD, bruto overheidsschuld"],
    ["Eenheid", "MIO_EUR, omgezet naar euro door × 1.000.000"],
    ["Landen", "Alleen EU-27 lidstaten"],
    ["Griekenland-code", "Eurostat gebruikt EL, EU Debt Map toont GR"],
    ["Terugblik", "lastTimePeriod=8, daarna selecteren we per land de laatste twee beschikbare kwartalen"],
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
    <div className="method-code" aria-label={title || "Codevoorbeeld"}>
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

export default function MethodologyPageNL() {
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
        name: "Welke databron gebruikt EU Debt Map?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EU Debt Map gebruikt Eurostat gov_10q_ggdebt, een kwartaalreeks voor bruto overheidsschuld. De waarden worden gefilterd op EU-27 lidstaten en omgerekend van miljoen euro naar euro.",
        },
      },
      {
        "@type": "Question",
        name: "Is de live schuldteller officiële realtime data?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nee. De onderliggende waarden komen uit officiële Eurostat-data, maar de live teller is een educatieve schatting op basis van de laatste twee beschikbare kwartaalwaarden.",
        },
      },
      {
        "@type": "Question",
        name: "Hoe wordt de schuld per seconde berekend?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Per land neemt EU Debt Map de laatste twee beschikbare kwartalen, berekent het verschil in schuld, deelt dit door het aantal seconden tussen de twee referentiedata en gebruikt dat tempo voor de live schatting.",
        },
      },
      {
        "@type": "Question",
        name: "Wanneer worden de cijfers bijgewerkt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "De site wordt bijgewerkt nadat nieuwe Eurostat-data tijdens het buildproces is opgehaald. Eurostat publiceert overheidsschuld per kwartaal, dus de officiële inputdata verandert niet elke seconde.",
        },
      },
    ],
  };

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Eurostat gov_10q_ggdebt EU-27 overheidsschulddata",
    description:
      "Kwartaaldata over bruto overheidsschuld die door EU Debt Map wordt gebruikt om live schattingen van overheidsschuld voor EU-27 landen te maken.",
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
        name: "Home",
        item: `${SITE}/nl`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Methodologie",
        item: `${SITE}/nl${PATH}`,
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
          <div className="method-kicker">Methodologie</div>

          <h1>Hoe EU Debt Map live staatsschuld schat</h1>

          <p className="method-lede">
            EU Debt Map begint met officiële kwartaaldata van Eurostat. De live tellers worden daarna
            geschat op basis van de meest recente schuldbeweging, zodat bezoekers de richting en
            omvang van overheidsschuld binnen de EU-27 beter kunnen begrijpen.
          </p>

          <Callout tone="warning" title="Belangrijk">
            <p>
              De live teller is een educatieve schatting. Het is geen officiële realtime statistiek.
              De officiële bron blijft Eurostat.
            </p>
          </Callout>

          <div className="method-hero-actions">
            <Link href="/nl" className="method-button method-button-primary">
              Open de live kaart
            </Link>
            <Link href="/nl/debt" className="method-button method-button-secondary">
              Lees de schulduitleg
            </Link>
          </div>
        </div>

        <aside className="method-hero-panel" aria-label="Samenvatting van de methode">
          <MiniStat label="Bron" value="Eurostat" note="Kwartaaldata over overheidsschuld" />
          <MiniStat label="Dekking" value="EU-27" note={`${validCountries.length} landen met bruikbare data`} />
          <MiniStat label="Laatste referentie" value={latestReferencePeriod} note="Meest recente periode in de gegenereerde data" />
          <MiniStat label="Data gegenereerd" value={dataGeneratedAt} note={`Methodeversie ${METHOD_VERSION}`} />
        </aside>
      </section>

      <Section
        eyebrow="Kort antwoord"
        title="Waar kijk je naar?"
        intro="Het getal op elke landenpagina is een live schatting op basis van officiële kwartaaldata. De teller beweegt omdat we de meest recente verandering omzetten naar een tempo per seconde."
      >
        <div className="method-steps">
          <StepCard number="1" title="Officiële data ophalen">
            We gebruiken de kwartaalreeks van Eurostat over overheidsschuld en halen de nieuwste
            beschikbare periodes op voor alle EU-27 landen.
          </StepCard>

          <StepCard number="2" title="Laatste trend selecteren">
            Per land bewaren we de laatste twee kwartalen met geldige waarden. Zo tonen we een recente
            schuldbeweging, geen lange termijn voorspelling.
          </StepCard>

          <StepCard number="3" title="Omrekenen naar euro">
            Eurostat publiceert deze reeks in miljoenen euro. EU Debt Map rekent dit om naar euro voor
            de grote live tellers.
          </StepCard>

          <StepCard number="4" title="Schatting per seconde">
            Het verschil tussen de laatste twee kwartalen wordt gedeeld door het aantal seconden tussen
            de twee referentiedata.
          </StepCard>
        </div>
      </Section>

      <Section
        eyebrow="Bron"
        title="Officiële databron"
        intro="EU Debt Map gebruikt Eurostat gov_10q_ggdebt: kwartaaldata over bruto overheidsschuld volgens de Maastricht-definitie."
      >
        <div className="method-link-row">
          <a
            className="method-button method-button-secondary"
            href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Eurostat dataset
          </a>

          <a
            className="method-button method-button-secondary"
            href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open API JSON
          </a>
        </div>

        <FilterTable />

        <Callout title="Waarom Eurostat?" tone="success">
          <p>
            Eurostat biedt een consistente en vergelijkbare databron voor EU-lidstaten. Dat is belangrijk,
            omdat nationale schulddata kan verschillen in timing, formaat, definitie en publicatieritme.
          </p>
        </Callout>
      </Section>

      <Section
        eyebrow="Berekening"
        title="Hoe de live schatting wordt berekend"
        intro="De berekening is bewust eenvoudig. Zo vermijden we verborgen economische aannames en blijft de methode controleerbaar."
      >
        <div className="method-formula-card">
          <div>
            <span className="method-formula-label">Tempo per seconde</span>
            <strong>(laatste schuld - vorige schuld) / seconden tussen referentiedata</strong>
          </div>
          <div>
            <span className="method-formula-label">Live schatting na laatste kwartaal</span>
            <strong>laatste schuld + tempo per seconde × seconden sinds laatste referentiedatum</strong>
          </div>
        </div>

        <div className="method-example">
          <h3>Simpel voorbeeld</h3>
          <p>
            Stel dat de schuld van een land tussen twee kwartaaldata met €7,8 miljard stijgt. Een
            kwartaal is grofweg 7,8 miljoen seconden. In dit vereenvoudigde voorbeeld beweegt de live
            schatting dan met ongeveer €1.000 per seconde.
          </p>
          <p>
            Is de verandering negatief, dan beweegt de teller omlaag. Zijn de laatste twee waarden gelijk,
            dan blijft de teller vlak.
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
        eyebrow="Bescherming"
        title="Hoe we misleidend tickergedrag voorkomen"
        intro="Live tellers kunnen heel precies lijken, maar de inputdata is kwartaaldata. Daarom gebruikt de site een paar conservatieve veiligheidsmaatregelen."
      >
        <div className="method-grid-two">
          <Callout title="Bescherming tegen uitschieters" tone="info">
            <p>
              De app begrenst extreme waarden per seconde om te voorkomen dat een foutieve waarde,
              datum of gegenereerd veld een onrealistische teller veroorzaakt.
            </p>
          </Callout>

          <Callout title="Ontbrekend vorig kwartaal" tone="info">
            <p>
              Als er maar één recente geldige waarde beschikbaar is, behandelen we de schatting als vlak
              totdat er meer data beschikbaar is.
            </p>
          </Callout>

          <Callout title="Kwartaal-einddatums" tone="info">
            <p>
              Kwartalen zoals 2025-Q3 worden omgezet naar kwartaal-einddatums, zodat het tempo per
              seconde over een consistente periode wordt berekend.
            </p>
          </Callout>

          <Callout title="Alleen EU-27" tone="info">
            <p>
              De site sluit bewust niet-EU-landen uit. Zo blijft de scope duidelijk en blijven landen beter
              vergelijkbaar.
            </p>
          </Callout>
        </div>
      </Section>

      <Section
        eyebrow="Beperkingen"
        title="Wat de live teller niet kan vertellen"
        intro="De site is bedoeld om publieke cijfers begrijpelijk te maken, niet voor officiële boekhouding, handel, voorspellingen of fiscaal beleid."
      >
        <div className="method-limits">
          <div>
            <h3>Geen officiële realtime schuld</h3>
            <p>
              Overheden publiceren via Eurostat geen volledig vergelijkbaar schuldgetal per seconde.
              De officiële data is kwartaaldata.
            </p>
          </div>

          <div>
            <h3>Lineaire aanname</h3>
            <p>
              Schuld verandert in werkelijkheid niet elke seconde vloeiend. De teller verdeelt de meest
              recente kwartaalbeweging gelijkmatig over de tijd.
            </p>
          </div>

          <div>
            <h3>Focus op bruto schuld</h3>
            <p>
              Bruto overheidsschuld is nuttig om te vergelijken, maar zegt niet alles over bezittingen,
              toekomstige verplichtingen, begrotingskwaliteit of economische kracht.
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Updates"
        title="Wanneer de cijfers veranderen"
        intro="De live beweging verandert wanneer nieuwe officiële Eurostat-data is opgehaald en de site opnieuw is gegenereerd."
      >
        <div className="method-update-box">
          <div>
            <strong>Databron verversen</strong>
            <span>
              Het buildscript vraagt Eurostat-data op met <code>lastTimePeriod=8</code> en selecteert
              daarna per land de laatste twee beschikbare kwartalen.
            </span>
          </div>

          <div>
            <strong>Gegenereerd databestand</strong>
            <span>
              Laatst gegenereerd: <b>{dataGeneratedAt}</b>
            </span>
          </div>

          <div>
            <strong>Methodeversie</strong>
            <span>
              Versie {METHOD_VERSION}, beoordeeld in {METHOD_REVIEWED}
            </span>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Voor technische bezoekers"
        title="Inputdata reproduceren"
        intro="De exacte waarden worden tijdens het buildproces omgezet. De publieke Eurostat API-call hieronder toont de brondata en filters."
      >
        <CodeBlock title="Voorbeeld Eurostat API-call">
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
          In productie vraagt EU Debt Map alle EU-27 landcodes op. Eurostat gebruikt <code>EL</code>{" "}
          voor Griekenland, terwijl de app Griekenland toont als <code>GR</code>.
        </p>
      </Section>

      <section className="method-related">
        <div className="method-related-head">
          <div>
            <div className="method-eyebrow">Volgende stap</div>
            <h2>Bekijk de cijfers achter de methode</h2>
          </div>
        </div>

        <div className="method-related-grid">
          <RelatedCard
            href="/nl"
            title="Live EU-schuldenkaart"
            text="Open de interactieve EU-27 kaart en vergelijk landen."
          />
          <RelatedCard
            href="/nl/debt"
            title="Wat is overheidsschuld?"
            text="Begrijp schuld, tekort, obligaties en fiscale druk."
          />
          <RelatedCard
            href="/nl/debt-to-gdp"
            title="Schuld ten opzichte van bbp"
            text="Vergelijk schuld met de omvang van de economie."
          />
          <RelatedCard
            href="/eu-debt"
            title="EU-schuldtrends"
            text="Bekijk de bredere EU-beweging en grafiekcontext."
          />
          <RelatedCard
            href="/nl/country/fr"
            title="Staatsschuld Frankrijk"
            text="Bekijk de live schatting en context voor Frankrijk."
          />
          <RelatedCard
            href="/nl/country/de"
            title="Staatsschuld Duitsland"
            text="Bekijk de live schatting en context voor Duitsland."
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