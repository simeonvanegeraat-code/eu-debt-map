import Link from "next/link";

export const metadata = {
  title: "Wat is staatsschuld? • EU Debt Map",
  description:
    "Eenvoudige uitleg van staatsschuld: waarom landen lenen, hoe de schuld-tot-bbp-ratio werkt en waarom het ertoe doet.",
  openGraph: {
    title: "Wat is staatsschuld? • EU Debt Map",
    description:
      "Staatsschuld uitgelegd in begrijpelijke taal, met voorbeelden en veelgestelde vragen.",
    type: "article",
    url: "https://eudebtmap.com/nl/debt",
    siteName: "EU Debt Map",
  },
  alternates: {
    canonical: "https://eudebtmap.com/nl/debt",
    languages: {
      en: "https://eudebtmap.com/debt",
      nl: "https://eudebtmap.com/nl/debt",
      de: "https://eudebtmap.com/de/debt",
      fr: "https://eudebtmap.com/fr/debt",
      "x-default": "https://eudebtmap.com/debt",
    },
  },
};

export default function DebtExplainerNL() {
  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Wat is staatsschuld?</h2>
        <p>
          <strong>Staatsschuld</strong> is het geld dat een land verschuldigd is.
          Het lijkt op een gezin dat een hypotheek neemt of een student die leent:
          grote uitgaven worden gespreid over de tijd.
        </p>

        <h3>Waarom lenen overheden?</h3>
        <ul>
          <li><strong>Voor bouwen en investeren:</strong> wegen, scholen, ziekenhuizen, duurzame energie.</li>
          <li><strong>Voor noodgevallen:</strong> natuurrampen, recessies, pandemieën.</li>
          <li><strong>Om timing te overbruggen:</strong> als belastinginkomsten en uitgaven niet gelijk lopen.</li>
        </ul>

        <h3>Hoe wordt schuld gemeten?</h3>
        <p>
          Schuld wordt weergegeven in euro’s (€) en ook als deel van de economie:
          de <strong>schuld-tot-bbp-ratio</strong>.
        </p>
        <div className="tag" role="note" style={{ marginTop: 6, lineHeight: 1.5 }}>
          <strong>Voorbeeld:</strong> produceert een land €1 biljoen per jaar (bbp) en
          is de schuld €500 miljard, dan is de schuld-tot-bbp-ratio <strong>50%</strong>.
        </div>

        <h3>Waarom is schuld belangrijk?</h3>
        <ul>
          <li><strong>Rentelasten:</strong> meer schuld betekent meer geld naar rente.</li>
          <li><strong>Beleidsruimte:</strong> hoge rentelasten laten minder over voor onderwijs,
              zorg of belastingverlaging.</li>
          <li><strong>Stabiliteit:</strong> in de EU worden schulden gemonitord om economieën gezond te houden.</li>
        </ul>

        <h3>Veelgestelde vragen</h3>
        <p><strong>Van wie lenen landen?</strong><br/>
          Vooral van beleggers die staatsobligaties kopen: banken, pensioenfondsen en soms andere landen of instellingen.
        </p>
        <p><strong>Wat is een “veilig” schuldniveau?</strong><br/>
          Er is geen magische grens. In de EU wordt vaak <strong>60% van het bbp</strong> gebruikt als richtsnoer, maar niveaus verschillen per land en periode.
        </p>
        <p><strong>Waar zie ik actuele cijfers?</strong><br/>
          Gebruik de <Link href="/nl" className="btn" style={{ padding: "2px 8px" }}>EU-kaart</Link>
          {" "}en klik op een land voor een live schatting op basis van de laatste referentiedata.
        </p>

        <p className="tag" style={{ marginTop: 10 }}>
          Bronnen: Eurostat (overheidsfinanciën) en nationale ministeries van Financiën.
        </p>
      </section>
    </main>
  );
}
