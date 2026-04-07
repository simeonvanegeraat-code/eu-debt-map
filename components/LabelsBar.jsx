"use client";

import { useMemo } from "react";

const LABELS = {
  en: {
    euRank: "EU rank",
    debtToGdp: "Debt-to-GDP",
    perPerson: "Per person",
  },
  nl: {
    euRank: "EU-rang",
    debtToGdp: "Schuld/bbp",
    perPerson: "Per persoon",
  },
  de: {
    euRank: "EU-Rang",
    debtToGdp: "Schulden/BIP",
    perPerson: "Pro Person",
  },
  fr: {
    euRank: "Rang UE",
    debtToGdp: "Dette/PIB",
    perPerson: "Par habitant",
  },
};

const LOCALES = {
  en: "en-GB",
  nl: "nl-NL",
  de: "de-DE",
  fr: "fr-FR",
};

export default function LabelsBar({ country, valueNow, lang = "en" }) {
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = LABELS[effLang] || LABELS.en;
  const numberLocale = LOCALES[effLang] || "en-GB";

  const items = useMemo(() => {
    const arr = [];
    const nf0 = new Intl.NumberFormat(numberLocale, {
      maximumFractionDigits: 0,
    });

    // Rank (verwacht property 'rank' of 'rankEU')
    const rank = country?.rank ?? country?.rankEU;
    if (typeof rank === "number" || typeof rank === "string") {
      arr.push({ label: t.euRank, value: `#${rank}` });
    }

    // Debt-to-GDP (verwacht property 'debtToGdp' als percentage 0..100)
    const dtg = country?.debtToGdp ?? country?.debt_to_gdp;
    if (typeof dtg === "number") {
      arr.push({ label: t.debtToGdp, value: `${dtg.toFixed(1)}%` });
    }

    // Per person (verwacht 'population')
    const pop = country?.population;
    if (typeof pop === "number" && pop > 0 && typeof valueNow === "number") {
      const per = Math.round(valueNow / pop);
      arr.push({ label: t.perPerson, value: `€${nf0.format(per)}` });
    }

    return arr;
  }, [country, valueNow, numberLocale, t]);

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