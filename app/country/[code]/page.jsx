"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { countries, interpolateDebt } from "@/lib/data";
import CountryFacts from "./CountryFacts";

export default function CountryPage({ params: { code } }) {
  const country = useMemo(() => {
    const want = String(code).toLowerCase();
    return countries.find((x) => x.code.toLowerCase() === want) || null;
  }, [code]);

  const [nowMs, setNowMs] = useState(() => Date.now());
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(() => setNowMs(Date.now()), 120);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, []);

  if (!country) {
    return (
      <main className="container card">
        Unknown country: {String(code).toUpperCase()}
      </main>
    );
  }

  const current = interpolateDebt(country, nowMs);
  const nf = new Intl.NumberFormat("en-GB");

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <Link className="btn" href="/" prefetch>
          ← Back
        </Link>

        <h2 style={{ marginTop: 12 }}>
          {country.flag} {country.name}
        </h2>

        <div
          className="mono"
          style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}
          aria-live="polite"
        >
          Current estimate: €{nf.format(Math.round(current))}
        </div>

        {/* Infobox met details */}
        <CountryFacts code={country.code} />
      </section>
    </main>
  );
}
