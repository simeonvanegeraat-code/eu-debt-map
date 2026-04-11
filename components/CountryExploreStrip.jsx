"use client";

import Link from "next/link";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";

const TEXT = {
  en: {
    title: "Compare with",
    home: "EU overview",
    openCountry: (name) => `Open ${name}`,
    openOverview: "Open EU overview",
  },
  nl: {
    title: "Vergelijk met",
    home: "EU-overzicht",
    openCountry: (name) => `Open ${name}`,
    openOverview: "Open EU-overzicht",
  },
  de: {
    title: "Vergleiche mit",
    home: "EU-Überblick",
    openCountry: (name) => `${name} öffnen`,
    openOverview: "EU-Überblick öffnen",
  },
  fr: {
    title: "Comparer avec",
    home: "Vue d’ensemble UE",
    openCountry: (name) => `Ouvrir ${name}`,
    openOverview: "Ouvrir la vue d’ensemble UE",
  },
};

const MAJOR_CODES = ["DE", "FR", "IT", "ES", "NL", "PL", "BE", "SE"];

function baseForLang(lang) {
  return lang && lang !== "en" ? `/${lang}` : "";
}

export default function CountryExploreStrip({ code, lang = "en" }) {
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = TEXT[effLang] || TEXT.en;
  const base = baseForLang(effLang);

  const list = Array.isArray(countries) ? [...countries] : [];
  const currentCode = String(code || "").toUpperCase();

  list.sort((a, b) => {
    const aName = countryName(a.code, effLang) || a.name || a.code;
    const bName = countryName(b.code, effLang) || b.name || b.code;
    return aName.localeCompare(bName, effLang);
  });

  const idx = list.findIndex(
    (c) => String(c.code).toUpperCase() === currentCode
  );

  const prev = idx >= 0 ? list[(idx - 1 + list.length) % list.length] : null;
  const next = idx >= 0 ? list[(idx + 1) % list.length] : null;

  const suggestions = [];

  function pushCountry(country) {
    if (!country) return;
    const cc = String(country.code || "").toUpperCase();
    if (!cc || cc === currentCode) return;
    if (suggestions.some((x) => String(x.code).toUpperCase() === cc)) return;
    suggestions.push(country);
  }

  pushCountry(prev);
  pushCountry(next);

  for (const cc of MAJOR_CODES) {
    const found = list.find((c) => String(c.code).toUpperCase() === cc);
    pushCountry(found);
  }

  const visible = suggestions.slice(0, 4);

  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(15,23,42,0.10)",
    background: "#ffffff",
    color: "#0b1220",
    textDecoration: "none",
    fontWeight: 600,
    whiteSpace: "nowrap",
    flex: "0 0 auto",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
  };

  return (
    <nav
      aria-label={t.title}
      style={{
        marginTop: 14,
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#64748b",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {t.title}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          paddingBottom: 2,
        }}
      >
        <Link
          href={base || "/"}
          aria-label={t.openOverview}
          title={t.home}
          style={chipStyle}
        >
          {t.home}
        </Link>

        {visible.map((country) => {
          const href = `${base}/country/${String(country.code).toLowerCase()}`;
          const name =
            countryName(country.code, effLang) || country.name || country.code;

          return (
            <Link
              key={country.code}
              href={href}
              aria-label={t.openCountry(name)}
              title={name}
              style={chipStyle}
            >
              {country.flag ? `${country.flag} ` : ""}
              {name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}