"use client";

const TEXT = {
  en: {
    label: "Debt/GDP:",
    title: "Debt as a share of GDP (live estimate)",
  },
  nl: {
    label: "Schuld/bbp:",
    title: "Schuld als aandeel van het bbp (live schatting)",
  },
  de: {
    label: "Schulden/BIP:",
    title: "Schulden als Anteil des BIP (Live-Schätzung)",
  },
  fr: {
    label: "Dette/PIB :",
    title: "Dette en pourcentage du PIB (estimation en direct)",
  },
};

export default function DebtToGDPPill({ ratioPct, lang = "en" }) {
  if (!Number.isFinite(ratioPct) || ratioPct <= 0) return null;

  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = TEXT[effLang] || TEXT.en;

  const pct = Math.max(0, Math.min(300, ratioPct));
  const color =
    pct < 60 ? "var(--ok)" : pct < 90 ? "var(--warn)" : "var(--bad)";

  return (
    <span
      title={t.title}
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
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: color,
        }}
      />
      <strong style={{ fontWeight: 700 }}>{t.label}</strong>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>
        {pct.toFixed(0)}%
      </span>
    </span>
  );
}