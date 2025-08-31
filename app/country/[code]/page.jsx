"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries, interpolateDebt } from "@/lib/data";

export default function CountryPage({ params: { code } }) {
  const country = useMemo(() => {
    return countries.find(
      (x) => x.code.toLowerCase() === String(code).toLowerCase()
    ) || null;
  }, [code]);

  // Live teller
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
        <h2 style={{ marginTop: 12 }}>
          {country.flag} {country.name}
        </h2>
        <div
          className="mono"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          Current estimate: €{nf.format(Math.round(current))}
        </div>
      </section>
    </main>
  );
}
