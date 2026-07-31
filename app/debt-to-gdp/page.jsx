// app/debt-to-gdp/page.jsx
import DebtToGDPList from "./DebtToGDPList";
import { t } from "@/lib/i18n";
import { getLocaleFromPathname, withLocale } from "@/lib/locale";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const lang = getLocaleFromPathname?.() || "en";
  const titleMap = {
    en: "EU debt-to-GDP ranking 2026 (EU-27) | EU Debt Map",
    nl: "EU schuld-/bbp-ranglijst 2026 (EU-27) | EU Debt Map",
    de: "EU Schulden/BIP-Ranking 2026 (EU-27) | EU Debt Map",
    fr: "Classement dette/PIB UE 2026 (UE-27) | EU Debt Map",
  };
  const descMap = {
    en: "Compare official 2026 Eurostat debt-to-GDP ratios for all EU-27 countries, with an optional live estimate.",
    nl: "Vergelijk officiële Eurostat-schuldquotes voor 2026 van alle 27 EU-landen, met een optionele live schatting.",
    de: "Vergleichen Sie die offiziellen Eurostat-Schuldenquoten 2026 aller 27 EU-Länder, optional mit Live-Schätzung.",
    fr: "Comparez les ratios dette/PIB officiels d’Eurostat en 2026 pour les 27 pays de l’UE, avec une estimation en direct en option.",
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
        <h1 style={{ margin: 0 }}>EU debt-to-GDP ranking 2026</h1>
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
