export const runtime = "nodejs";

import Link from "next/link";
import InArticleAd from "@/components/InArticleAd";
import ChartsClient from "./ChartsClient";
import {
  EUROSTAT_DEBT_HISTORY,
  EUROSTAT_DEBT_HISTORY_UPDATED_AT,
} from "@/lib/eurostat.debt.history.gen";

const SITE = "https://www.eudebtmap.com";

const COUNTRY_META = {
  FR: { name: "France", href: "/country/fr" },
  IT: { name: "Italy", href: "/country/it" },
  DE: { name: "Germany", href: "/country/de" },
  ES: { name: "Spain", href: "/country/es" },
  NL: { name: "Netherlands", href: "/country/nl" },
  BE: { name: "Belgium", href: "/country/be" },
  PL: { name: "Poland", href: "/country/pl" },
  GR: { name: "Greece", href: "/country/gr" },
  AT: { name: "Austria", href: "/country/at" },
  PT: { name: "Portugal", href: "/country/pt" },
};

function formatTrillions(value) {
  return `€${(value / 1e12).toFixed(2)}tn`;
}

function formatBillions(value) {
  return `€${(value / 1e9).toFixed(0)}bn`;
}

function formatDate(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(value));
}

const latestQuarter = EUROSTAT_DEBT_HISTORY?.latestQuarter || null;
const latestTotal = Number(EUROSTAT_DEBT_HISTORY?.latestTotalDebtEUR || 0);
const quarters = Array.isArray(EUROSTAT_DEBT_HISTORY?.quarters)
  ? EUROSTAT_DEBT_HISTORY.quarters
  : [];
const earliest = quarters[0] || null;
const latest = quarters[quarters.length - 1] || null;

const absoluteChange =
  earliest && latest ? Number(latest.totalDebtEUR) - Number(earliest.totalDebtEUR) : 0;

const pctChange =
  earliest && earliest.totalDebtEUR > 0
    ? (absoluteChange / Number(earliest.totalDebtEUR)) * 100
    : null;

const historyRows = quarters.map((q) => ({
  quarter: q.quarter,
  totalDebtEUR: q.totalDebtEUR,
}));

const breakdownRows = (EUROSTAT_DEBT_HISTORY?.latestBreakdown || [])
  .slice(0, 10)
  .map((row) => ({
    ...row,
    name: COUNTRY_META[row.code]?.name || row.code,
    href: COUNTRY_META[row.code]?.href || `/country/${row.code.toLowerCase()}`,
    shareLabel: `${row.sharePct.toFixed(1)}%`,
  }));

const top4 = breakdownRows.slice(0, 4);

