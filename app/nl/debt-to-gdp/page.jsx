import DebtToGDPList from "../debt-to-gdp/DebtToGDPList";
import { withLocale } from "@/lib/locale";

export const dynamic = "force-static";
export const revalidate = 0;

export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/debt-to-gdp";
  const title = "Schuld/BBP-ranglijst (EU-27) – live | EU Debt Map";
  const description =
    "Live ranglijst van EU-27-landen op basis van staatsschuld ten opzichte van het bbp, met drempels van 60% en 90%. Gegevens afkomstig van Eurostat.";

  return {
    title,
    description,
    alternates: {
      canonical: `${base}${withLocale(path, "nl")}`,
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
      url: `${base}/nl${path}`,
      type: "website",
      siteName: "EU Debt Map",
    },
  };
}

export default function DebtToGDPPageNL() {
  const lang = "nl";
  return (
    <main className="container" style={{ display: "grid", gap: 16 }}>
      <header>
        <h1 style={{ margin: 0 }}>Schuld ten opzichte van BBP per land</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          Deze ranglijst toont de verhouding tussen overheidsschuld en het bruto binnenlands product (BBP) voor elk EU-land.  
          Volgens de EU-regels wordt een schuld onder de 60% van het BBP als gezond beschouwd, terwijl waarden boven 90% risico’s voor stabiliteit kunnen betekenen.
        </p>
      </header>

      <section className="card">
        <DebtToGDPList lang={lang} />
      </section>
    </main>
  );
}
