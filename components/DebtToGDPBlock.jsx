"use client";

import { useMemo } from "react";

// --- VERTALINGEN CONFIGURATIE ---
const TRANSLATIONS = {
  en: {
    title: "Debt-to-GDP ratio",
    low: "low",
    elevated: "elevated",
    high: "high",
    legend: {
      ok: "<60% (green)",
      warn: "60–90% (amber)",
      bad: ">90% (red)",
    },
    advisory: {
      low: "This level is generally considered sustainable under EU fiscal guidelines.",
      mid: "This level warrants attention compared to common fiscal thresholds (60% reference).",
      high: "This level is high relative to common fiscal thresholds and may limit fiscal flexibility.",
    },
    text: {
      intro_annualized: (q, y) => `Based on annualized Q${q} ${y} figures,`,
      intro_asof: (y) => `As of ${y},`,
      p1: "has an estimated government debt of",
      p2: "and a nominal GDP of",
      p3: "That implies a",
      p4: "debt-to-GDP ratio of",
      p5: "which is considered",
      p6: "compared with typical EU reference values.",
    },
    units: {
      t: "trillion", // 10^12
      b: "billion",  // 10^9
    },
    source: "Source: Eurostat (Quarterly Debt & Annualized GDP).",
  },
  nl: {
    title: "Schuldquote (Schuld/bbp)",
    low: "laag",
    elevated: "verhoogd",
    high: "hoog",
    legend: {
      ok: "<60% (groen)",
      warn: "60–90% (oranje)",
      bad: ">90% (rood)",
    },
    advisory: {
      low: "Dit niveau wordt volgens de EU-begrotingsregels over het algemeen als houdbaar beschouwd.",
      mid: "Dit niveau vereist aandacht in vergelijking met de gebruikelijke drempelwaarden (referentie 60%).",
      high: "Dit niveau is hoog in vergelijking met de normen en kan de fiscale flexibiliteit beperken.",
    },
    text: {
      intro_annualized: (q, y) => `Op basis van geannualiseerde cijfers uit Q${q} ${y},`,
      intro_asof: (y) => `Per ${y},`,
      p1: "heeft een geschatte staatsschuld van",
      p2: "en een nominaal bbp van",
      p3: "Dat impliceert een",
      p4: "schuldquote van",
      p5: "die wordt beschouwd als",
      p6: "in vergelijking met typische EU-referentiewaarden.",
    },
    units: {
      t: "biljoen", // 10^12
      b: "miljard", // 10^9
    },
    source: "Bron: Eurostat (Kwartaalschuld & geannualiseerd bbp).",
  },
  de: {
    title: "Schulden-zu-BIP-Verhältnis",
    low: "niedrig",
    elevated: "erhöht",
    high: "hoch",
    legend: {
      ok: "<60% (grün)",
      warn: "60–90% (gelb)",
      bad: ">90% (rot)",
    },
    advisory: {
      low: "Dieses Niveau gilt nach EU-Richtlinien allgemein als nachhaltig.",
      mid: "Dieses Niveau erfordert Aufmerksamkeit im Vergleich zu den üblichen Referenzwerten (60%).",
      high: "Dieses Niveau ist im Vergleich zu den üblichen Referenzwerten hoch und könnte den finanziellen Spielraum einschränken.",
    },
    text: {
      intro_annualized: (q, y) => `Basierend auf annualisierten Zahlen für Q${q} ${y},`,
      intro_asof: (y) => `Stand ${y},`,
      p1: "hat eine geschätzte Staatsverschuldung von",
      p2: "und ein nominales BIP von",
      p3: "Dies bedeutet eine",
      p4: "Schuldenquote von",
      p5: "die im Vergleich zu typischen EU-Referenzwerten als",
      p6: "gilt.", // Duitse grammatica: zin eindigt anders
    },
    units: {
      t: "Billionen", // 10^12 (Let op: False friend met English Trillion)
      b: "Milliarden",// 10^9
    },
    source: "Quelle: Eurostat (Vierteljährliche Schulden & annualisiertes BIP).",
  },
  fr: {
    title: "Ratio dette/PIB",
    low: "faible",
    elevated: "élevé",
    high: "très élevé",
    legend: {
      ok: "<60% (vert)",
      warn: "60–90% (ambre)",
      bad: ">90% (rouge)",
    },
    advisory: {
      low: "Ce niveau est généralement considéré comme soutenable selon les directives budgétaires de l'UE.",
      mid: "Ce niveau mérite attention par rapport aux seuils budgétaires courants (référence 60%).",
      high: "Ce niveau est élevé par rapport aux seuils courants et peut limiter la flexibilité budgétaire.",
    },
    text: {
      intro_annualized: (q, y) => `Basé sur les chiffres annualisés du T${q} ${y},`,
      intro_asof: (y) => `En ${y},`,
      p1: "a une dette publique estimée à",
      p2: "et un PIB nominal de",
      p3: "Cela implique un",
      p4: "ratio dette/PIB de",
      p5: "qui est considéré comme",
      p6: "par rapport aux valeurs de référence de l'UE.",
    },
    units: {
      t: "billions", // 10^12
      b: "milliards", // 10^9
    },
    source: "Source : Eurostat (Dette trimestrielle & PIB annualisé).",
  },
};

