// components/LabelsBar.jsx
import { useMemo } from "react";

export default function LabelsBar({ country, valueNow }) {
  const items = useMemo(() => {
    const arr = [];

    // Rank (verwacht property 'rank' of 'rankEU')
    const rank = country?.rank ?? country?.rankEU;
    if (typeof rank === "number" || typeof rank === "string") {
      arr.push({ label: `EU rank`, value: `#${rank}` });
    }

    // Debt-to-GDP (verwacht property 'debtToGdp' als percentage 0..100)
    const dtg = country?.debtToGdp ?? country?.debt_to_gdp;
    if (typeof dtg === "number") {
      arr.push({ label: "Debt-to-GDP", value: `${dtg.toFixed(1)}%` });
    }

    // Per person (verwacht 'population')
    const pop = country?.population;
    if (typeof pop === "number" && pop > 0 && typeof valueNow === "number") {
      const per = Math.round(valueNow / pop);
      arr.push({ label: "Per person", value: `€${per.toLocaleString("en-GB")}` });
    }

    return arr;
  }, [country, valueNow]);

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((it, i) => (
        <span
          key={i}
          className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700"
          title={it.label}
          aria-label={`${it.label}: ${it.value}`}
        >
          {it.label}: <strong className="ml-1">{it.value}</strong>
        </span>
      ))}
    </div>
  );
}
