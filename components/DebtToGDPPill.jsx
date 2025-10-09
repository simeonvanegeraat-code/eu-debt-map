// components/DebtToGDPPill.jsx
"use client";

export default function DebtToGDPPill({ ratioPct }) {
  if (!Number.isFinite(ratioPct) || ratioPct <= 0) return null;

  const pct = Math.max(0, Math.min(300, ratioPct));
  const color =
    pct < 60 ? "var(--ok)" : pct < 90 ? "var(--warn)" : "var(--bad)";

  return (
    <span
      title="Debt as a share of GDP (live estimate)"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: "#fff",
        boxShadow: "var(--shadow-sm)",
        fontSize: 13,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
      <strong style={{ fontWeight: 700 }}>Debt/GDP:</strong>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{pct.toFixed(0)}%</span>
    </span>
  );
}
