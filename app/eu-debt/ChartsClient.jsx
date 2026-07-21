"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const TEXT = {
  en: {
    locale: "en-GB",
    trillion: "tn",
    billion: "bn",
    rest: "Rest of EU",
    shareOfTotal: "Share of total",
    historyTitle: "EU debt over the last 5 years",
    historyIntro:
      "The combined EU-27 debt pile has climbed steadily over the past 20 quarters. This chart focuses on the movement itself, so the scale starts near the actual range instead of zero.",
    latestPoint: "Latest point",
    total: "Total",
    breakdownTitle: "Where the debt sits by country",
    breakdownIntro:
      "Most of the combined EU debt pile sits in a small number of large economies. Grouping the smaller shares into ‘Rest of EU’ makes the distribution easier to read.",
    ofTotal: "of total",
  },
  nl: {
    locale: "nl-NL",
    trillion: "bln",
    billion: "mld",
    rest: "Rest van de EU",
    shareOfTotal: "Aandeel van totaal",
    historyTitle: "EU-schuld in de afgelopen 5 jaar",
    historyIntro:
      "De gezamenlijke schuld van de EU-27 is in de afgelopen 20 kwartalen geleidelijk gestegen. De schaal begint dicht bij het werkelijke bereik, zodat de verandering goed zichtbaar blijft.",
    latestPoint: "Laatste punt",
    total: "Totaal",
    breakdownTitle: "Verdeling van de schuld per land",
    breakdownIntro:
      "Een groot deel van de gezamenlijke EU-schuld ligt bij een beperkt aantal grote economieën. Kleinere aandelen zijn samengevoegd als ‘Rest van de EU’ om de verdeling leesbaar te houden.",
    ofTotal: "van totaal",
  },
  de: {
    locale: "de-DE",
    trillion: "Bio.",
    billion: "Mrd.",
    rest: "Rest der EU",
    shareOfTotal: "Anteil an der Gesamtsumme",
    historyTitle: "EU-Schulden in den vergangenen 5 Jahren",
    historyIntro:
      "Die gemeinsame Schuldsumme der EU-27 ist in den vergangenen 20 Quartalen stetig gestiegen. Die Skala beginnt nahe am tatsächlichen Wertebereich, damit die Veränderung klar erkennbar bleibt.",
    latestPoint: "Letzter Wert",
    total: "Gesamt",
    breakdownTitle: "Verteilung der Schulden nach Ländern",
    breakdownIntro:
      "Ein großer Teil der gemeinsamen EU-Schulden entfällt auf wenige große Volkswirtschaften. Kleinere Anteile werden als ‘Rest der EU’ zusammengefasst, damit die Verteilung leichter lesbar ist.",
    ofTotal: "der Gesamtsumme",
  },
  fr: {
    locale: "fr-FR",
    trillion: "Bn",
    billion: "Md",
    rest: "Reste de l’UE",
    shareOfTotal: "Part du total",
    historyTitle: "Dette de l’UE sur les 5 dernières années",
    historyIntro:
      "La dette cumulée de l’UE-27 a progressé régulièrement au cours des 20 derniers trimestres. L’échelle commence près de la plage réelle afin de rendre le mouvement plus visible.",
    latestPoint: "Dernier point",
    total: "Total",
    breakdownTitle: "Répartition de la dette par pays",
    breakdownIntro:
      "Une grande partie de la dette cumulée de l’UE se concentre dans quelques grandes économies. Les parts plus petites sont regroupées sous ‘Reste de l’UE’ pour faciliter la lecture.",
    ofTotal: "du total",
  },
};

function safeLang(lang) {
  return TEXT[lang] ? lang : "en";
}

function formatTrillions(value, lang) {
  const t = TEXT[safeLang(lang)];
  const formatted = new Intl.NumberFormat(t.locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 1e12);
  return `€${formatted} ${t.trillion}`;
}

function formatBillions(value, lang) {
  const t = TEXT[safeLang(lang)];
  const formatted = new Intl.NumberFormat(t.locale, {
    maximumFractionDigits: 0,
  }).format(value / 1e9);
  return `€${formatted} ${t.billion}`;
}

function formatShare(value, lang) {
  const t = TEXT[safeLang(lang)];
  return new Intl.NumberFormat(t.locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value) + "%";
}

function buildHistoryDomain(rows) {
  if (!rows.length) return [0, 1];
  const values = rows.map((r) => Number(r.totalDebtEUR) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = Math.max(max - min, 1);
  const padding = spread * 0.18;
  return [Math.max(0, min - padding), max + padding];
}

function buildBreakdownData(rows, lang) {
  if (!rows.length) return [];
  const t = TEXT[safeLang(lang)];
  const top = rows.slice(0, 7);
  const rest = rows.slice(7);
  const restValue = rest.reduce((sum, row) => sum + (Number(row.valueEUR) || 0), 0);
  const restShare = rest.reduce((sum, row) => sum + (Number(row.sharePct) || 0), 0);
  const data = [...top];

  if (restValue > 0) {
    data.push({
      code: "REST",
      name: t.rest,
      valueEUR: restValue,
      sharePct: restShare,
      shareLabel: formatShare(restShare, lang),
      isRest: true,
    });
  }

  return data;
}

function HistoryTooltip({ active, payload, label, lang }) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value || 0);

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "12px 14px", boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 16, color: "#111827", fontWeight: 800 }}>{formatTrillions(value, lang)}</div>
    </div>
  );
}

