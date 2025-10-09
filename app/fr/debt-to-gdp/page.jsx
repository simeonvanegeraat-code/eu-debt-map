import DebtToGDPList from "../debt-to-gdp/DebtToGDPList";
import { withLocale } from "@/lib/locale";

export const dynamic = "force-static";
export const revalidate = 0;

export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/debt-to-gdp";
  const title = "Classement Dette/PIB (UE-27) – en direct | EU Debt Map";
  const description =
    "Classement en direct des 27 pays de l’UE selon le ratio dette publique/PIB, avec seuils de 60 % et 90 %. Données issues d’Eurostat.";

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
        <h1 style={{ margin: 0 }}>Dette publique par rapport au PIB</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          Ce classement montre le rapport entre la dette publique et le produit intérieur brut (PIB) de chaque pays de l’UE.  
          Selon les critères de l’Union, une dette inférieure à 60 % du PIB est considérée comme saine, tandis que des niveaux supérieurs à 90 % peuvent représenter un risque économique.
        </p>
      </header>

      <section className="card">
        <DebtToGDPList lang={lang} />
      </section>
    </main>
  );
}
