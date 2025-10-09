// app/debt-to-gdp/DebtToGDPList.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { countries, interpolateDebt } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { getLocaleFromPathname } from "@/lib/locale";
import { t } from "@/lib/i18n";

const nf0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

function colorFor(pct) {
  if (!Number.isFinite(pct)) return "#cbd5e1";
  return pct < 60 ? "var(--ok)" : pct < 90 ? "#f59e0b" : "var(--bad)";
}

function Row({ c, nowMs, gdpEUR, rank, lang }) {
  const debtNow = useMemo(() => interpolateDebt(c, nowMs), [c, nowMs]);
  const ratio = Number.isFinite(gdpEUR) && gdpEUR > 0 ? (debtNow / gdpEUR) * 100 : null;

  const pct = Math.max(0, Math.min(200, Number.isFinite(ratio) ? ratio : 0));
  const fill = Math.min(100, pct);
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
          <strong>
            {c.flag ? <span style={{ marginRight: 6 }}>{c.flag}</span> : null}
            {countryName(c.code, lang)}
          </strong>
          <span className="tag" style={{ fontVariantNumeric: "tabular-nums" }}>
            Debt: €{nf0.format(Math.round(debtNow))}
          </span>
        </div>

        <div
          aria-label={`Debt to GDP bar for ${countryName(c.code, lang)}`}
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

        <div className="tag" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, background: "var(--ok)", borderRadius: 999 }} />
            {t(lang, "dtg.legend.low")}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: 999 }} />
            {t(lang, "dtg.legend.mid")}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, background: "var(--bad)", borderRadius: 999 }} />
            {t(lang, "dtg.legend.high")}
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
          <Link href={`/country/${c.code.toLowerCase()}`}>{t(lang, "dtg.openCountry")}</Link>
        </div>
      </div>
    </div>
  );
}

export default function DebtToGDPList({ lang: langProp }) {
  const pathname = usePathname() || "/";
  const fromUrl = getLocaleFromPathname ? getLocaleFromPathname(pathname) : "";
  const lang = langProp || fromUrl || "en";

  const list = (Array.isArray(countries) ? countries : []).slice();
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [gdpMap, setGdpMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("desc"); // worst first

  const tmr = useRef(null);
  useEffect(() => {
    tmr.current = setInterval(() => setNowMs(Date.now()), 500);
    return () => tmr.current && clearInterval(tmr.current);
  }, []);

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
          {t(lang, "dtg.liveRank")} <strong>{t(lang, "dtg.debtGDP")}</strong> (updates every ~0.5s).
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn"
            type="button"
            onClick={() => setOrder((o) => (o === "desc" ? "asc" : "desc"))}
            aria-label="Toggle sorting"
            title="Toggle sorting"
          >
            {order === "desc" ? t(lang, "dtg.sortHighLow") : t(lang, "dtg.sortLowHigh")}
          </button>
        </div>
      </div>

      {loading && <div className="tag">{t(lang, "dtg.loading")}</div>}

      {rows.map((row, i) => (
        <Row key={row.c.code} c={row.c} nowMs={nowMs} gdpEUR={row.gdp} rank={i + 1} lang={lang} />
      ))}

      <div className="tag" style={{ marginTop: 8 }}>
        Source: Eurostat (government debt & nominal GDP; GDP latest available period). Ratios are live estimates.
      </div>
    </div>
  );
}
