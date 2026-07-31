import DebtToGDPList from "../debt-to-gdp/DebtToGDPList";
import { withLocale } from "@/lib/locale";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/debt-to-gdp";
  const title = "Classement dette/PIB UE 2026 (UE-27) | EU Debt Map";
  const description =
    "Comparez les ratios dette/PIB officiels d’Eurostat en 2026 pour les 27 pays de l’UE, avec une estimation en direct en option.";

  return {
    title,
    description,
    alternates: {
      canonical: `${base}${withLocale(path, "fr")}`,
      languages: {
        en: `${base}${path}`,
        nl: `${base}/nl${path}`,
        de: `${base}/de${path}`,
        fr: `${base}/fr${path}`,
        "x-default": `${base}${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${base}/fr${path}`,
      type: "website",
      siteName: "EU Debt Map",
    },
  };
}

export default function DebtToGDPPageFR() {
  const lang = "fr";
  return (
    <main className="container" style={{ display: "grid", gap: 16 }}>
      <header>
        <h1 style={{ margin: 0 }}>Classement dette/PIB UE 2026</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          Comparez le ratio dette/PIB officiel de chaque pays de l’UE. La valeur de 60 % est la référence de l’UE ; l’affichage en direct est une estimation complémentaire.
        </p>
      </header>

      <section className="card">
        <DebtToGDPList lang={lang} />
      </section>
    </main>
  );
}
