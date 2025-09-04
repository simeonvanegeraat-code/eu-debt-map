"use client";

import { useState } from "react";

/**
 * QuickList
 * - items: [{code, name, flag, trend}]
 * - initialCount: number (default 8)
 * - strings: {
 *     title, showAll, showLess, rising, falling, flat, more
 *   }
 */
export default function QuickList({ items, initialCount = 8, strings }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, initialCount);

  return (
    <section className="card" aria-label={strings?.title || "Quick list"}>
      <h3 style={{ marginTop: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{strings?.title || "Quick list"}</span>
        <button
          className="btn"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          style={{ padding: "4px 10px" }}
        >
          {expanded ? (strings?.showLess || "Show less") : (strings?.showAll || "Show all")}
        </button>
      </h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((row, idx) => {
          const hidden = !expanded && idx >= initialCount;
          const label =
            row.trend > 0 ? (strings?.rising || "↑ rising")
            : row.trend < 0 ? (strings?.falling || "↓ falling")
            : (strings?.flat || "→ flat");
          const color =
            row.trend > 0 ? "var(--bad)"
            : row.trend < 0 ? "var(--ok)"
            : "#9ca3af";

          return (
            <li
              key={row.code}
              style={{
                padding: "8px 0",
                borderBottom: "1px dashed #2b3444",
                display: hidden ? "none" : "block",
              }}
            >
              <a
                className="mono"
                href={`/country/${row.code.toLowerCase()}`}
                aria-label={`${row.name} — ${label}`}
              >
                {row.flag} {row.name} — <span style={{ color }}>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>

      {!expanded && items.length > initialCount && (
        <div className="tag" style={{ marginTop: 8 }}>
          +{items.length - initialCount} {strings?.more || "more"}
        </div>
      )}
    </section>
  );
}
