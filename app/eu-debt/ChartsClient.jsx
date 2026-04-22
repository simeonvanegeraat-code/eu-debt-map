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

function formatTrillions(value) {
  return `€${(value / 1e12).toFixed(1)}tn`;
}

function formatBillions(value) {
  return `€${(value / 1e9).toFixed(0)}bn`;
}

function formatShare(value) {
  return `${value.toFixed(1)}%`;
}

function buildHistoryDomain(rows) {
  if (!rows.length) return [0, 1];

  const values = rows.map((r) => Number(r.totalDebtEUR) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const spread = Math.max(max - min, 1);
  const padding = spread * 0.18;

  const lower = Math.max(0, min - padding);
  const upper = max + padding;

  return [lower, upper];
}

function buildBreakdownData(rows) {
  if (!rows.length) return [];

  const top = rows.slice(0, 7);
  const rest = rows.slice(7);

  const restValue = rest.reduce((sum, row) => sum + (Number(row.valueEUR) || 0), 0);
  const restShare = rest.reduce((sum, row) => sum + (Number(row.sharePct) || 0), 0);

  const data = [...top];

  if (restValue > 0) {
    data.push({
      code: "REST",
      name: "Rest of EU",
      valueEUR: restValue,
      sharePct: restShare,
      shareLabel: formatShare(restShare),
      href: "/",
      isRest: true,
    });
  }

  return data;
}

function HistoryTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const value = Number(payload[0]?.value || 0);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: "12px 14px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 16, color: "#111827", fontWeight: 800 }}>
        {formatTrillions(value)}
      </div>
    </div>
  );
}

function BreakdownTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: "12px 14px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, color: "#111827", fontWeight: 800, marginBottom: 2 }}>
        {formatBillions(Number(row.valueEUR || 0))}
      </div>
      <div style={{ fontSize: 13, color: "#4b5563" }}>
        Share of total: {formatShare(Number(row.sharePct || 0))}
      </div>
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
      <text
        x={cx}
        y={cy - 14}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#1f2937"
      >
        {payload?.quarter}
      </text>
    </g>
  );
}

export default function ChartsClient({ historyRows = [], breakdownRows = [] }) {
  const historyDomain = buildHistoryDomain(historyRows);
  const latestHistoryPoint = historyRows.length ? historyRows[historyRows.length - 1] : null;
  const breakdownData = buildBreakdownData(breakdownRows);

  const sectionTitle = {
    fontSize: "1.15rem",
    fontWeight: 800,
    color: "#111827",
    margin: "0 0 10px",
    fontFamily: "var(--font-display, sans-serif)",
    letterSpacing: "-0.01em",
  };

  const sectionIntro = {
    fontSize: "0.98rem",
    lineHeight: 1.65,
    color: "#6b7280",
    margin: "0 0 16px",
  };

  const chartCard = {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  };

  return (
    <>
      <section style={{ margin: "28px 0 40px" }}>
        <h2 style={sectionTitle}>EU debt over the last 5 years</h2>
        <p style={sectionIntro}>
          The combined EU-27 debt pile has climbed steadily over the past 20 quarters. This chart
          focuses on the movement itself, so the scale starts near the actual range instead of zero.
        </p>

        <div style={chartCard}>
          <div style={{ width: "100%", height: 430 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={historyRows}
                margin={{ top: 20, right: 24, left: 4, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="euDebtFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.03} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#e5e7eb"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="quarter"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={28}
                  interval="preserveStartEnd"
                />

                <YAxis
                  domain={historyDomain}
                  tickFormatter={formatTrillions}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />

                <Tooltip content={<HistoryTooltip />} />

                <Area
                  type="monotone"
                  dataKey="totalDebtEUR"
                  stroke="#1d4ed8"
                  strokeWidth={3}
                  fill="url(#euDebtFill)"
                  isAnimationActive={false}
                  dot={(props) => (
                    <LatestPointDot
                      {...props}
                      dataLength={historyRows.length}
                    />
                  )}
                  activeDot={{ r: 5, strokeWidth: 0, fill: "#1d4ed8" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {latestHistoryPoint && (
            <div
              style={{
                marginTop: 14,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                fontSize: 14,
                color: "#4b5563",
              }}
            >
              <div>
                <strong style={{ color: "#111827" }}>Latest point:</strong>{" "}
                {latestHistoryPoint.quarter}
              </div>
              <div>
                <strong style={{ color: "#111827" }}>Total:</strong>{" "}
                {formatTrillions(latestHistoryPoint.totalDebtEUR)}
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ margin: "20px 0 40px" }}>
        <h2 style={sectionTitle}>Where the debt sits by country</h2>
        <p style={sectionIntro}>
          Most of the combined EU debt pile sits in a small number of large economies. Grouping the
          smaller shares into “Rest of EU” makes the distribution easier to read.
        </p>

        <div style={chartCard}>
          <div style={{ width: "100%", height: 430 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={breakdownData}
                layout="vertical"
                margin={{ top: 6, right: 30, left: 20, bottom: 6 }}
                barCategoryGap={12}
              >
                <CartesianGrid
                  stroke="#e5e7eb"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  type="number"
                  tickFormatter={formatBillions}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={92}
                  tick={{ fontSize: 12, fill: "#374151" }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip content={<BreakdownTooltip />} />

                <Bar dataKey="valueEUR" radius={[0, 8, 8, 0]} isAnimationActive={false}>
                  {breakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.code}-${index}`}
                      fill={entry.isRest ? "#93c5fd" : "#2563eb"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 10,
            }}
          >
            {breakdownData.slice(0, 4).map((row) => (
              <div
                key={row.code}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "10px 12px",
                  background: "#f9fafb",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  {row.name}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: "#111827",
                    fontWeight: 800,
                    marginBottom: 2,
                  }}
                >
                  {formatBillions(row.valueEUR)}
                </div>
                <div style={{ fontSize: 12, color: "#4b5563" }}>
                  {formatShare(row.sharePct)} of total
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}