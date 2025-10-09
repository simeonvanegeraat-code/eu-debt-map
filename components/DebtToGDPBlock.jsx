// components/DebtToGDPBlock.jsx
"use client";

function classifyBucket(pct) {
  if (pct < 60) return { key: "low", label: "low", colorVar: "var(--ok)" };
  if (pct < 90) return { key: "mid", label: "elevated", colorVar: "var(--warn)" };
  return { key: "high", label: "high", colorVar: "var(--bad)" };
}

function formatMoneyEUR(n) {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000_000) return `€ ${(n / 1_000_000_000_000).toFixed(2)} trillion`;
  if (abs >= 1_000_000_000) return `€ ${(n / 1_000_000_000).toFixed(0)} billion`;
  return `€ ${n.toLocaleString("en-US")}`;
}

export default function DebtToGDPBlock({
  countryName = "Country",
  yearLabel = "2024",
  debt, // absolute in EUR (e.g., 516_000_000_000)
  gdp,  // absolute in EUR (e.g., 1_030_000_000_000)
}) {
  const ratio = Number.isFinite(debt) && Number.isFinite(gdp) && gdp > 0
    ? (debt / gdp) * 100
    : NaN;

  const pct = Math.max(0, Math.min(300, Number.isFinite(ratio) ? ratio : 0)); // cap op 300% voor layout
  const bucket = classifyBucket(pct);

  // Bereken bar widths
  const filledWidth = Math.min(100, pct); // 0..100%
  const overflow = Math.max(0, pct - 100); // 0..200% (we tonen subtiel)

  // SEO-tekst (Option D)
  const debtStr = formatMoneyEUR(debt);
  const gdpStr = formatMoneyEUR(gdp);
  const pctStr = Number.isFinite(pct) ? `${pct.toFixed(0)}%` : "—";

  // Licht advieslabel
  const advisory =
    bucket.key === "low"
      ? "This level is generally considered sustainable under EU fiscal guidelines."
      : bucket.key === "mid"
      ? "This level warrants attention compared to common fiscal thresholds (60% reference)."
      : "This level is high relative to common fiscal thresholds and may limit fiscal flexibility.";

  return (
    <div className="debtgdp-block">
      <div className="debtgdp-header">
        <div className="debtgdp-title">Debt-to-GDP ratio</div>
        <div className="debtgdp-badge" style={{ background: bucket.colorVar }}>
          {pctStr}
        </div>
      </div>

      <div className="debtgdp-bar" aria-label={`${countryName} debt to GDP`}>
        <div className="debtgdp-bar-bg" />
        <div
          className="debtgdp-bar-fill"
          style={{ width: `${filledWidth}%`, background: bucket.colorVar }}
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
        <span><i className="dot ok" /> &lt;60% (green)</span>
        <span><i className="dot warn" /> 60–90% (amber)</span>
        <span><i className="dot bad" /> &gt;90% (red)</span>
      </div>

      <div className="debtgdp-text">
        <p>
          As of {yearLabel}, <strong>{countryName}</strong> has an estimated government debt of{" "}
          <strong>{debtStr}</strong> and a nominal GDP of <strong>{gdpStr}</strong>. That implies a{" "}
          <strong>debt-to-GDP ratio of {pctStr}</strong>, which is considered{" "}
          <strong>{bucket.label}</strong> compared with typical EU reference values.
        </p>
        <p>{advisory}</p>
        <p className="source">
          Source: Eurostat (government debt & GDP, latest available period).
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