const PAGE_TITLE = "EU Debt in 2026: 5-Year Chart and Debt by Country | EU Debt Map";
const PAGE_HEADLINE = "EU debt in 2026: 5-year chart and debt by country";
const PAGE_DESCRIPTION =
  "See total EU debt in 2026, how it has changed over the last 5 years, and which countries carry the biggest share. Includes a 5-year chart and country breakdown based on Eurostat data.";

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${SITE}/eu-debt`,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: PAGE_HEADLINE,
    description: PAGE_DESCRIPTION,
    url: `${SITE}/eu-debt`,
    siteName: "EU Debt Map",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_HEADLINE,
    description: PAGE_DESCRIPTION,
  },
};

export default function EUDebtPage() {
  const css = `
    .page {
      max-width: 980px;
      margin: 0 auto;
      padding: 0 16px 64px;
    }

    .article {
      max-width: 760px;
      margin: 0 auto;
    }

    .eyebrow {
      margin-top: 20px;
      color: #2563eb;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-family: var(--font-display, sans-serif);
    }

    .title {
      margin: 10px 0 14px;
      line-height: 1.05;
      font-weight: 800;
      font-size: clamp(2.2rem, 1.7rem + 2.8vw, 4rem);
      letter-spacing: -0.03em;
      color: #111827;
      font-family: var(--font-display, sans-serif);
    }

    .standfirst {
      font-size: 1.2rem;
      line-height: 1.65;
      color: #4b5563;
      margin: 0 0 24px;
      max-width: 760px;
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      color: #6b7280;
      font-size: 0.9rem;
      margin-bottom: 28px;
    }

    .highlightGrid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin: 0 0 34px;
    }

    .card {
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 18px;
      background: #ffffff;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
    }

    .cardLabel {
      color: #6b7280;
      font-size: 0.85rem;
      margin-bottom: 8px;
      font-weight: 600;
      font-family: var(--font-display, sans-serif);
    }

    .cardValue {
      color: #111827;
      font-size: clamp(1.3rem, 1.1rem + 1vw, 2rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      font-family: var(--font-display, sans-serif);
    }

    .prose {
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
      font-size: 1.125rem;
      line-height: 1.85;
      color: #1f2937;
    }

    .prose p {
      margin-bottom: 1.45rem;
    }

    .prose h2 {
      font-family: var(--font-display, sans-serif);
      font-size: 1.8rem;
      line-height: 1.25;
      margin: 2.6rem 0 1rem;
      color: #111827;
      letter-spacing: -0.02em;
    }

    .prose a {
      color: #2563eb;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }

    .prose a:hover {
      color: #1d4ed8;
    }

    .countryList {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px 18px;
      margin: 18px 0 10px;
      padding: 0;
      list-style: none;
    }

    .countryList li {
      margin: 0;
      padding: 0;
      font-family: var(--font-display, sans-serif);
      font-size: 0.98rem;
    }

    .note {
      color: #6b7280;
      font-size: 0.92rem;
      line-height: 1.6;
      margin-top: 16px;
    }

    @media (max-width: 760px) {
      .highlightGrid {
        grid-template-columns: 1fr;
      }

      .countryList {
        grid-template-columns: 1fr;
      }
    }
  `;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: PAGE_HEADLINE,
    description: PAGE_DESCRIPTION,
    datePublished: EUROSTAT_DEBT_HISTORY_UPDATED_AT || new Date().toISOString(),
    dateModified: EUROSTAT_DEBT_HISTORY_UPDATED_AT || new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE}/eu-debt`,
    },
    author: {
      "@type": "Organization",
      name: "EU Debt Map",
    },
    publisher: {
      "@type": "Organization",
      name: "EU Debt Map",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/icons/icon-512.png`,
      },
    },
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{css}</style>

      <article className="article">
        <div className="eyebrow">EU Debt</div>

        <h1 className="title">{PAGE_HEADLINE}</h1>

        <p className="standfirst">
          EU debt now stands above {formatTrillions(latestTotal)} when you add together the public
          debt of all 27 EU countries. This page shows how that total has changed over the last five
          years, which countries account for the biggest share, and why the debt burden is far from
          evenly spread across Europe.
        </p>

        <div className="meta">
          <span>Latest quarter: {latestQuarter || "n/a"}</span>
          <span>Updated: {formatDate(EUROSTAT_DEBT_HISTORY_UPDATED_AT) || "n/a"}</span>
          <span>Source: Eurostat quarterly government debt</span>
        </div>

        <section className="highlightGrid">
          <div className="card">
            <div className="cardLabel">Latest EU-27 debt sum</div>
            <div className="cardValue">{formatTrillions(latestTotal)}</div>
          </div>
          <div className="card">
            <div className="cardLabel">5-year change</div>
            <div className="cardValue">{formatTrillions(absoluteChange)}</div>
          </div>
          <div className="card">
            <div className="cardLabel">Growth since first quarter in chart</div>
            <div className="cardValue">
              {pctChange == null ? "n/a" : `${pctChange.toFixed(1)}%`}
            </div>
          </div>
        </section>

        <ChartsClient historyRows={historyRows} breakdownRows={breakdownRows} />

        <div className="prose">
          <p>
            The chart above adds together the national government debt of all 27 EU member states
            quarter by quarter over the last five years. It follows the same basic idea as the live
            total on the homepage, but here the point is historical context rather than a running
            estimate.
          </p>

          <p>
            That matters because the phrase <strong>EU debt</strong> sounds simple, but it can mean
            different things. It can refer to the official Eurostat EU aggregate. It can also mean
            the combined debt of all EU countries added together. Those two are closely related, but
            they are not always identical in every quarter.
          </p>

          <h2>The total is huge, but the distribution matters more</h2>

          <p>
            The latest quarter in this chart comes in at roughly {formatTrillions(latestTotal)}.
            That is the combined debt pile across the EU-27. But Europe does not borrow like a
            single state. The total sits across many borrowers, with different fiscal positions,
            political constraints and refinancing risks.
          </p>

          <p>
            In the latest quarter, the biggest shares in this summed EU debt pile sit with{" "}
            {top4.map((row, index) => {
              const label = `${row.name} (${row.shareLabel})`;
              if (index === top4.length - 1) return label;
              if (index === top4.length - 2) return `${label} and `;
              return `${label}, `;
            })}
            . That is why a country breakdown matters just as much as the total line.
          </p>

          <ul className="countryList">
            {top4.map((row) => (
              <li key={row.code}>
                <Link href={row.href}>
                  {row.name}
                </Link>{" "}
                — {formatBillions(row.valueEUR)} ({row.shareLabel})
              </li>
            ))}
          </ul>

          <p>
            If you want to go deeper, compare the country pages side by side. Start with{" "}
            <Link href="/country/fr">France</Link>, <Link href="/country/it">Italy</Link>,{" "}
            <Link href="/country/de">Germany</Link> and <Link href="/country/es">Spain</Link>. The
            aggregate tells you how large the debt pile is. The country pages tell you where the
            burden actually sits.
          </p>

          <h2>What this page shows, and what it does not</h2>

          <p>
            This page sums national debt values quarter by quarter across the EU-27. That is useful
            for showing scale and long-term direction. It is also easier to understand than a table
            full of separate country entries.
          </p>

          <p>
            But it should not be confused with a single sovereign borrower. Europe is not one
            treasury. So the chart is best used as a map of scale, not as proof that all fiscal risk
            in Europe is evenly shared.
          </p>

          <InArticleAd />

          <h2>Why the line still matters in 2026</h2>

          <p>
            A debt line that keeps rising does not automatically mean a crisis is close. But it does
            mean the amount that has to be managed, refinanced and defended politically keeps
            growing. That is why nominal debt still matters, even when debt-to-GDP ratios sometimes
            look calmer than the raw totals.
          </p>

          <p>
            Over the last five years, the summed EU debt line has moved steadily higher. That does
            not tell you everything, but it does tell you one important thing: Europe is still
            carrying a very large public debt pile, and it is not evenly distributed.
          </p>

          <p>
            For the live running estimate, go back to the <Link href="/">EU overview</Link>. For
            relative burden, open the <Link href="/debt-to-gdp">debt-to-GDP overview</Link>. And
            for country-level detail, dive into the individual country pages.
          </p>

          <p className="note">
            Method note: this page adds together the quarterly national debt values of all EU-27
            member states using Eurostat’s quarterly government debt dataset. It is designed to show
            scale and distribution clearly. It is not a substitute for the official EU aggregate in
            every analytical context.
          </p>
        </div>
      </article>
    </main>
  );
}