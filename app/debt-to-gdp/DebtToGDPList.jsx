// app/debt-to-gdp/DebtToGDPList.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { countries, interpolateDebt } from "@/lib/data";
import { countryName } from "@/lib/countries";

const nf0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

function colorFor(pct) {
  if (!Number.isFinite(pct)) return "#cbd5e1";
  return pct < 60 ? "var(--ok)" : pct < 90 ? "#f59e0b" /* amber */ : "var(--bad)";
}

function Row({ c, nowMs, gdpEUR, rank }) {
  const debtNow = useMemo(() => interpolateDebt(c, nowMs), [c, nowMs]);
  const ratio = Number.isFinite(gdpEUR) && gdpEUR > 0 ? (debtNow / gdpEUR) * 100 : null;

  const pct = Math.max(0, Math.min(200, Number.isFinite(ratio) ? ratio : 0));
  const fill = Math.min(100, pct); // visueel tot 100% vullen
  const col = colorFor(pct);

  return (
    <div
      className="card"
      style={{
        padding: 12,
        borderRadius: 12,
        display: "grid",
        gridTemplateColumns: "42px minmax(180px, 1fr) minmax(120px,180px)",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div className="mono tag" style={{ textAlign: "right" }}>#{rank}</div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
          <strong>{c.flag ? <span style={{ marginRight: 6 }}>{c.flag}</span> : null}{countryName(c.code, "en")}</strong>
          <span className="tag" style={{ fontVariantNumeric: "tabular-nums" }}>
            Debt: €{nf0.format(Math.round(debtNow))}
          </span>
        </div>

        {/* ratio bar */}
        <div
          aria-label={`Debt to GDP bar for ${countryName(c.code, "en")}`}
          style={{
            height: 10,
            borderRadius: 999,
            background: "#e5edff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${fill}%`,
              height: "100%",
              background: col,
              borderRadius: 999,
              transition: "width .4s ease",
            }}
          />
        </div>

        {/* legend compact */}
        <div className="tag" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, background: "var(--ok)", borderRadius: 999 }} />
            &lt;60%
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: 999 }} />
            60–90%
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, background: "var(--bad)", borderRadius: 999 }} />
            &gt;90%
          </span>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div
          className="mono"
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "#fff",
            minWidth: 68,
            textAlign: "center",
            color: col,
            fontWeight: 700,
          }}
          title="Debt as a share of GDP (live estimate)"
        >
          {Number.isFinite(pct) ? `${Math.round(pct)}%` : "—"}
        </div>
        <div className="tag" style={{ marginTop: 6 }}>
          <Link href={`/country/${c.code.toLowerCase()}`}>Open country →</Link>
        </div>
      </div>
    </div>
  );
}

export default function DebtToGDPList() {
  const list = (Array.isArray(countries) ? countries : []).slice();
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [gdpMap, setGdpMap] = useState({}); // { NL: number|null, ... }
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("desc"); // desc = worst first

  // light timer voor “live” ranks (niet te snel om jank te voorkomen)
  const tRef = useRef(null);
  useEffect(() => {
    tRef.current = setInterval(() => setNowMs(Date.now()), 500);
    return () => tRef.current && clearInterval(tRef.current);
  }, []);

  // fetch all GDPs via API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/gdp-all", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled && json?.ok && Array.isArray(json.items)) {
          const acc = {};
          for (const it of json.items) acc[it.geo] = Number.isFinite(it.gdp_eur) ? it.gdp_eur : null;
          setGdpMap(acc);
        }
      } catch {
        // ignore
      } finally {
        !cancelled && setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // bereken ratio per land
  const rows = useMemo(() => {
    const out = list.map((c) => {
      const debt = interpolateDebt(c, nowMs);
      const gdp = gdpMap[String(c.code).toUpperCase()];
      const ratio = Number.isFinite(gdp) && gdp > 0 ? (debt / gdp) * 100 : null;
      return { c, ratio, debt, gdp };
    });
    out.sort((a, b) => {
      const ax = Number.isFinite(a.ratio) ? a.ratio : -1;
      const bx = Number.isFinite(b.ratio) ? b.ratio : -1;
      return order === "desc" ? bx - ax : ax - bx;
    });
    return out;
  }, [list, nowMs, gdpMap, order]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div className="tag">
          Live ranking by <strong>Debt / GDP</strong> (updates every ~0.5s).
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn"
            type="button"
            onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
            aria-label="Toggle sorting"
            title="Toggle sorting"
          >
            Sort: {order === "desc" ? "High → Low" : "Low → High"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="tag">Loading GDP from Eurostat…</div>
      )}

      {rows.map((row, i) => (
        <Row key={row.c.code} c={row.c} nowMs={nowMs} gdpEUR={row.gdp} rank={i + 1} />
      ))}

      <div className="tag" style={{ marginTop: 8 }}>
        Source: Eurostat (government debt & nominal GDP; GDP latest available period). Ratios are live estimates.
      </div>
    </div>
  );
}
