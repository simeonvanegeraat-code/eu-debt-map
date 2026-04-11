// components/MapCTA.jsx
import Link from "next/link";

const TEXT = {
  en: {
    title: "View the full EU overview",
    intro: "See the combined EU debt estimate and open the interactive map.",
    openMap: "Open EU overview",
    openMapAria: "Open EU overview",
  },
  nl: {
    title: "Bekijk het volledige EU-overzicht",
    intro: "Zie de gezamenlijke EU-schuld en open de interactieve kaart.",
    openMap: "Open EU-overzicht",
    openMapAria: "Open EU-overzicht",
  },
  de: {
    title: "Vollständigen EU-Überblick anzeigen",
    intro: "Sieh dir die gesamte EU-Schuldenschätzung an und öffne die interaktive Karte.",
    openMap: "EU-Überblick öffnen",
    openMapAria: "EU-Überblick öffnen",
  },
  fr: {
    title: "Voir la vue d’ensemble de l’UE",
    intro: "Consultez l’estimation totale de la dette de l’UE et ouvrez la carte interactive.",
    openMap: "Ouvrir la vue d’ensemble UE",
    openMapAria: "Ouvrir la vue d’ensemble UE",
  },
};

export default function MapCTA({ lang = "en" }) {
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = TEXT[effLang] || TEXT.en;

  const base = effLang && effLang !== "en" ? `/${effLang}` : "";

  return (
    <section
      aria-label={t.title}
      style={{
        padding: "8px 0 0",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 8,
          justifyItems: "start",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--fg)",
          }}
        >
          {t.title}
        </h3>

        <p
          style={{
            margin: 0,
            color: "rgb(71,85,105)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {t.intro}
        </p>

        <Link
          className="btn"
          href={base || "/"}
          aria-label={t.openMapAria}
          title={t.openMapAria}
          prefetch
        >
          {t.openMap}
        </Link>
      </div>
    </section>
  );
}