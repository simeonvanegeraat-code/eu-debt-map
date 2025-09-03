import Link from "next/link";

export const metadata = {
  title: "Was ist Staatsverschuldung? • EU Debt Map",
  description:
    "Einfache Erklärung: Warum Staaten Geld leihen, wie die Schulden-zu-BIP-Quote funktioniert und warum das wichtig ist.",
  openGraph: {
    title: "Was ist Staatsverschuldung? • EU Debt Map",
    description:
      "Staatsverschuldung in klarer Sprache mit Beispielen und FAQs.",
    type: "article",
    url: "https://eudebtmap.com/de/debt",
    siteName: "EU Debt Map",
  },
  alternates: {
    canonical: "https://eudebtmap.com/de/debt",
    languages: {
      en: "https://eudebtmap.com/debt",
      nl: "https://eudebtmap.com/nl/debt",
      de: "https://eudebtmap.com/de/debt",
      fr: "https://eudebtmap.com/fr/debt",
      "x-default": "https://eudebtmap.com/debt",
    },
  },
};

export default function DebtExplainerDE() {
  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Was ist Staatsverschuldung?</h2>
        <p>
          <strong>Staatsverschuldung</strong> ist das Geld, das ein Land schuldet.
          Es ist ähnlich wie ein Hypothekendarlehen einer Familie oder ein Studiendarlehen:
          große Ausgaben werden über die Zeit verteilt.
        </p>

        <h3>Warum leihen sich Staaten Geld?</h3>
        <ul>
          <li><strong>Für Aufbau und Investitionen:</strong> Straßen, Schulen, Krankenhäuser, saubere Energie.</li>
          <li><strong>Für Krisenbewältigung:</strong> Naturkatastrophen, Rezessionen, Pandemien.</li>
          <li><strong>Zur Glättung von Zahlungsflüssen:</strong> wenn Steuereinnahmen und Ausgaben nicht zusammenfallen.</li>
        </ul>

        <h3>Wie wird Schuldenstand gemessen?</h3>
        <p>
          Schulden werden in Euro (€) und als Anteil an der Wirtschaftsleistung angegeben:
          die <strong>Schulden-zu-BIP-Quote</strong>.
        </p>
        <div className="tag" role="note" style={{ marginTop: 6, lineHeight: 1.5 }}>
          <strong>Beispiel:</strong> Erwirtschaftet ein Land jährlich €1 Billion (BIP)
          und betragen die Schulden €500 Milliarden, liegt die Quote bei <strong>50%</strong>.
        </div>

        <h3>Warum ist das wichtig?</h3>
        <ul>
          <li><strong>Zinskosten:</strong> mehr Schulden bedeuten höhere Zinszahlungen.</li>
          <li><strong>Politischer Spielraum:</strong> hohe Zinsen lassen weniger Mittel für Bildung,
              Gesundheit oder Steuersenkungen.</li>
          <li><strong>Stabilität:</strong> in der EU werden Schuldenstände überwacht, um stabile Volkswirtschaften zu sichern.</li>
        </ul>

        <h3>FAQ</h3>
        <p><strong>Von wem leihen Staaten?</strong><br/>
          Hauptsächlich von Investoren, die Staatsanleihen kaufen: Banken, Pensionsfonds und teils andere Länder oder Institutionen.
        </p>
        <p><strong>Was ist ein „sicheres“ Schuldenniveau?</strong><br/>
          Es gibt keine feste Zahl. In der EU gilt häufig <strong>60% des BIP</strong> als Richtwert, doch die tatsächlichen Werte variieren.
        </p>
        <p><strong>Wo finde ich aktuelle Daten?</strong><br/>
          Nutzen Sie die <Link href="/de" className="btn" style={{ padding: "2px 8px" }}>EU-Karte</Link>
          {" "}und klicken Sie auf ein Land, um eine Live-Schätzung zu sehen.
        </p>

        <p className="tag" style={{ marginTop: 10 }}>
          Quellen: Eurostat (Staatsfinanzen) und nationale Finanzministerien.
        </p>
      </section>
    </main>
  );
}
