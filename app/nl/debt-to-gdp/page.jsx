import DebtToGDPList from "../debt-to-gdp/DebtToGDPList";
import { withLocale } from "@/lib/locale";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/debt-to-gdp";
  const title = "EU schuld/BBP-ranglijst 2026 (EU-27) | EU Debt Map";
  const description =
    "Vergelijk de officiële Eurostat-schuldquotes voor 2026 van alle 27 EU-landen, met een optionele live schatting.";

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
        <h1 style={{ margin: 0 }}>EU schuld/BBP-ranglijst 2026</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          Vergelijk de officiële schuldquote van ieder EU-land. De 60%-waarde is de EU-referentiewaarde; de live weergave is een aanvullende schatting.
        </p>
      </header>

      <section className="card">
        <DebtToGDPList lang={lang} />
      </section>
    </main>
  );
}
