import DebtToGDPList from "../debt-to-gdp/DebtToGDPList";
import { withLocale } from "@/lib/locale";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/debt-to-gdp";
  const title = "EU Schulden/BIP-Ranking 2026 (EU-27) | EU Debt Map";
  const description =
    "Vergleichen Sie die offiziellen Eurostat-Schuldenquoten 2026 aller 27 EU-Länder, optional mit Live-Schätzung.";

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
        <h1 style={{ margin: 0 }}>EU Schulden/BIP-Ranking 2026</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          Vergleichen Sie die offizielle Schuldenquote jedes EU-Landes. Der Wert von 60 % ist der EU-Referenzwert; die Live-Ansicht ist eine zusätzliche Schätzung.
        </p>
      </header>

      <section className="card">
        <DebtToGDPList lang={lang} />
      </section>
    </main>
  );
}
