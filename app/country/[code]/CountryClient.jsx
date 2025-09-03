"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries, interpolateDebt } from "@/lib/data";
// Als je AdSense gebruikt, laat onderstaande import staan; anders kun je ze verwijderen.
import AdSlot from "@/components/AdSlot";
import { SLOTS } from "@/lib/ads";

export default function CountryClient({ countryCode }) {
  const country = useMemo(() => {
    const want = String(countryCode).toLowerCase();
    return countries.find((x) => x.code.toLowerCase() === want) || null;
  }, [countryCode]);

  const [nowMs, setNowMs] = useState(() => Date.now());
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(() => setNowMs(Date.now()), 120);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, []);

  if (!country) {
    return (
      <main className="container card">
        Unknown country: {String(countryCode).toUpperCase()}
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

        <div className="mono" style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>
          Current estimate: €{nf.format(Math.round(current))}
        </div>

        <p className="tag" style={{ marginTop: 8 }}>
          Based on Eurostat last two quarters ({country.prev_date} → {country.last_date}). Demo estimate
          with simple per-second interpolation.
        </p>

        {/* AdSense slot (optioneel). Verwijder dit blok als je geen ads wil tonen hier. */}
        <div style={{ marginTop: 12 }}>
          <AdSlot slot={SLOTS.countryUnder} />
        </div>
      </section>
    </main>
  );
}
