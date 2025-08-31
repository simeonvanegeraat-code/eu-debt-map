"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries, interpolateDebt } from "@/lib/data";

// (Optioneel) forceer dat dit segment niet per ongeluk statisch blijft
export const dynamic = "force-dynamic";

export default function CountryPage({ params: { code } }) {
  // 1) Vind land
  const country = useMemo(() => {
    const want = String(code).toLowerCase();
    return countries.find((x) => x.code.toLowerCase() === want) || null;
  }, [code]);

  // 2) Hydration check (als deze 'true' wordt, draait client JS)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // 3) Eenvoudige, betrouwbare ticker
  const [nowMs, setNowMs] = useState(() => Date.now());
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(() => setNowMs(Date.now()), 100);
    return () => timerRef.current && clearInterval(timerRef.current);
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

        {/* Hydration + tick diagnose */}
        <div className="tag" style={{ marginBottom: 6 }}>
          client: {hydrated ? "✅" : "⏳"} • tick: {nowMs}
        </div>

        <div className="mono" style={{ fontSize: 28, fontWeight: 700 }}>
          Current estimate: €{nf.format(Math.round(current))}
        </div>
      </section>
    </main>
  );
}
