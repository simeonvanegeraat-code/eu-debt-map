"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries, interpolateDebt } from "@/lib/data";

export default function CountryPage({ params: { code } }) {
  // Find country (case-insensitive)
  const country = useMemo(() => {
    const want = String(code).toLowerCase();
    return countries.find((x) => x.code.toLowerCase() === want) || null;
  }, [code]);

  // Simple, robust ticker
  const [nowMs, setNowMs] = useState(() => Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    // update 10x per second so movement is obvious but still cheap
    timerRef.current = setInterval(() => setNowMs(Date.now()), 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!country) {
    return (
      <main className="container card">
        Unknown country code: {String(code).toUpperCase()}
      </main>
    );
  }

  const current = interpolateDebt(country, nowMs);
  const nf = new Intl.NumberFormat("en-GB");

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <a className="btn" href="/">← Back</a>
        <h2 style={{ marginTop: 12 }}>{country.flag} {country.name}</h2>
        <div className="mono" style={{ fontSize: 28, fontWeight: 700 }}>
          Current estimate: €{nf.format(Math.round(current))}
        </div>
      </section>
    </main>
  );
}
