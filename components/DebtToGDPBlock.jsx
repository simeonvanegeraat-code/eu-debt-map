"use client";

// --- VERTALINGEN CONFIGURATIE ---
const TRANSLATIONS = {
  en: {
    title: "Debt-to-GDP ratio",
    low: "low",
    mid: "elevated",
    high: "high",
    legend: {
      ok: "<60% (green)",
      warn: "60–90% (amber)",
      bad: ">90% (red)",
    },
    advisory: {
      low: "This is below the EU's 60% reference value.",
      mid: "This is above the EU's 60% reference value.",
      high: "This is well above the EU's 60% reference value.",
    },
    text: {
      summary: (country, debtStr, gdpStr, pctStr, bucketLabel) =>
        `Using the latest official debt figure and the current GDP estimate, ${country} has an estimated government debt of ${debtStr} and a nominal GDP of ${gdpStr}. That implies a debt-to-GDP ratio of ${pctStr}, which is ${bucketLabel} relative to common EU reference levels.`,
    },
    units: {
      t: "trillion",
      b: "billion",
    },
    source: "Source: Eurostat debt and GDP data used for this estimate.",
    aria: {
      bar: (name) => `${name} debt to GDP`,
      overflow: "Exceeds 100% of GDP",
    },
  },
  nl: {
    title: "Schuldquote (Schuld/bbp)",
    low: "laag",
    mid: "verhoogd",
    high: "hoog",
    legend: {
      ok: "<60% (groen)",
      warn: "60–90% (oranje)",
      bad: ">90% (rood)",
    },
    advisory: {
      low: "Dit ligt onder de EU-referentiewaarde van 60%.",
      mid: "Dit ligt boven de EU-referentiewaarde van 60%.",
      high: "Dit ligt ruim boven de EU-referentiewaarde van 60%.",
    },
    text: {
      summary: (country, debtStr, gdpStr, pctStr, bucketLabel) =>
        `Op basis van het meest recente officiële schuldcijfer en de huidige bbp-schatting heeft ${country} een geschatte staatsschuld van ${debtStr} en een nominaal bbp van ${gdpStr}. Dat impliceert een schuldquote van ${pctStr}, wat ${bucketLabel} is ten opzichte van gangbare EU-referentiewaarden.`,
    },
    units: {
      t: "biljoen",
      b: "miljard",
    },
    source: "Bron: Eurostat-schuld- en bbp-data gebruikt voor deze schatting.",
    aria: {
      bar: (name) => `${name} schuldquote`,
      overflow: "Overschrijdt 100% van het bbp",
    },
  },
  de: {
    title: "Schulden-zu-BIP-Verhältnis",
    low: "niedrig",
    mid: "erhöht",
    high: "hoch",
    legend: {
      ok: "<60% (grün)",
      warn: "60–90% (gelb)",
      bad: ">90% (rot)",
    },
    advisory: {
      low: "Dies liegt unter dem EU-Referenzwert von 60%.",
      mid: "Dies liegt über dem EU-Referenzwert von 60%.",
      high: "Dies liegt deutlich über dem EU-Referenzwert von 60%.",
    },
    text: {
      summary: (country, debtStr, gdpStr, pctStr, bucketLabel) =>
        `Auf Basis des neuesten offiziellen Schuldenstands und der aktuellen BIP-Schätzung hat ${country} eine geschätzte Staatsverschuldung von ${debtStr} und ein nominales BIP von ${gdpStr}. Das impliziert eine Schuldenquote von ${pctStr}, die im Vergleich zu gängigen EU-Referenzwerten als ${bucketLabel} gilt.`,
    },
    units: {
      t: "Billionen",
      b: "Milliarden",
    },
    source: "Quelle: Eurostat-Schulden- und BIP-Daten für diese Schätzung.",
    aria: {
      bar: (name) => `${name} Schuldenquote`,
      overflow: "Überschreitet 100% des BIP",
    },
  },
  fr: {
    title: "Ratio dette/PIB",
    low: "faible",
    mid: "élevé",
    high: "très élevé",
    legend: {
      ok: "<60% (vert)",
      warn: "60–90% (ambre)",
      bad: ">90% (rouge)",
    },
    advisory: {
      low: "Ce niveau est inférieur à la valeur de référence de 60% dans l’UE.",
      mid: "Ce niveau est supérieur à la valeur de référence de 60% dans l’UE.",
      high: "Ce niveau est nettement supérieur à la valeur de référence de 60% dans l’UE.",
    },
    text: {
      summary: (country, debtStr, gdpStr, pctStr, bucketLabel) =>
        `Sur la base du dernier niveau officiel de dette et de l’estimation actuelle du PIB, ${country} a une dette publique estimée à ${debtStr} et un PIB nominal de ${gdpStr}. Cela implique un ratio dette/PIB de ${pctStr}, considéré comme ${bucketLabel} par rapport aux niveaux de référence courants de l’UE.`,
    },
    units: {
      t: "billions",
      b: "milliards",
    },
    source: "Source : données de dette et de PIB d’Eurostat utilisées pour cette estimation.",
    aria: {
      bar: (name) => `Ratio dette/PIB pour ${name}`,
      overflow: "Dépasse 100% du PIB",
    },
  },
};

