"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries, interpolateDebt } from "@/lib/data";
import AdSlot from "@/components/AdSlot";
import { SLOTS } from "@/lib/ads";
import CountryFacts from "./CountryFacts";

function useTicker(ms = 120) {
  const [now, setNow] = useState(() => Date.now());
  const ref = useRef(null);
  useEffect(() => {
    ref.current = setInterval(() => setNow(Date.now()), ms);
    return () => ref.current && clearInterval(ref.current);
  }, [ms]);
  return now;
}

export default function CountryClient({ countryCode }) {
  // Zoek land veilig
  const country = useMemo(() => {
    const want = String(countryCode || "").toLowerCase();
    return countries.find((x) => x.code.toLowerCase() === want) || null;
  }, [countryCode]);

  const nowMs = useTicker(150);

  if (!country) {
    return (
      <main className="container card">
        Unknown country: {String(countryCode || "").toUpperCase()}
      </main>
    );
  }

  // Bereken huidig bedrag met robuuste interpolatie
  let current = interpolateDebt(country, nowMs);
  if (!Number.isFinite(current)) current = Number(country.last_value_eur) || 0;

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
          style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}
          aria-live="polite"
        >
          Current estimate: €{nf.format(Math.round(current))}
        </div>

        <p className="tag" style={{ marginTop: 8 }}>
          Based on Eurostat last two quarters ({country.prev_date} → {country.last_date}). Demo estimate
          with simple per-second interpolation.
        </p>

        {/* Compacte facts (trend, rate, bron) */}
        <CountryFacts code={country.code} />

        {/* AdSense slot (optioneel) */}
        <div style={{ marginTop: 12 }}>
          <AdSlot slot={SLOTS.countryUnder} />
        </div>
      </section>
    </main>
  );
}
