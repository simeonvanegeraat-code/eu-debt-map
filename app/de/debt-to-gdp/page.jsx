import DebtToGDPList from "../debt-to-gdp/DebtToGDPList";
import { withLocale } from "@/lib/locale";

export const dynamic = "force-static";
export const revalidate = 0;

export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/debt-to-gdp";
  const title = "Schulden/BIP-Rangliste (EU-27) – live | EU Debt Map";
  const description =
    "Live-Rangliste der EU-27 nach Staatsschulden im Verhältnis zum Bruttoinlandsprodukt (BIP), mit Schwellenwerten von 60 % und 90 %. Daten von Eurostat.";

  return {
    title,
    description,
    alternates: {
      canonical: `${base}${withLocale(path, "de")}`,
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
      url: `${base}/de${path}`,
      type: "website",
      siteName: "EU Debt Map",
    },
  };
}

export default function DebtToGDPPageDE() {
  const lang = "de";
  return (
    <main className="container" style={{ display: "grid", gap: 16 }}>
      <header>
        <h1 style={{ margin: 0 }}>Staatsschulden im Verhältnis zum BIP</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          Diese Rangliste zeigt das Verhältnis von Staatsverschuldung zum Bruttoinlandsprodukt (BIP) für jedes EU-Land.  
          Laut EU-Kriterien gilt eine Verschuldung unter 60 % des BIP als nachhaltig, während Werte über 90 % als kritisch betrachtet werden.
        </p>
      </header>

      <section className="card">
        <DebtToGDPList lang={lang} />
      </section>
    </main>
  );
}
