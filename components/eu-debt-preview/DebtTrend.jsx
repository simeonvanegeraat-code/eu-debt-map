"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./eu-debt-preview.module.css";

const amount = (value) => `€ ${new Intl.NumberFormat("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 1e12)} bln.`;

const axisValue = (value) => new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 1 }).format(value / 1e12);

function EndpointLabel({ viewBox, value, end }) {
  if (!viewBox || !Number.isFinite(viewBox.x) || !Number.isFinite(viewBox.y)) return null;
  return <text x={viewBox.x + (end ? -10 : 10)} y={viewBox.y - 18} textAnchor={end ? "end" : "start"} fill="#244c8c" fontSize={13} fontWeight={700}>{amount(value)}</text>;
}

export default function DebtTrend({ rows }) {
  const [selected, setSelected] = useState(rows.length - 1);
  const values = rows.map((row) => row.totalDebtEUR);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = 1e12;
  const lower = Math.max(0, Math.floor((min - (max - min) * 0.12) / step) * step);
  const upper = Math.ceil((max + (max - min) * 0.12) / step) * step;
  const ticks = Array.from({ length: Math.round((upper - lower) / step) + 1 }, (_, index) => lower + index * step);
  const first = rows[0];
  const last = rows.at(-1);
  const point = rows[selected];

  function selectChartQuarter(state) {
    const index = state?.activeTooltipIndex;
    if (Number.isInteger(index) && index >= 0 && index < rows.length) setSelected(index);
  }

  return <div className={styles.chartCard}>
    <div className={styles.chartHeading}><div><span>Opgetelde overheidsschuld · biljoen euro</span><h3>Vijf jaar officiële kwartaalcijfers</h3></div><span className={styles.chartBadge}>{first.quarter} — {last.quarter}</span></div>
    <div className={styles.chartReadout}>
      <div><span>Geselecteerd kwartaal</span><output htmlFor="eu-debt-quarter" aria-live="polite"><span data-selected-quarter>{point.quarter}</span><strong data-selected-debt>{amount(point.totalDebtEUR)}</strong></output></div>
      <p>Wijs een punt aan, tik op de grafiek of gebruik de schuifregelaar.</p>
    </div>
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart accessibilityLayer data={rows} onMouseMove={selectChartQuarter} onClick={selectChartQuarter} margin={{ top: 34, right: 18, left: 0, bottom: 8 }}>
          <defs><linearGradient id="preview-eu-debt-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2868f0" stopOpacity={0.22} /><stop offset="100%" stopColor="#2868f0" stopOpacity={0.01} /></linearGradient></defs>
          <CartesianGrid vertical={false} stroke="#d6e0ee" strokeDasharray="3 5" />
          <XAxis dataKey="quarter" tick={{ fontSize: 13, fill: "#4c5f79" }} axisLine={false} tickLine={false} minTickGap={48} interval="preserveStartEnd" />
          <YAxis domain={[lower, upper]} ticks={ticks} width={45} tickFormatter={axisValue} tick={{ fontSize: 13, fill: "#4c5f79" }} axisLine={false} tickLine={false} />
          <Tooltip content={() => null} cursor={false} />
          <Area type="linear" dataKey="totalDebtEUR" stroke="#2868f0" strokeWidth={3} fill="url(#preview-eu-debt-fill)" isAnimationActive={false} activeDot={false} />
          <ReferenceLine x={point.quarter} stroke="#7399d1" strokeDasharray="4 5" />
          <ReferenceDot x={first.quarter} y={first.totalDebtEUR} r={3} fill="#2868f0" stroke="#fff" label={<EndpointLabel value={first.totalDebtEUR} />} />
          <ReferenceDot x={last.quarter} y={last.totalDebtEUR} r={3} fill="#2868f0" stroke="#fff" label={<EndpointLabel value={last.totalDebtEUR} end />} />
          <ReferenceDot x={point.quarter} y={point.totalDebtEUR} r={6} fill="#2868f0" stroke="#fff" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <p className={styles.scaleNote}>Let op: de verticale schaal begint bij {axisValue(lower)} biljoen euro, niet bij nul.</p>
    <div className={styles.quarterControl}><label htmlFor="eu-debt-quarter">Kies een kwartaal <span>Ook te bedienen met de pijltjestoetsen</span></label><input id="eu-debt-quarter" type="range" min="0" max={rows.length - 1} value={selected} aria-valuetext={`${point.quarter}: ${amount(point.totalDebtEUR)}`} onChange={(event) => setSelected(Number(event.target.value))} /><span className={styles.quarterCount}>{selected + 1} / {rows.length}</span></div>
    <details className={styles.historyTable}><summary>Alle {rows.length} kwartaalcijfers bekijken</summary><table><caption>Opgetelde overheidsschuld EU-27 in biljoen euro, afgerond op twee decimalen</caption><thead><tr><th scope="col">Kwartaal</th><th scope="col">Schuld (bln.)</th></tr></thead><tbody>{rows.map((row) => <tr key={row.quarter}><th scope="row">{row.quarter}</th><td>{amount(row.totalDebtEUR)}</td></tr>)}</tbody></table></details>
  </div>;
}