function BreakdownTooltip({ active, payload, label, lang }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  const t = TEXT[safeLang(lang)];

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "12px 14px", boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 15, color: "#111827", fontWeight: 800, marginBottom: 2 }}>{formatBillions(Number(row.valueEUR || 0), lang)}</div>
      <div style={{ fontSize: 13, color: "#4b5563" }}>{t.shareOfTotal}: {formatShare(Number(row.sharePct || 0), lang)}</div>
    </div>
  );
}

function LatestPointDot(props) {
  const { cx, cy, index, payload, dataLength } = props;
  if (index !== dataLength - 1) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#1d4ed8" stroke="#ffffff" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={9} fill="rgba(37,99,235,0.12)" />
      <text x={cx} y={cy - 14} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1f2937">{payload?.quarter}</text>
    </g>
  );
}

export default function ChartsClient({ historyRows = [], breakdownRows = [], lang = "en" }) {
  const safe = safeLang(lang);
  const t = TEXT[safe];
  const historyDomain = buildHistoryDomain(historyRows);
  const latestHistoryPoint = historyRows.length ? historyRows[historyRows.length - 1] : null;
  const breakdownData = buildBreakdownData(breakdownRows, safe);

  const sectionTitle = { fontSize: "1.15rem", fontWeight: 800, color: "#111827", margin: "0 0 10px", fontFamily: "var(--font-display, sans-serif)", letterSpacing: "-0.01em" };
  const sectionIntro = { fontSize: "0.98rem", lineHeight: 1.65, color: "#6b7280", margin: "0 0 16px" };
  const chartCard = { width: "100%", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 18, boxShadow: "0 8px 24px rgba(0,0,0,0.04)" };

  return (
    <>
      <section style={{ margin: "28px 0 40px" }}>
        <h2 style={sectionTitle}>{t.historyTitle}</h2>
        <p style={sectionIntro}>{t.historyIntro}</p>

        <div style={chartCard}>
          <div style={{ width: "100%", height: 430 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyRows} margin={{ top: 20, right: 24, left: 4, bottom: 8 }}>
                <defs>
                  <linearGradient id="euDebtFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} minTickGap={28} interval="preserveStartEnd" />
                <YAxis domain={historyDomain} tickFormatter={(value) => formatTrillions(value, safe)} tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} width={72} />
                <Tooltip content={<HistoryTooltip lang={safe} />} />
                <Area type="monotone" dataKey="totalDebtEUR" stroke="#1d4ed8" strokeWidth={3} fill="url(#euDebtFill)" isAnimationActive={false} dot={(props) => <LatestPointDot {...props} dataLength={historyRows.length} />} activeDot={{ r: 5, strokeWidth: 0, fill: "#1d4ed8" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {latestHistoryPoint && (
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 14, color: "#4b5563" }}>
              <div><strong style={{ color: "#111827" }}>{t.latestPoint}:</strong> {latestHistoryPoint.quarter}</div>
              <div><strong style={{ color: "#111827" }}>{t.total}:</strong> {formatTrillions(latestHistoryPoint.totalDebtEUR, safe)}</div>
            </div>
          )}
        </div>
      </section>

      <section style={{ margin: "20px 0 40px" }}>
        <h2 style={sectionTitle}>{t.breakdownTitle}</h2>
        <p style={sectionIntro}>{t.breakdownIntro}</p>

        <div style={chartCard}>
          <div style={{ width: "100%", height: 430 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} layout="vertical" margin={{ top: 6, right: 30, left: 20, bottom: 6 }} barCategoryGap={12}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" tickFormatter={(value) => formatBillions(value, safe)} tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={92} tick={{ fontSize: 12, fill: "#374151" }} tickLine={false} axisLine={false} />
                <Tooltip content={<BreakdownTooltip lang={safe} />} />
                <Bar dataKey="valueEUR" radius={[0, 8, 8, 0]} isAnimationActive={false}>
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${entry.code}-${index}`} fill={entry.isRest ? "#93c5fd" : "#2563eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
            {breakdownData.slice(0, 4).map((row) => (
              <div key={row.code} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", background: "#f9fafb" }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4, fontWeight: 600 }}>{row.name}</div>
                <div style={{ fontSize: 15, color: "#111827", fontWeight: 800, marginBottom: 2 }}>{formatBillions(row.valueEUR, safe)}</div>
                <div style={{ fontSize: 12, color: "#4b5563" }}>{formatShare(row.sharePct, safe)} {t.ofTotal}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