function classifyBucket(pct) {
  if (pct < 60) return { key: "low", colorVar: "var(--ok)" };
  if (pct < 90) return { key: "mid", colorVar: "var(--warn)" };
  return { key: "high", colorVar: "var(--bad)" };
}

// Helper voor formatting met juiste taal en eenheden
function formatMoneyEUR(n, lang = "en") {
  if (!Number.isFinite(n)) return "—";

  const loc =
    lang === "nl" || lang === "de"
      ? "de-DE"
      : lang === "fr"
      ? "fr-FR"
      : "en-US";

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const abs = Math.abs(n);

  if (abs >= 1_000_000_000_000) {
    const val = (n / 1_000_000_000_000).toLocaleString(loc, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `€ ${val} ${t.units.t}`;
  }

  if (abs >= 1_000_000_000) {
    const val = (n / 1_000_000_000).toLocaleString(loc, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `€ ${val} ${t.units.b}`;
  }

  return `€ ${n.toLocaleString(loc)}`;
}

function normalizeCountryNameForSentence(name, lang) {
  if (lang === "en" && name === "Netherlands") return "the Netherlands";
  return name;
}

export default function DebtToGDPBlock({
  countryName = "Country",
  debt,
  gdp,
  lang = "en",
}) {
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = TRANSLATIONS[effLang];

  const ratio =
    Number.isFinite(debt) && Number.isFinite(gdp) && gdp > 0
      ? (debt / gdp) * 100
      : NaN;

  const pct = Math.max(0, Math.min(300, Number.isFinite(ratio) ? ratio : 0));
  const bucketInfo = classifyBucket(pct);

  const bucketLabel = t[bucketInfo.key];

  const filledWidth = Math.min(100, pct);
  const overflow = Math.max(0, pct - 100);

  const debtStr = formatMoneyEUR(debt, effLang);
  const gdpStr = formatMoneyEUR(gdp, effLang);
  const pctStr = Number.isFinite(pct) ? `${pct.toFixed(0)}%` : "—";
  const sentenceCountry = normalizeCountryNameForSentence(countryName, effLang);

  const summaryText = t.text.summary(
    sentenceCountry,
    debtStr,
    gdpStr,
    pctStr,
    bucketLabel
  );
  const advisory = t.advisory[bucketInfo.key];

  return (
    <div className="debtgdp-block">
      <div className="debtgdp-header">
        <div className="debtgdp-title">{t.title}</div>
        <div className="debtgdp-badge" style={{ background: bucketInfo.colorVar }}>
          {pctStr}
        </div>
      </div>

      <div className="debtgdp-bar" aria-label={t.aria.bar(countryName)}>
        <div className="debtgdp-bar-bg" />
        <div
          className="debtgdp-bar-fill"
          style={{ width: `${filledWidth}%`, background: bucketInfo.colorVar }}
        />
        {overflow > 0 && (
          <div
            className="debtgdp-bar-overflow"
            title={t.aria.overflow}
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
        <p>{summaryText}</p>
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