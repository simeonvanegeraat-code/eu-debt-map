"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries, interpolateDebt } from "@/lib/data";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";

export default function CountryPage({ params: { code } }) {
  const country = useMemo(() => {
    return countries.find(x => x.code.toLowerCase() === String(code).toLowerCase()) || null;
  }, [code]);

  // Vloeiende/live updates
  const [nowMs, setNowMs] = useState(Date.now());
  const rafRef = useRef(0);
  useEffect(() => {
    const tick = () => {
      setNowMs(Date.now());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (!country) {
    return <main className="container card">Unknown country code: {String(code).toUpperCase()}</main>;
  }

  const current = interpolateDebt(country, nowMs);
  const delta = country.last_value_eur - country.prev_value_eur;
  const trendUp = delta > 0;

  // kleine sparkline voor sfeer
  const spark = useMemo(() => {
    const pts = 30;
    const t0 = new Date(country.prev_date).getTime();
    const t1 = new Date(country.last_date).getTime();
    const out = [];
    for (let i = 0; i <= pts; i++) {
      const t = t0 + (t1 - t0) * (i / pts);
      out.push({ t, v: interpolateDebt(country, t) });
    }
    return out;
  }, [country]);

  const nf = new Intl.NumberFormat("en-GB");

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <a className="btn" href="/">← Back</a>
        <h2 style={{ marginTop: 12 }}>{country.flag} {country.name}</h2>
        <div className="mono" style={{ fontSize: "28px", fontWeight: 700 }}>
          Current estimate: €{nf.format(Math.round(current))}
        </div>
        {/* Datum/“rising/falling” regel is bewust weggelaten */}
      </section>

      <section className="card" style={{ gridColumn: "1 / -1", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spark}>
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip formatter={(v)=> new Intl.NumberFormat("en-GB").format(Math.round(v))} labelFormatter={()=> ""} />
            <Line type="monotone" dataKey="v" dot={false} stroke={trendUp ? "#ef4444" : "#22c55e"} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </main>
  );
}
