import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import HighlightTicker from "@/components/HighlightTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor, livePerSecondFor, interpolateDebt } from "@/lib/data";

const EuropeMap = dynamic(() => import("@/components/EuropeMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: 520, display: "grid", placeItems: "center" }}
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
  const title = "EU Debt Map | Live EU Government Debt by Country";
  const description =
    "Track EU government debt country by country with a live EU-27 debt map, real-time estimates, country comparisons, and debt trends based on Eurostat data.";

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
      description:
        "Explore EU government debt with a live map, country pages, debt trends, and real-time estimates based on Eurostat data.",
      url: "https://www.eudebtmap.com/",
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Live EU government debt estimates, country comparisons, and trends based on Eurostat data.",
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

function perSecondForCountry(country) {
  return livePerSecondFor(country);
}

function liveStartForCountry(country, atMs) {
  if (!country) return 0;
  return interpolateDebt(country, atMs);
}

function formatEURShort(value) {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000_000) return `€${(value / 1_000_000_000_000).toFixed(2)}tn`;
  if (abs >= 1_000_000_000) return `€${(value / 1_000_000_000).toFixed(2)}bn`;
  if (abs >= 1_000_000) return `€${(value / 1_000_000).toFixed(0)}m`;

  return `€${new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 0,
  }).format(Math.round(value))}`;
}

function countryHref(code) {
  return `/country/${String(code || "").toLowerCase()}`;
}

export default function HomePage() {
  const valid = countries.filter((country) => {
    return country && country.last_value_eur > 0 && country.prev_value_eur > 0;
  });

  const largestDebt =
    valid.length > 0
      ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b))
      : null;

  const withDelta = valid.map((country) => ({
    ...country,
    delta: country.last_value_eur - country.prev_value_eur,
  }));

  const fastestGrowing =
    withDelta.length > 0 ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b)) : null;

  const risingCount = valid.filter((country) => trendFor(country) > 0).length;
  const fallingCount = valid.filter((country) => trendFor(country) < 0).length;

  const quickItems = valid.map((country) => ({
    code: country.code,
    name: country.name,
    flag: country.flag,
    trend: trendFor(country),
  }));

  const featuredCountries = [...valid]
    .sort((a, b) => b.last_value_eur - a.last_value_eur)
    .slice(0, 6);

  const topArticles = listArticles({ lang: "en" }).slice(0, 3);
  const nowMs = Date.now();

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.eudebtmap.com/",
    name: "EU Debt Map",
    inLanguage: "en",
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EU Debt Map",
    url: "https://www.eudebtmap.com/",
    sameAs: ["https://www.eudebtmap.com/"],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is the live estimate calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "We interpolate between the last two Eurostat reference periods and extrapolate the change per second. Country pages show the baseline and recent direction.",
        },
      },
      {
        "@type": "Question",
        name: "Is this an official real-time government statistic?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. It is an educational visualization based on official Eurostat data. The live ticker is an estimate, not an official real-time publication.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between debt and deficit?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Government debt is the accumulated amount a country owes. A deficit is the gap between what a government spends and what it collects over a period, usually a year.",
        },
      },
    ],
  };

  const styles = `
    .home-shell {
      display: grid;
      gap: 20px;
      align-items: start;
      max-width: 1320px !important;
    }

    .home-hero {
      position: relative;
      overflow: hidden;
      padding: 28px;
      background:
        radial-gradient(circle at top right, rgba(37,99,235,0.11), transparent 28%),
        radial-gradient(circle at bottom left, rgba(34,197,94,0.08), transparent 24%),
        linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    }

    .home-hero::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(37,99,235,0.03), transparent 36%);
      pointer-events: none;
    }

    .hero-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(360px, 0.9fr) minmax(620px, 1.1fr);
      gap: 28px;
      align-items: start;
    }

    .hero-copy,
    .hero-panel {
      min-width: 0;
    }

    .hero-kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      border: 1px solid #dbe7f4;
      background: rgba(255,255,255,0.9);
      color: #4f6780;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .hero-title {
      margin: 16px 0 14px;
      font-family: var(--font-display);
      font-size: clamp(3.2rem, 5vw, 5.5rem);
      line-height: 0.92;
      letter-spacing: -0.05em;
      font-weight: 700;
      max-width: 6.4ch;
    }

    .hero-title span {
      display: block;
      background: linear-gradient(90deg, #2563eb 0%, #0f78d1 46%, #18b37a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-title span + span {
      margin-top: 6px;
    }

    .hero-lede {
      margin: 0;
      max-width: 34ch;
      color: #39536f;
      font-size: clamp(1.08rem, 0.5vw + 0.95rem, 1.32rem);
      line-height: 1.62;
      font-weight: 600;
    }

    .hero-text {
      margin: 14px 0 0;
      max-width: 64ch;
      color: #5a7086;
      line-height: 1.72;
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }

    .meta-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 36px;
      padding: 0 12px;
      border-radius: 999px;
      border: 1px solid #dbe4ef;
      background: rgba(255,255,255,0.92);
      color: #516881;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 18px;
    }

    .hero-btn-primary,
    .hero-btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 48px;
      padding: 0 18px;
      border-radius: 999px;
      text-decoration: none;
      font-weight: 700;
      transition: transform 0.08s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
    }

    .hero-btn-primary {
      background: linear-gradient(180deg, #2563eb, #1d4ed8);
      color: #ffffff;
      border: 1px solid #1d4ed8;
      box-shadow: 0 10px 24px rgba(37,99,235,0.18);
    }

    .hero-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(37,99,235,0.22);
      text-decoration: none;
    }

    .hero-btn-secondary {
      background: #ffffff;
      color: var(--fg);
      border: 1px solid #d7dee8;
      box-shadow: 0 4px 10px rgba(15,23,42,0.04);
    }

    .hero-btn-secondary:hover {
      background: #f8fafc;
      border-color: #c7d2de;
      text-decoration: none;
    }

    .hero-country-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }

    .country-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 38px;
      padding: 0 14px;
      border-radius: 999px;
      border: 1px solid #dbe4ef;
      background: rgba(255,255,255,0.92);
      color: #0f172a;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      transition: background 0.18s ease, border-color 0.18s ease, transform 0.08s ease;
    }

    .country-pill:hover {
      background: #ffffff;
      border-color: #bfd0e3;
      text-decoration: none;
      transform: translateY(-1px);
    }

    .hero-source {
      margin: 18px 0 0;
      padding-top: 14px;
      border-top: 1px solid #e7eef5;
      color: #64748b;
      font-size: 13px;
      line-height: 1.6;
      max-width: 70ch;
    }

    .hero-panel {
      display: grid;
      gap: 14px;
      align-content: start;
    }

    .hero-ticker-shell {
      width: 100%;
    }

    .hero-ticker-shell [role="region"][aria-label="EU-27 total government debt (live)"] {
      width: 100%;
      border-radius: 24px !important;
      padding: 22px 24px !important;
      box-shadow: 0 10px 30px rgba(15,23,42,0.06) !important;
    }

    .hero-ticker-shell [role="region"][aria-label="EU-27 total government debt (live)"] .tag {
      margin-bottom: 12px !important;
      font-size: 0.98rem !important;
      color: #465f7b !important;
    }

    .hero-ticker-shell [role="region"][aria-label="EU-27 total government debt (live)"] .ticker-hero > span {
      font-size: clamp(2.5rem, 3vw, 4.1rem) !important;
      line-height: 1.02 !important;
      letter-spacing: -0.045em !important;
      white-space: nowrap !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
    }

    .hero-metric-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }

    .metric-card {
      min-width: 0;
      border: 1px solid #e3ebf3;
      border-radius: 18px;
      background: rgba(255,255,255,0.96);
      box-shadow: 0 8px 18px rgba(15,23,42,0.05);
      padding: 16px;
    }

    .metric-label {
      margin: 0 0 10px;
      font-size: 12px;
      color: #6b8095;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .metric-country {
      margin: 0 0 10px;
      font-size: 15px;
      line-height: 1.3;
      font-weight: 700;
      color: #0f172a;
    }

    .metric-value {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 1.4vw, 2rem);
      line-height: 1.06;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #0f172a;
    }

    .metric-sub {
      margin-top: 8px;
      font-size: 14px;
      line-height: 1.55;
      color: #5b6f86;
    }

    .split-value {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex-wrap: wrap;
      font-family: var(--font-display);
      font-size: clamp(1.65rem, 1.65vw, 2.2rem);
      line-height: 1.05;
      letter-spacing: -0.04em;
      font-weight: 700;
      color: #0f172a;
    }

    .split-ok {
      color: var(--ok);
    }

    .split-bad {
      color: var(--bad);
    }

    .overview-shell {
      display: grid;
      gap: 18px;
      padding: 24px;
      background: linear-gradient(180deg, rgba(248,250,252,0.82), rgba(255,255,255,1));
    }

    .overview-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 18px;
      align-items: end;
    }

    .overview-title {
      margin: 0 0 8px;
    }

    .overview-copy {
      margin: 0;
      max-width: 72ch;
      color: #5a6f86;
      line-height: 1.72;
    }

    .overview-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      align-items: center;
    }

    .legend-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 36px;
      padding: 0 12px;
      border-radius: 999px;
      border: 1px solid #dfe7ef;
      background: #ffffff;
      color: #475569;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      display: inline-block;
      flex: 0 0 10px;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.85fr);
      gap: 18px;
      align-items: stretch;
    }

    .map-shell {
      min-width: 0;
      display: grid;
      gap: 12px;
    }

    .map-frame {
      overflow: hidden;
      border: 1px solid #e2e8f0;
      border-radius: 22px;
      background: linear-gradient(180deg, #f8fafc, #ffffff);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
    }

    .map-frame .card {
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      background: transparent !important;
      padding: 0 !important;
    }

    .map-frame .mapWrap {
      min-height: 560px;
      background: transparent;
      box-shadow: none;
      border-radius: 0;
    }

    .overview-foot {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }

    .overview-callout {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 50px;
      padding: 0 16px;
      border-radius: 14px;
      background: #ffffff;
      border: 1px dashed #cbd5e1;
      color: #0f172a;
      font-weight: 700;
      line-height: 1.45;
    }

    .overview-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .soft-link-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 0 14px;
      border-radius: 999px;
      border: 1px solid #d9e2ec;
      background: #ffffff;
      color: #0f172a;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
    }

    .soft-link-chip:hover {
      background: #f8fafc;
      text-decoration: none;
    }

    .overview-rail {
      min-width: 0;
      display: grid;
      gap: 14px;
      align-content: start;
    }

    .rail-card {
      border: 1px solid #e4ebf3;
      border-radius: 20px;
      background: #ffffff;
      padding: 18px;
      box-shadow: 0 8px 18px rgba(15,23,42,0.04);
    }

    .rail-card h3 {
      margin: 0 0 8px;
      font-size: 1.25rem;
    }

    .rail-card p {
      margin: 0;
      color: #5b6f86;
      line-height: 1.7;
    }

    .highlight-stack {
      display: grid;
      gap: 12px;
      margin-top: 12px;
    }

    .why-mini-grid {
      display: grid;
      gap: 10px;
      margin-top: 12px;
    }

    .why-mini-item {
      border: 1px solid #e7edf4;
      border-radius: 16px;
      background: #fbfdff;
      padding: 14px;
    }

    .why-mini-item strong {
      display: block;
      margin-bottom: 4px;
      color: #0f172a;
      font-size: 15px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
      gap: 20px;
      align-items: start;
    }

    .quicklist-shell section.card {
      padding: 22px;
      border-radius: 20px;
      height: 100%;
    }

    .articles-shell {
      padding: 22px;
      align-content: start;
    }

    .articles-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    .articles-head h2 {
      margin: 0;
    }

    .articles-intro {
      margin: 0 0 16px;
      color: #5a6f86;
      line-height: 1.7;
      max-width: 66ch;
    }

    .articles-stack {
      display: grid;
      gap: 12px;
    }

    .explainer-shell {
      padding: 24px;
      background:
        radial-gradient(circle at top right, rgba(37,99,235,0.06), transparent 24%),
        #ffffff;
    }

    .explainer-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(360px, 0.95fr);
      gap: 24px;
      align-items: start;
    }

    .explainer-copy h2 {
      margin: 0 0 12px;
    }

    .explainer-copy p {
      margin: 0;
      color: #586d85;
      line-height: 1.8;
    }

    .explainer-copy p + p {
      margin-top: 14px;
    }

    .reason-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .reason-card {
      border: 1px solid #e5ebf2;
      border-radius: 18px;
      background: #fbfdff;
      padding: 16px;
      height: 100%;
    }

    .reason-card h3 {
      margin: 0 0 8px;
      font-size: 1rem;
    }

    .reason-card p {
      margin: 0;
      color: #5b6f86;
      line-height: 1.65;
      font-size: 14px;
    }

    .faq-shell {
      padding: 24px;
    }

    .faq-shell h2 {
      margin: 0 0 16px;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .faq-item {
      border: 1px solid #e6edf4;
      border-radius: 18px;
      padding: 18px;
      background: #fbfdff;
      height: 100%;
    }

    .faq-item h3 {
      margin: 0 0 8px;
      font-size: 18px;
    }

    .faq-item p {
      margin: 0;
      color: #5a6f86;
      line-height: 1.72;
    }

    @media (max-width: 1260px) {
      .hero-grid {
        grid-template-columns: minmax(320px, 0.92fr) minmax(520px, 1.08fr);
      }

      .hero-ticker-shell [role="region"][aria-label="EU-27 total government debt (live)"] .ticker-hero > span {
        font-size: clamp(2.2rem, 2.7vw, 3.55rem) !important;
      }

      .hero-metric-grid,
      .reason-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .overview-grid,
      .info-grid,
      .explainer-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 1100px) {
      .hero-grid {
        grid-template-columns: 1fr;
      }

      .hero-title {
        max-width: none;
      }

      .overview-head {
        grid-template-columns: 1fr;
        align-items: start;
      }

      .overview-legend {
        justify-content: flex-start;
      }
    }

    @media (max-width: 900px) {
      .hero-metric-grid,
      .faq-grid,
      .reason-grid {
        grid-template-columns: 1fr;
      }

      .map-frame .mapWrap {
        min-height: 460px;
      }
    }

    @media (max-width: 760px) {
      .home-hero,
      .overview-shell,
      .articles-shell,
      .explainer-shell,
      .faq-shell {
        padding: 20px;
      }

      .hero-title {
        font-size: clamp(2.5rem, 10vw, 3.6rem);
        line-height: 0.95;
      }

      .hero-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .hero-btn-primary,
      .hero-btn-secondary,
      .overview-links,
      .overview-callout {
        width: 100%;
      }

      .overview-foot {
        align-items: stretch;
      }

      .overview-links {
        display: grid;
      }

      .soft-link-chip {
        width: 100%;
      }

      .hero-ticker-shell [role="region"][aria-label="EU-27 total government debt (live)"] {
        padding: 18px !important;
      }

      .hero-ticker-shell [role="region"][aria-label="EU-27 total government debt (live)"] .ticker-hero > span {
        font-size: clamp(2rem, 8vw, 3rem) !important;
        white-space: normal !important;
        overflow-wrap: anywhere !important;
      }
    }
  `;

  return (
    <main className="container home-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section className="card home-hero" aria-labelledby="page-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">Live EU-27 overview</div>

            <h1 id="page-title" className="hero-title">
              <span>Live EU</span>
              <span>Government</span>
              <span>Debt Map</span>
            </h1>

            <p className="hero-lede">
              Track the estimated public debt of all 27 EU countries in one place, then open each
              country page for live totals, recent movement, and debt-to-GDP context.
            </p>

            <p className="hero-text">
              EU Debt Map turns Eurostat debt data into a cleaner, easier way to compare national
              debt across the European Union. Start with the live total, scan the map, then drill
              into countries such as France, Germany, Italy, Spain, and the Netherlands.
            </p>

            <div className="hero-meta" aria-label="Key facts">
              <span className="meta-chip">EU-27 coverage</span>
              <span className="meta-chip">Based on Eurostat data</span>
              <span className="meta-chip">Live estimated ticker</span>
            </div>

            <div className="hero-actions">
              <Link href="/eu-debt" className="hero-btn-primary">
                View EU debt trends →
              </Link>
              <Link href="/debt" className="hero-btn-secondary">
                Read the debt explainer →
              </Link>
            </div>

            <div className="hero-country-strip" aria-label="Browse major EU debt markets">
              {featuredCountries.map((country) => (
                <Link key={country.code} href={countryHref(country.code)} className="country-pill">
                  <span aria-hidden>{country.flag}</span>
                  <span>{country.name}</span>
                </Link>
              ))}
            </div>

            <p className="hero-source">
              Source: Eurostat. Live values are estimated from the latest quarterly data and are
              shown for educational purposes, not as official real-time statistics.
            </p>
          </div>

          <div className="hero-panel">
            <div className="hero-ticker-shell">
              <EUTotalTicker />
            </div>

            <div className="hero-metric-grid" aria-label="Top insights">
              {largestDebt && (
                <div className="metric-card">
                  <p className="metric-label">Largest debt</p>
                  <p className="metric-country">
                    {largestDebt.flag} {largestDebt.name}
                  </p>
                  <div className="metric-value">{formatEURShort(largestDebt.last_value_eur)}</div>
                  <div className="metric-sub">
                    Biggest debt stock in the EU at the latest reference point.
                  </div>
                </div>
              )}

              {fastestGrowing && (
                <div className="metric-card">
                  <p className="metric-label">Fastest growing</p>
                  <p className="metric-country">
                    {fastestGrowing.flag} {fastestGrowing.name}
                  </p>
                  <div className="metric-value">
                    {formatEURShort(fastestGrowing.last_value_eur)}
                  </div>
                  <div className="metric-sub">
                    Strongest absolute increase between the latest two periods.
                  </div>
                </div>
              )}

              <div className="metric-card">
                <p className="metric-label">Latest direction split</p>
                <div className="split-value">
                  <span className="split-bad">{risingCount} rising</span>
                  <span>·</span>
                  <span className="split-ok">{fallingCount} falling</span>
                </div>
                <div className="metric-sub">
                  A quick read of whether debt moved up or down across the bloc at the latest
                  reference update.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card overview-shell" aria-labelledby="overview-title">
        <div className="overview-head">
          <div>
            <h2 id="overview-title" className="overview-title">
              Interactive EU overview
            </h2>
            <p className="overview-copy">
              The map shows whether government debt rose or fell between the latest two reference
              points. Click any country to open its live debt ticker, recent movement, and country
              context.
            </p>
          </div>

          <div className="overview-legend" aria-label="Legend">
            <span className="legend-chip">
              <span className="legend-dot" style={{ background: "var(--ok)" }} />
              Falling debt
            </span>
            <span className="legend-chip">
              <span className="legend-dot" style={{ background: "var(--bad)" }} />
              Rising debt
            </span>
            <span className="legend-chip">
              {fallingCount} falling · {risingCount} rising
            </span>
          </div>
        </div>

        <div className="overview-grid">
          <div className="map-shell">
            <div className="map-frame">
              <div className="mapWrap" role="region" aria-label="Interactive EU map">
                <EuropeMap />
              </div>
            </div>
          </div>

          <aside className="overview-rail">
            <section className="rail-card" aria-labelledby="rail-highlights-title">
              <h3 id="rail-highlights-title">Live highlights</h3>
              <p>
                Two fast ways to read the bloc: the largest debt stock and the country with the
                strongest recent increase.
              </p>

              <div className="highlight-stack">
                {largestDebt ? (
                  <HighlightTicker
                    label="Largest debt"
                    flag={largestDebt.flag}
                    name={largestDebt.name}
                    start={liveStartForCountry(largestDebt, nowMs)}
                    perSecond={perSecondForCountry(largestDebt)}
                  />
                ) : (
                  <div className="tag">—</div>
                )}

                {fastestGrowing ? (
                  <HighlightTicker
                    label="Fastest growing"
                    flag={fastestGrowing.flag}
                    name={fastestGrowing.name}
                    start={liveStartForCountry(fastestGrowing, nowMs)}
                    perSecond={perSecondForCountry(fastestGrowing)}
                    accent="var(--bad)"
                  />
                ) : (
                  <div className="tag">—</div>
                )}
              </div>
            </section>

            <section className="rail-card" aria-labelledby="rail-why-title">
              <h3 id="rail-why-title">Why this matters</h3>
              <p>
                Government debt affects borrowing costs, budget choices, and how much room states
                have when the next shock arrives.
              </p>

              <div className="why-mini-grid">
                <div className="why-mini-item">
                  <strong>Borrowing costs</strong>
                  <span>Higher debt can matter more when interest rates stay elevated.</span>
                </div>
                <div className="why-mini-item">
                  <strong>Fiscal flexibility</strong>
                  <span>Debt levels shape how much room governments have to respond.</span>
                </div>
                <div className="why-mini-item">
                  <strong>EU comparison</strong>
                  <span>The map makes different national positions easier to compare.</span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <div className="overview-foot">
          <div className="overview-callout">
            <span aria-hidden>➜</span>
            <span>Click any country on the map to open its live debt ticker.</span>
          </div>

          <div className="overview-links">
            <Link href="/eu-debt" className="soft-link-chip">
              5-year EU debt chart
            </Link>
            <Link href="/debt" className="soft-link-chip">
              What government debt means
            </Link>
          </div>
        </div>
      </section>

      <section className="info-grid">
        <div className="quicklist-shell">
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

        <section className="card articles-shell" aria-labelledby="articles-title">
          <div className="articles-head">
            <h2 id="articles-title">Latest articles</h2>
            <Link href="/articles" className="tag">
              View all →
            </Link>
          </div>

          <p className="articles-intro">
            Use the map for the live picture, then read the articles for context, interpretation,
            and new Eurostat updates.
          </p>

          <div className="articles-stack">
            {topArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
            {topArticles.length === 0 && <div className="tag">No articles yet. Coming soon.</div>}
          </div>
        </section>
      </section>

      <section className="card explainer-shell" aria-labelledby="explainer-title">
        <div className="explainer-grid">
          <div className="explainer-copy">
            <h2 id="explainer-title">Why EU government debt matters</h2>
            <p>
              Government debt is not just an abstract economic number. It shapes what states can
              spend, how exposed they are to higher rates, and how much room they have for
              infrastructure, pensions, defence, or crisis support.
            </p>
            <p>
              Start with the live map, open a country page to compare national debt, then use{" "}
              <Link href="/eu-debt">EU debt</Link> for the broader trend and <Link href="/debt">Debt</Link>{" "}
              if you want a clearer explanation of debt, deficits, and debt-to-GDP.
            </p>
          </div>

          <div className="reason-grid" aria-label="Key reasons">
            <div className="reason-card">
              <h3>Borrowing costs</h3>
              <p>Higher debt can leave countries more exposed when refinancing becomes expensive.</p>
            </div>
            <div className="reason-card">
              <h3>Budget choices</h3>
              <p>Debt levels influence how governments balance investment, welfare, and restraint.</p>
            </div>
            <div className="reason-card">
              <h3>Country comparison</h3>
              <p>The EU view helps you compare very different fiscal positions inside one bloc.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card faq-shell" aria-labelledby="faq-title">
        <h2 id="faq-title">FAQ: EU government debt</h2>

        <div className="faq-grid">
          <div className="faq-item">
            <h3>How is the live estimate calculated?</h3>
            <p>
              We interpolate between the last two Eurostat reference periods and extrapolate the
              change per second. Country pages include the baseline and recent direction.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is this an official real-time statistic?</h3>
            <p>
              No. This is an educational visualization based on official Eurostat data. The live
              ticker is an estimate designed to make national debt easier to understand.
            </p>
          </div>

          <div className="faq-item">
            <h3>What is the difference between debt and deficit?</h3>
            <p>
              Debt is the total amount a government owes. A deficit is the gap between what a
              government spends and what it collects over a period. You can read more on the <Link href="/debt">Debt page</Link>.
            </p>
          </div>
        </div>
      </section>

      <style>{styles}</style>
    </main>
  );
}