function classifyBucket(pct) {
  if (pct < 60) return { key: "low", colorVar: "var(--ok)" };
  if (pct < 90) return { key: "mid", colorVar: "var(--warn)" };
  return { key: "high", colorVar: "var(--bad)" };
}

// Helper voor formatting met juiste taal en eenheden (Trillion vs Billion vs Miljard)
function formatMoneyEUR(n, lang = "en") {
  if (!Number.isFinite(n)) return "—";
  
  // Bepaal locale string (voor punten en komma's)
  const loc = lang === "nl" || lang === "de" ? "de-DE" : lang === "fr" ? "fr-FR" : "en-US";
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const abs = Math.abs(n);

  // 10^12 handling (Eng: Trillion, NL/DE: Biljoen/Billion)
  if (abs >= 1_000_000_000_000) {
    const val = (n / 1_000_000_000_000).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `€ ${val} ${t.units.t}`;
  }
  
  // 10^9 handling (Eng: Billion, NL/DE: Miljard/Milliarde)
  if (abs >= 1_000_000_000) {
    const val = (n / 1_000_000_000).toLocaleString(loc, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return `€ ${val} ${t.units.b}`;
  }
  
  return `€ ${n.toLocaleString(loc)}`;
}

/**
 * Bouwt de introzin ("Based on annualized Q3...")
 */
function getIntroPhrase(label, t) {
  const safeLabel = String(label || "");
  // Check op kwartaal formaat (YYYY-Q#)
  if (safeLabel.match(/^\d{4}-Q\d$/)) {
    const [year, q] = safeLabel.split("-Q");
    return t.text.intro_annualized(q, year);
  }
  // Standaard fallback
  return t.text.intro_asof(safeLabel);
}

export default function DebtToGDPBlock({
  countryName = "Country",
  yearLabel = "2024",
  debt, // absolute in EUR
  gdp,  // absolute in EUR
  lang = "en", // Nieuwe prop voor taal
}) {
  // Selecteer vertalingen (fallback naar en)
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = TRANSLATIONS[effLang];

  const ratio = Number.isFinite(debt) && Number.isFinite(gdp) && gdp > 0
    ? (debt / gdp) * 100
    : NaN;

  const pct = Math.max(0, Math.min(300, Number.isFinite(ratio) ? ratio : 0)); // cap op 300%
  const bucketInfo = classifyBucket(pct);

  // Vertaal het label (low/elevated/high)
  const bucketLabel = t[bucketInfo.key];

  // Bereken bar widths
  const filledWidth = Math.min(100, pct); // 0..100%
  const overflow = Math.max(0, pct - 100); // 0..200% (we tonen subtiel)

  // SEO-tekst formatting met taal
  const debtStr = formatMoneyEUR(debt, effLang);
  const gdpStr = formatMoneyEUR(gdp, effLang);
  const pctStr = Number.isFinite(pct) ? `${pct.toFixed(0)}%` : "—";
  
  // Dynamische introzin
  const introText = getIntroPhrase(yearLabel, t);

  // Vertaald advies
  const advisory = t.advisory[bucketInfo.key];

  return (
    <div className="debtgdp-block">
      <div className="debtgdp-header">
        <div className="debtgdp-title">{t.title}</div>
        <div className="debtgdp-badge" style={{ background: bucketInfo.colorVar }}>
          {pctStr}
        </div>
      </div>

      <div className="debtgdp-bar" aria-label={`${countryName} debt to GDP`}>
        <div className="debtgdp-bar-bg" />
        <div
          className="debtgdp-bar-fill"
          style={{ width: `${filledWidth}%`, background: bucketInfo.colorVar }}
        />
        {overflow > 0 && (
          <div
            className="debtgdp-bar-overflow"
            title="Exceeds 100% of GDP"
            style={{ width: `${Math.min(100, overflow)}%` }}
          />
        )}
        <div className="debtgdp-bar-ticks">
          <span style={{ left: "0%" }}>0%</span>
          <span style={{ left: "60%" }}>60%</span>
          <span style={{ left: "90%" }}>90%</span>
          <span style={{ left: "100%" }}>100%</span>
        </div>
      </div>

      <div className="debtgdp-legend">
        <span><i className="dot ok" /> {t.legend.ok}</span>
        <span><i className="dot warn" /> {t.legend.warn}</span>
        <span><i className="dot bad" /> {t.legend.bad}</span>
      </div>

      <div className="debtgdp-text">
        <p>
          {introText} <strong>{countryName}</strong> {t.text.p1}{" "}
          <strong>{debtStr}</strong> {t.text.p2} <strong>{gdpStr}</strong>. {t.text.p3}{" "}
          <strong>{t.text.p4} {pctStr}</strong>, {t.text.p5}{" "}
          <strong>{bucketLabel}</strong> {t.text.p6}
        </p>
        <p>{advisory}</p>
        <p className="source">
          {t.source}
        </p>
      </div>

      <style jsx>{`
        .debtgdp-block {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius, 16px);
          padding: 16px;
        }
        .debtgdp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .debtgdp-title {
          font-weight: 600;
          font-size: 16px;
        }
        .debtgdp-badge {
          color: #0b1220;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 999px;
          min-width: 56px;
          text-align: center;
        }
        .debtgdp-bar {
          position: relative;
          height: 16px;
          border-radius: 999px;
          overflow: hidden;
          margin: 8px 0 12px;
          border: 1px solid var(--border);
          background: var(--accent-weak, #2b3444);
        }
        .debtgdp-bar-bg {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          pointer-events: none;
        }
        .debtgdp-bar-fill {
          height: 100%;
          transition: width .4s ease;
        }
        .debtgdp-bar-overflow {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,.15),
            rgba(255,255,255,.15) 6px,
            rgba(255,255,255,0) 6px,
            rgba(255,255,255,0) 12px
          );
        }
        .debtgdp-bar-ticks span {
          position: absolute;
          top: 22px;
          transform: translateX(-50%);
          font-size: 11px;
          color: var(--muted);
        }
        .debtgdp-legend {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 12px;
          color: var(--muted);
          margin: 6px 0 10px;
        }
        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          margin-right: 6px;
        }
        .dot.ok { background: var(--ok); }
        .dot.warn { background: var(--warn); }
        .dot.bad { background: var(--bad); }
        .debtgdp-text p {
          margin: 0 0 8px;
          line-height: 1.5;
          font-size: 14px;
          color: var(--fg);
        }
        .debtgdp-text .source {
          color: var(--muted);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}