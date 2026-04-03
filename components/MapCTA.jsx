// components/MapCTA.jsx
import Link from "next/link";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";

const TEXT = {
  en: {
    title: "Explore the map",
    intro: (name) =>
      `View all EU countries and quickly switch to another one. Current: ${name}.`,
    openMap: "Open interactive map",
    openMapAria: "Open interactive map",
    goTo: (name) => `Go to ${name}`,
  },
  nl: {
    title: "Verken de kaart",
    intro: (name) =>
      `Bekijk alle EU-landen en schakel snel naar een ander land. Huidig land: ${name}.`,
    openMap: "Open interactieve kaart",
    openMapAria: "Open interactieve kaart",
    goTo: (name) => `Ga naar ${name}`,
  },
  de: {
    title: "Karte erkunden",
    intro: (name) =>
      `Alle EU-Länder anzeigen und schnell zu einem anderen Land wechseln. Aktuelles Land: ${name}.`,
    openMap: "Interaktive Karte öffnen",
    openMapAria: "Interaktive Karte öffnen",
    goTo: (name) => `Zu ${name} wechseln`,
  },
  fr: {
    title: "Explorer la carte",
    intro: (name) =>
      `Voir tous les pays de l’Union européenne et passer rapidement à un autre pays. Pays actuel : ${name}.`,
    openMap: "Ouvrir la carte interactive",
    openMapAria: "Ouvrir la carte interactive",
    goTo: (name) => `Aller vers ${name}`,
  },
};

export default function MapCTA({ code, name, lang = "en" }) {
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = TEXT[effLang] || TEXT.en;

  // taal-root: '' (en), '/nl', '/de', '/fr'
  const base = effLang && effLang !== "en" ? `/${effLang}` : "";

  // prev/next alfabetisch op bestaande basislijst
  const baseList = Array.isArray(countries) ? [...countries] : [];
  baseList.sort((a, b) => a.name.localeCompare(b.name));

  const want = String(code || "").toLowerCase();
  const idx = baseList.findIndex(
    (c) => String(c.code).toLowerCase() === want
  );

  const prev =
    idx >= 0 ? baseList[(idx - 1 + baseList.length) % baseList.length] : null;
  const next = idx >= 0 ? baseList[(idx + 1) % baseList.length] : null;

  // Gebruik gelokaliseerde landnamen voor zichtbare UI
  const prevName = prev ? countryName(prev.code, effLang) : "";
  const nextName = next ? countryName(next.code, effLang) : "";

  const btnStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 12,
    paddingInline: 14,
    whiteSpace: "nowrap",
    marginRight: 12,
    marginBottom: 12,
  };

  return (
    <div className="card" style={{ padding: 12 }}>
      <h3 className="text-base font-semibold mb-2">{t.title}</h3>

      <p className="text-sm text-slate-300">
        {t.intro(name)}
      </p>

      <div style={{ marginTop: 12 }}>
        <div>
          <Link
            className="btn"
            href={`${base}/#map`}
            aria-label={t.openMapAria}
            style={btnStyle}
            title={t.openMapAria}
          >
            {t.openMap}
          </Link>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          {prev && (
            <Link
              className="btn"
              href={`${base}/country/${String(prev.code).toLowerCase()}`}
              prefetch
              aria-label={t.goTo(prevName)}
              title={prevName}
              style={btnStyle}
            >
              ← {prevName}
            </Link>
          )}

          {next && (
            <Link
              className="btn"
              href={`${base}/country/${String(next.code).toLowerCase()}`}
              prefetch
              aria-label={t.goTo(nextName)}
              title={nextName}
              style={btnStyle}
            >
              {nextName} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}