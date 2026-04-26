import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import { listArticles } from "@/lib/articles";
import { countries, trendFor, livePerSecondFor } from "@/lib/data";

const EuropeMap = dynamic(() => import("@/components/EuropeMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: 420, display: "grid", placeItems: "center" }}
      className="card"
      aria-busy="true"
    >
      Loading map…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), {
  ssr: false,
});

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const title = "EU Debt Map | Live Government Debt by Country (EU-27, 2025)";
  const description =
    "Track EU government debt live, country by country. Interactive EU-27 debt map with live estimates, debt growth, and country comparisons based on Eurostat data.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: "https://www.eudebtmap.com/",
      languages: {
        en: "https://www.eudebtmap.com/",
        nl: "https://www.eudebtmap.com/nl",
        de: "https://www.eudebtmap.com/de",
        fr: "https://www.eudebtmap.com/fr",
        "x-default": "https://www.eudebtmap.com/",
      },
    },
    openGraph: {
      title,
      description,
      url: "https://www.eudebtmap.com/",
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function countryHref(country) {
  return country?.code ? `/country/${country.code.toLowerCase()}` : "/";
}

function formatShortEuro(value) {
  if (!Number.isFinite(value)) return "€0";

  const abs = Math.abs(value);

  if (abs >= 1_000_000_000_000) {
    return `€${(value / 1_000_000_000_000).toFixed(2)}tn`;
  }

  if (abs >= 1_000_000_000) {
    return `€${(value / 1_000_000_000).toFixed(2)}bn`;
  }

  if (abs >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(1)}m`;
  }

  return `€${Math.round(value).toLocaleString("en-GB")}`;
}

function formatPerSecond(value) {
  if (!Number.isFinite(value)) return "€0/s";

  const sign = value >= 0 ? "+" : "−";
  const abs = Math.abs(value);

  return `${sign}€${Math.round(abs).toLocaleString("en-GB")}/s`;
}

function MetricLinkCard({ label, country, description, tone = "blue" }) {
  if (!country) {
    return <div className="eu-home-mini-card">No data available.</div>;
  }

  const perSecond = livePerSecondFor(country);
  const isRising = perSecond >= 0;

  return (
    <Link
      href={countryHref(country)}
      className="eu-home-mini-link"
      aria-label={`${label}: ${country.name}`}
    >
      <div className={`eu-home-mini-card eu-home-mini-card-${tone}`}>
        <div className="eu-home-mini-topline">
          <span className="eu-home-mini-label">{label}</span>
          <span className="eu-home-mini-arrow" aria-hidden>
            →
          </span>
        </div>

        <div className="eu-home-mini-country">
          <span aria-hidden>{country.flag}</span>
          <strong>{country.name}</strong>
        </div>

        <div className="eu-home-mini-value">{formatShortEuro(country.last_value_eur)}</div>

        <div className={isRising ? "eu-home-mini-trend is-rising" : "eu-home-mini-trend is-falling"}>
          {isRising ? "↑" : "↓"} {formatPerSecond(perSecond)} · live estimate
        </div>

        <p>{description}</p>
      </div>
    </Link>
  );
}

function SnapshotStat({ label, value, note, tone = "neutral" }) {
  return (
    <div className={`eu-home-snapshot-stat eu-home-snapshot-${tone}`}>
      <div className="eu-home-snapshot-label">{label}</div>
      <div className="eu-home-snapshot-value">{value}</div>
      <div className="eu-home-snapshot-note">{note}</div>
    </div>
  );
}

function InsightItem({ icon, title, children }) {
  return (
    <div className="eu-home-insight-item">
      <div className="eu-home-insight-icon" aria-hidden>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default function HomePage() {
  const valid = countries.filter((c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0);

  const largestDebt =
    valid.length > 0 ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b)) : null;

  const withDelta = valid.map((c) => ({
    ...c,
    delta: c.last_value_eur - c.prev_value_eur,
  }));

  const fastestGrowing =
    withDelta.length > 0 ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b)) : null;

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    trend: trendFor(c),
  }));

  const fallingCount = valid.filter((c) => trendFor(c) < 0).length;
  const risingCount = valid.filter((c) => trendFor(c) > 0).length;
  const flatCount = valid.filter((c) => trendFor(c) === 0).length;

  const totalPerSecond = valid.reduce((sum, c) => sum + livePerSecondFor(c), 0);
  const latestPeriod =
    valid.find((c) => c.official_latest_time)?.official_latest_time ||
    valid.find((c) => c.last_date)?.last_date ||
    "latest Eurostat data";

  const topArticles = listArticles({ lang: "en" }).slice(0, 3);

  return (
    <main className="eu-home-v2">
      <section className="eu-home-hero">
        <div className="eu-home-hero-copy">
          <h1 className="eu-home-title">
            <span>Live EU</span>
            <span>Government</span>
            <span>Debt Map</span>
          </h1>

          <p className="eu-home-lede">
            <strong>
              Add together the public debt of all 27 EU countries and you get the figure below: a
              live estimate that keeps moving every second.
            </strong>
          </p>

          <p className="eu-home-copy">
            EU Debt Map turns Eurostat debt data into a simple way to explore government debt
            across the European Union. Use the interactive map to compare countries such as France,
            Germany, Italy, Spain, and the Netherlands. Then open any country page for a live debt
            ticker, recent trend, and debt-to-GDP context.
          </p>

          <div className="eu-home-meta" aria-label="Key facts">
            <span>🇪🇺 EU-27 coverage</span>
            <span>🧾 Based on Eurostat data</span>
            <span>📈 Live estimated ticker</span>
          </div>

          <div className="eu-home-actions">
            <Link href="/eu-debt" className="eu-home-btn eu-home-btn-primary">
              View EU debt trends →
            </Link>
            <Link href="/debt" className="eu-home-btn eu-home-btn-secondary">
              Read the debt explainer →
            </Link>
          </div>

          <p className="eu-home-source">
            Source: Eurostat. Live values are estimated from the latest quarterly data and are shown
            for educational purposes, not as official real-time statistics.
          </p>
        </div>

        <div className="eu-home-hero-dashboard">
          <div className="eu-home-total-shell">
            <EUTotalTicker />
          </div>

          <div className="eu-home-hero-stats">
            <MetricLinkCard
              label="Largest debt"
              country={largestDebt}
              description="Open the country page for the largest debt stock in the EU."
              tone="blue"
            />

            <MetricLinkCard
              label="Fastest growing"
              country={fastestGrowing}
              description="Open the country page with the strongest recent absolute increase."
              tone="green"
            />
          </div>
        </div>
      </section>

      <section className="eu-home-main-grid">
        <section className="eu-home-card eu-home-map-card">
          <div className="eu-home-card-header eu-home-map-header">
            <div>
              <h2>EU overview</h2>
              <p>
                The map shows whether government debt has risen or fallen between the latest two
                reference points. Open any country to see its live debt estimate, recent movement,
                and country context.
              </p>
            </div>

            <div className="eu-home-map-pills" aria-label="Map legend">
              <span className="eu-home-pill eu-home-pill-green">Falling debt</span>
              <span className="eu-home-pill eu-home-pill-red">Rising debt</span>
              <span className="eu-home-pill">
                {fallingCount} falling · {risingCount} rising
              </span>
            </div>
          </div>

          <div className="eu-home-map-shell" role="region" aria-label="Interactive EU map">
            <EuropeMap />
          </div>

          <div className="eu-home-map-actions">
            <div className="eu-home-map-action eu-home-map-action-main">
              <span aria-hidden>➜</span>
              <strong>Click any country on the map to open its live debt ticker.</strong>
            </div>

            <Link href="/eu-debt" className="eu-home-map-action">
              <span aria-hidden>⌁</span>
              <strong>5-year EU debt chart</strong>
            </Link>

            <Link href="/debt" className="eu-home-map-action">
              <span aria-hidden>▣</span>
              <strong>What government debt means</strong>
            </Link>
          </div>
        </section>

        <aside className="eu-home-side-stack">
          <section className="eu-home-card eu-home-side-card">
            <div className="eu-home-card-header">
              <div>
                <h2>EU debt snapshot</h2>
                <p>
                  A quick reading of the latest movement across the EU-27. This avoids repeating the
                  same largest-debt cards from the hero.
                </p>
              </div>
            </div>

            <div className="eu-home-snapshot-grid">
              <SnapshotStat
                label="Countries rising"
                value={risingCount}
                note="Debt increased between the latest two reference points."
                tone="red"
              />

              <SnapshotStat
                label="Countries falling"
                value={fallingCount}
                note="Debt decreased between the latest two reference points."
                tone="green"
              />

              <SnapshotStat
                label="EU movement"
                value={formatPerSecond(totalPerSecond)}
                note="Estimated combined movement per second."
                tone={totalPerSecond >= 0 ? "red" : "green"}
              />
            </div>

            <div className="eu-home-period-box">
              <span>Latest reference period</span>
              <strong>{latestPeriod}</strong>
              {flatCount > 0 && <small>{flatCount} countries are currently flat in this dataset.</small>}
            </div>
          </section>

          <section className="eu-home-card eu-home-side-card">
            <div className="eu-home-card-header">
              <div>
                <h2>Why EU government debt matters</h2>
              </div>
            </div>

            <div className="eu-home-insights">
              <InsightItem icon="%" title="Borrowing costs">
                Higher debt can make countries more exposed when interest rates rise.
              </InsightItem>

              <InsightItem icon="🏛" title="Fiscal flexibility">
                Debt levels shape how much room governments have for spending and crisis response.
              </InsightItem>

              <InsightItem icon="🇪🇺" title="EU comparison">
                The map makes it easier to compare very different fiscal positions inside one bloc.
              </InsightItem>
            </div>
          </section>

          <section className="eu-home-card eu-home-side-card eu-home-faq-card">
            <div className="eu-home-card-header">
              <div>
                <h2>FAQ: EU government debt</h2>
              </div>
            </div>

            <details>
              <summary>How is the live estimate calculated?</summary>
              <p>
                We use the latest Eurostat reference values and estimate the movement per second
                from the recent change between official data points.
              </p>
            </details>

            <details>
              <summary>Is this an official real-time statistic?</summary>
              <p>
                No. The underlying data comes from official Eurostat releases, but the live counter
                is an educational estimate.
              </p>
            </details>

            <details>
              <summary>What is the difference between debt and deficit?</summary>
              <p>
                Debt is the accumulated stock of what a government owes. A deficit is the yearly
                gap between government spending and revenue.
              </p>
            </details>
          </section>
        </aside>
      </section>

      <section className="eu-home-lower-grid">
        <div className="eu-home-quick-wrap">
          <QuickList
            items={quickItems}
            initialCount={10}
            strings={{
              title: "Quick list",
              showAll: "Show all",
              showLess: "Show less",
              rising: "↑ rising",
              falling: "↓ falling",
              flat: "→ flat",
              more: "more",
            }}
          />
        </div>

        <section className="eu-home-card eu-home-lower-card">
          <div className="eu-home-articles-head">
            <h2>Latest articles</h2>
            <Link href="/articles" className="eu-home-small-link">
              View all →
            </Link>
          </div>

          <div className="eu-home-articles-list">
            {topArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}

            {topArticles.length === 0 && (
              <div className="eu-home-empty">No articles yet. More coming soon.</div>
            )}
          </div>
        </section>
      </section>

      <style>{`
        .eu-home-v2 {
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

        .eu-home-hero,
        .eu-home-card,
        .eu-home-quick-wrap > .card {
          background: #ffffff;
          border: 1px solid rgba(203, 213, 225, 0.8);
          border-radius: 18px;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.06);
        }

        .eu-home-hero {
          display: grid;
          grid-template-columns: minmax(410px, 0.82fr) minmax(640px, 1.18fr);
          gap: clamp(28px, 3.2vw, 54px);
          padding: clamp(28px, 3vw, 44px);
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 36%),
            linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
        }

        .eu-home-hero-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .eu-home-title {
          margin: 0 0 18px;
          font-family: var(--font-display);
          font-size: clamp(3rem, 4.05vw, 4.45rem);
          line-height: 0.95;
          letter-spacing: -0.06em;
          font-weight: 850;
          background: linear-gradient(120deg, #1d4ed8 0%, #1266d6 54%, #00966b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .eu-home-title span {
          display: block;
          white-space: nowrap;
        }

        .eu-home-lede {
          margin: 0;
          max-width: 560px;
          color: #1f3553;
          font-size: clamp(1rem, 0.7vw + 0.82rem, 1.13rem);
          line-height: 1.5;
        }

        .eu-home-copy {
          margin: 14px 0 0;
          max-width: 590px;
          color: #334b6b;
          font-size: 0.98rem;
          line-height: 1.62;
        }

        .eu-home-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 18px;
        }

        .eu-home-meta span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 32px;
          padding: 0 12px;
          border: 1px solid #dbe5f0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: #405a78;
          font-size: 0.8rem;
          font-weight: 750;
          line-height: 1;
          white-space: nowrap;
        }

        .eu-home-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 18px;
        }

        .eu-home-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 800;
          transition:
            transform 0.1s ease,
            box-shadow 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease;
        }

        .eu-home-btn:hover {
          transform: translateY(-1px);
          text-decoration: none;
        }

        .eu-home-btn-primary {
          color: #ffffff;
          background: linear-gradient(180deg, #1764e8, #0f55d4);
          border: 1px solid #0f55d4;
          box-shadow: 0 14px 26px rgba(37, 99, 235, 0.22);
        }

        .eu-home-btn-secondary {
          color: #101827;
          background: #ffffff;
          border: 1px solid #d8e1ec;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
        }

        .eu-home-source {
          margin: 18px 0 0;
          max-width: 600px;
          color: #66758a;
          font-size: 0.78rem;
          line-height: 1.45;
        }

        .eu-home-hero-dashboard {
          min-width: 0;
          align-self: start;
          display: grid;
          gap: 16px;
          padding-top: 16px;
        }

        .eu-home-total-shell {
          min-width: 0;
          width: 100%;
        }

        .eu-home-total-shell .eu-total-ticker {
          box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
        }

        .eu-home-total-shell .eu-total-ticker-value {
          font-size: clamp(3rem, 5.05cqw, 4.7rem);
        }

        .eu-home-hero-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .eu-home-mini-link {
          display: block;
          color: inherit;
          text-decoration: none;
          min-width: 0;
        }

        .eu-home-mini-link:hover {
          text-decoration: none;
        }

        .eu-home-mini-card {
          min-width: 0;
          height: 100%;
          padding: 20px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #dbe5f0;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);
          transition:
            transform 0.12s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .eu-home-mini-link:hover .eu-home-mini-card {
          transform: translateY(-2px);
          border-color: #bfdbfe;
          box-shadow: 0 18px 34px rgba(37, 99, 235, 0.12);
        }

        .eu-home-mini-card-blue {
          border-color: #c9ddff;
        }

        .eu-home-mini-card-green {
          border-color: #caead5;
        }

        .eu-home-mini-topline {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
        }

        .eu-home-mini-label {
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .eu-home-mini-card-green .eu-home-mini-label {
          color: #059669;
        }

        .eu-home-mini-arrow {
          color: #94a3b8;
          font-weight: 900;
        }

        .eu-home-mini-country {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          margin-top: 10px;
          color: #111827;
          font-size: 1.08rem;
        }

        .eu-home-mini-country strong {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .eu-home-mini-value {
          margin-top: 12px;
          color: #0f172a;
          font-size: clamp(1.95rem, 2.3vw, 2.55rem);
          line-height: 1;
          font-weight: 850;
          letter-spacing: -0.04em;
          white-space: nowrap;
        }

        .eu-home-mini-trend {
          margin-top: 9px;
          font-size: 0.82rem;
          line-height: 1.35;
          font-weight: 750;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .eu-home-mini-trend.is-rising {
          color: #dc2626;
        }

        .eu-home-mini-trend.is-falling {
          color: #16a34a;
        }

        .eu-home-mini-card p {
          margin: 12px 0 0;
          color: #50647e;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .eu-home-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(360px, 0.95fr);
          gap: 18px;
          align-items: start;
        }

        .eu-home-map-card,
        .eu-home-side-card,
        .eu-home-lower-card,
        .eu-home-quick-wrap > .card {
          padding: 22px;
        }

        .eu-home-quick-wrap > .card {
          height: 100%;
        }

        .eu-home-quick-wrap li {
          border-bottom-color: #e2e8f0 !important;
        }

        .eu-home-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 14px;
        }

        .eu-home-card-header h2,
        .eu-home-articles-head h2 {
          margin: 0;
          color: #0f172a;
          font-size: 1.18rem;
          letter-spacing: -0.02em;
        }

        .eu-home-card-header p {
          margin: 4px 0 0;
          max-width: 670px;
          color: #52647b;
          font-size: 0.86rem;
          line-height: 1.35;
        }

        .eu-home-map-header {
          align-items: center;
        }

        .eu-home-map-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .eu-home-pill {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
          color: #334155;
          font-size: 0.78rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .eu-home-pill-green {
          color: #047857;
          border-color: #bbf7d0;
          background: #ecfdf5;
        }

        .eu-home-pill-red {
          color: #dc2626;
          border-color: #fecaca;
          background: #fef2f2;
        }

        .eu-home-map-shell {
          overflow: hidden;
          min-height: 420px;
          border-radius: 16px;
          background: linear-gradient(180deg, #dbeafe, #eff6ff);
        }

        .eu-home-map-shell svg {
          display: block;
          width: 100%;
          height: auto;
        }

        .eu-home-map-actions {
          display: grid;
          grid-template-columns: 1.4fr 0.7fr 0.8fr;
          gap: 10px;
          margin-top: 12px;
        }

        .eu-home-map-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 44px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #dbe5f0;
          background: #f8fbff;
          color: #155bd6;
          text-align: center;
          text-decoration: none;
          font-size: 0.82rem;
          line-height: 1.25;
        }

        .eu-home-map-action:hover {
          border-color: #bcd4ff;
          background: #eef5ff;
          text-decoration: none;
        }

        .eu-home-map-action-main {
          color: #12233b;
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .eu-home-side-stack {
          display: grid;
          gap: 14px;
        }

        .eu-home-snapshot-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .eu-home-snapshot-stat {
          min-width: 0;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .eu-home-snapshot-red {
          border-color: #fecaca;
          background: #fff7f7;
        }

        .eu-home-snapshot-green {
          border-color: #bbf7d0;
          background: #f0fdf4;
        }

        .eu-home-snapshot-label {
          color: #64748b;
          font-size: 0.76rem;
          line-height: 1.25;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .eu-home-snapshot-value {
          margin-top: 8px;
          color: #0f172a;
          font-size: clamp(1.55rem, 2vw, 2.05rem);
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.045em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .eu-home-snapshot-note {
          margin-top: 8px;
          color: #52647b;
          font-size: 0.77rem;
          line-height: 1.35;
        }

        .eu-home-period-box {
          display: grid;
          gap: 2px;
          margin-top: 12px;
          padding: 13px 14px;
          border-radius: 14px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
        }

        .eu-home-period-box span {
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 750;
        }

        .eu-home-period-box strong {
          color: #0f172a;
          font-size: 1rem;
        }

        .eu-home-period-box small {
          margin-top: 4px;
          color: #64748b;
          font-size: 0.78rem;
        }

        .eu-home-insights {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
        }

        .eu-home-insight-item {
          padding: 4px 14px 0;
          border-left: 1px solid #edf2f7;
        }

        .eu-home-insight-item:first-child {
          border-left: 0;
          padding-left: 0;
        }

        .eu-home-insight-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          margin-bottom: 9px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 850;
        }

        .eu-home-insight-item:nth-child(2) .eu-home-insight-icon {
          background: #ecfdf5;
          color: #059669;
        }

        .eu-home-insight-item:nth-child(3) .eu-home-insight-icon {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .eu-home-insight-item h3 {
          margin: 0;
          color: #0f172a;
          font-size: 0.9rem;
        }

        .eu-home-insight-item p {
          margin: 5px 0 0;
          color: #52647b;
          font-size: 0.78rem;
          line-height: 1.38;
        }

        .eu-home-faq-card {
          padding-bottom: 14px;
        }

        .eu-home-faq-card details {
          border-top: 1px solid #edf2f7;
          padding: 11px 0;
        }

        .eu-home-faq-card details:first-of-type {
          border-top: 0;
          padding-top: 0;
        }

        .eu-home-faq-card summary {
          cursor: pointer;
          color: #0f172a;
          font-weight: 800;
          font-size: 0.86rem;
          list-style-position: outside;
        }

        .eu-home-faq-card p {
          margin: 8px 0 0;
          color: #52647b;
          font-size: 0.84rem;
          line-height: 1.5;
        }

        .eu-home-lower-grid {
          display: grid;
          grid-template-columns: minmax(300px, 0.9fr) minmax(0, 1.1fr);
          gap: 18px;
          align-items: start;
        }

        .eu-home-articles-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .eu-home-small-link {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
          color: #0f172a;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .eu-home-small-link:hover {
          background: #f8fafc;
          text-decoration: none;
        }

        .eu-home-articles-list {
          display: grid;
          gap: 12px;
        }

        .eu-home-empty {
          padding: 14px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          font-size: 0.9rem;
        }

        @media (max-width: 1250px) {
          .eu-home-hero {
            grid-template-columns: 1fr;
          }

          .eu-home-hero-copy {
            max-width: 760px;
          }

          .eu-home-hero-dashboard {
            padding-top: 0;
          }

          .eu-home-main-grid,
          .eu-home-lower-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 920px) {
          .eu-home-snapshot-grid,
          .eu-home-insights {
            grid-template-columns: 1fr;
          }

          .eu-home-insight-item {
            border-left: 0;
            border-top: 1px solid #edf2f7;
            padding: 14px 0 0;
          }

          .eu-home-insight-item:first-child {
            border-top: 0;
            padding-top: 0;
          }
        }

        @media (max-width: 820px) {
          .eu-home-v2 {
            width: min(calc(100% - 28px), 1500px);
            padding: 18px 0 42px;
            gap: 14px;
          }

          .eu-home-hero,
          .eu-home-map-card,
          .eu-home-side-card,
          .eu-home-lower-card,
          .eu-home-quick-wrap > .card {
            padding: 18px;
          }

          .eu-home-title {
            font-size: clamp(2.55rem, 13vw, 4.1rem);
            letter-spacing: -0.06em;
          }

          .eu-home-hero-stats,
          .eu-home-map-actions {
            grid-template-columns: 1fr;
          }

          .eu-home-card-header,
          .eu-home-map-header {
            flex-direction: column;
            align-items: stretch;
          }

          .eu-home-map-pills {
            justify-content: flex-start;
          }

          .eu-home-map-shell {
            min-height: 320px;
          }
        }

        @media (max-width: 560px) {
          .eu-home-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .eu-home-btn {
            width: 100%;
          }

          .eu-home-meta span {
            width: 100%;
            justify-content: center;
          }

          .eu-home-mini-card {
            padding: 16px;
          }

          .eu-home-map-shell {
            min-height: 260px;
          }
        }
      `}</style>
    </main>
  );
}