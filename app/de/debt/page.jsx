// app/de/debt/page.jsx
import Link from "next/link";
import CTASidebar from "@/components/CTASidebar";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title = "Was ist Staatsverschuldung? • EU Debt Map";
  const description =
    "Einfache Erklärung der Staatsverschuldung: warum Länder Schulden aufnehmen, wie das Schulden/BIP-Verhältnis funktioniert und warum es für Bürger und Wirtschaft wichtig ist.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/de${path}`,
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
      description:
        "Staatsverschuldung leicht erklärt – mit Beispielen, FAQ und Links zu offiziellen Quellen.",
      type: "article",
      url: `${base}/de${path}`,
      siteName: "EU Debt Map",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function DebtExplainerDE() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Was ist Staatsverschuldung?",
    inLanguage: "de",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/de/debt",
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Was ist Staatsverschuldung?</h2>
        <p>
          <strong>Staatsverschuldung</strong> ist das Geld, das ein Land schuldet.
          Sie ähnelt einer Hypothek oder einem Studienkredit: große Ausgaben werden über die Zeit verteilt.
        </p>

        <h3>Warum nehmen Regierungen Schulden auf?</h3>
        <ul>
          <li><strong>Investitionen:</strong> Straßen, Schulen, Krankenhäuser, saubere Energie.</li>
          <li><strong>Krisen bewältigen:</strong> Naturkatastrophen, Rezessionen, Pandemien.</li>
          <li><strong>Ausgaben glätten:</strong> wenn Steuereinnahmen und Ausgaben nicht übereinstimmen.</li>
        </ul>

        <h3>Wie wird Verschuldung gemessen?</h3>
        <p>
          Schulden werden in Euro (€) angegeben und als Anteil der Wirtschaft:
          das <strong>Schulden-BIP-Verhältnis</strong> (Debt-to-GDP-Ratio).
        </p>
        <div className="tag" role="note" style={{ marginTop: 6, lineHeight: 1.5 }}>
          <strong>Beispiel:</strong> Wenn ein Land jährlich 1 Billion € produziert (BIP)
          und 500 Milliarden € Schulden hat, beträgt das Verhältnis <strong>50%</strong>.
        </div>

        <h3>Warum ist das wichtig?</h3>
        <ul>
          <li><strong>Zinskosten:</strong> mehr Schulden bedeuten mehr Geld für Zinsen.</li>
          <li><strong>Spielraum für Politik:</strong> hohe Zinsausgaben lassen weniger Geld für Bildung, Gesundheit oder Steuersenkungen.</li>
          <li><strong>Stabilität:</strong> In der EU werden Schulden überwacht, um die Wirtschaft stabil zu halten.</li>
        </ul>

        <h3>FAQ</h3>
        <p><strong>Von wem leihen Länder Geld?</strong><br/>
          Vor allem von Investoren, die Staatsanleihen kaufen: Banken, Pensionsfonds und manchmal andere Länder oder Institutionen.
        </p>
        <p><strong>Was gilt als „sicheres“ Niveau?</strong><br/>
          Es gibt keine magische Zahl. Die EU verwendet oft <strong>60% des BIP</strong> als Richtwert,
          aber die tatsächlichen Werte unterscheiden sich je nach Land und Zeit.
        </p>
        <p><strong>Wo kann ich aktuelle Zahlen sehen?</strong><br/>
          Nutze die <Link href="/de" className="btn" style={{ padding: "2px 8px" }}>EU-Karte</Link>
          und klicke auf ein Land, um eine Live-Schätzung basierend auf den letzten Quartalen zu sehen.
        </p>

        <p className="tag" style={{ marginTop: 10 }}>
          Quellen: Eurostat (öffentliche Finanzen) und nationale Finanzministerien.
        </p>
      </section>

      <CTASidebar lang="de" homeHref="/de" methodologyHref="/de/methodology" />
    </main>
  );
}
