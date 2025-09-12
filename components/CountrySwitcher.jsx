// components/CountrySwitcher.jsx
"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { countries } from "@/lib/data";

export default function CountrySwitcher({ currentCode }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = Array.isArray(countries) ? countries : [];
    const filtered = base.filter(c =>
      !s ||
      c.name.toLowerCase().includes(s) ||
      String(c.code).toLowerCase().includes(s)
    );

    // top 12 resultaten
    return filtered
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 12);
  }, [q]);

  return (
    <div className="card" style={{ padding: 12 }}>
      <label className="mono text-slate-400 text-xs">Switch country</label>
      <input
        className="input"
        placeholder="Search country or code…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ marginTop: 8, marginBottom: 8, width: "100%" }}
        aria-label="Search country"
      />
      <div className="flex flex-wrap gap-2">
        {list.map(c => {
          const active = String(c.code).toLowerCase() === String(currentCode).toLowerCase();
          return (
            <button
              key={c.code}
              onClick={() => router.push(`/country/${String(c.code).toLowerCase()}`)}
              className={`btn ${active ? "btn--active" : ""}`}
              aria-label={`Go to ${c.name}`}
              title={c.name}
            >
              {c.flag} {c.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}
