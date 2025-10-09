// app/debt-to-gdp/page.jsx
import DebtToGDPList from "./DebtToGDPList";
import { t } from "@/lib/i18n";
import { getLocaleFromPathname, withLocale } from "@/lib/locale";

export const dynamic = "force-static";
export const revalidate = 0;

export async function generateMetadata() {
  const lang = getLocaleFromPathname?.() || "en";
  const titleMap = {
    en: "Debt-to-GDP ranking (EU-27) – live | EU Debt Map",
    nl: "Schuld-/bbp-ranglijst (EU-27) – live | EU Debt Map",
    de: "Schulden-zu-BIP-Ranking (EU-27) – live | EU Debt Map",
    fr: "Classement Dette/PIB (UE-27) – en direct | EU Debt Map",
  };
  const descMap = {
    en: "Live EU-27 ranking by public debt relative to GDP, with thresholds at 60% and 90%. Updated from Eurostat.",
    nl: "Live ranglijst van EU-27 op staatsschuld t.o.v. bbp, met drempels 60% en 90%. Bijgewerkt via Eurostat.",
    de: "Live-Ranking der EU-27 nach Staatsschulden relativ zum BIP, Schwellen bei 60 % und 90 %. Daten von Eurostat.",
    fr: "Classement en direct des 27 pays de l’UE par dette publique/PIB, seuils à 60 % et 90 %. Données Eurostat.",
  };

  const base = "https://www.eudebtmap.com";
  const path = "/debt-to-gdp";

  return {
    title: titleMap[lang] || titleMap.en,
    description: descMap[lang] || descMap.en,
    alternates: {
      canonical: `${base}${withLocale(path, "")}`,
      languages: {
        en: `${base}${withLocale(path, "")}`,
        nl: `${base}${withLocale(path, "nl")}`,
        de: `${base}${withLocale(path, "de")}`,
        fr: `${base}${withLocale(path, "fr")}`,
      },
    },
    openGraph: {
      title: titleMap[lang] || titleMap.en,
      description: descMap[lang] || descMap.en,
      url: `${base}${withLocale(path, lang)}`,
      type: "website",
    },
  };
}

export default function DebtToGDPPage() {
  const lang = getLocaleFromPathname?.() || "en";
  return (
    <main className="container" style={{ display: "grid", gap: 16 }}>
      <header>
        <h1 style={{ margin: 0 }}>{t(lang, "dtg.title")}</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          {t(lang, "dtg.why")}
        </p>
      </header>

      <section className="card">
        {/* Geef lang door aan de client-component */}
        <DebtToGDPList lang={lang} />
      </section>
    </main>
  );
}
