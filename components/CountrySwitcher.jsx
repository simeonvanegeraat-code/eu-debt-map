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
    return filtered
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 12);
  }, [q]);

  return (
    <div className="card" style={{ padding: 12 }}>
      <label className="mono text-slate-400 text-xs">Change country</label>

      <div className="flex items-center gap-2 mt-2 mb-3">
        <div className="rounded-xl border border-slate-800 flex items-center px-3 py-2 w-full bg-[#0b1220]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400">
            <path d="M10 18a8 8 0 1 1 6.32-3.1l4.39 4.38-1.41 1.42-4.39-4.39A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/>
          </svg>
          <input
            className="input"
            placeholder="Search by name or code…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", width: "100%", marginLeft: 8 }}
            aria-label="Search country"
          />
        </div>
      </div>

      <ul className="space-y-2 max-h-64 overflow-auto pr-1">
        {list.map((c) => {
          const active = String(c.code).toLowerCase() === String(currentCode).toLowerCase();
          return (
            <li key={c.code}>
              <button
                onClick={() => router.push(`/country/${String(c.code).toLowerCase()}`)}
                className="w-full text-left rounded-xl border border-slate-800 hover:border-slate-700 px-3 py-2 flex items-center justify-between"
                aria-label={`Go to ${c.name}`}
              >
                <span className="flex items-center gap-2">
                  <span style={{ fontSize: 18 }}>{c.flag}</span>
                  <span>{c.name}</span>
                </span>
                <span className={`mono text-xs ${active ? "text-slate-200" : "text-slate-400"}`}>
                  {c.code}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
