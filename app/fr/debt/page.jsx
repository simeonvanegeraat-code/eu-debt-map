import Link from "next/link";

export const metadata = {
  title: "Qu’est-ce que la dette publique ? • EU Debt Map",
  description:
    "Explication simple : pourquoi les pays empruntent, comment fonctionne le ratio dette/PIB et pourquoi c’est important.",
  openGraph: {
    title: "Qu’est-ce que la dette publique ? • EU Debt Map",
    description:
      "La dette publique expliquée en langage clair, avec exemples et FAQ.",
    type: "article",
    url: "https://eudebtmap.com/fr/debt",
    siteName: "EU Debt Map",
  },
  alternates: {
    canonical: "https://eudebtmap.com/fr/debt",
    languages: {
      en: "https://eudebtmap.com/debt",
      nl: "https://eudebtmap.com/nl/debt",
      de: "https://eudebtmap.com/de/debt",
      fr: "https://eudebtmap.com/fr/debt",
      "x-default": "https://eudebtmap.com/debt",
    },
  },
};

export default function DebtExplainerFR() {
  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Qu’est-ce que la dette publique&nbsp;?</h2>
        <p>
          La <strong>dette publique</strong> est l’argent que l’État doit.
          C’est comparable à un ménage qui prend un prêt immobilier ou à un étudiant qui emprunte :
          les grandes dépenses sont étalées dans le temps.
        </p>

        <h3>Pourquoi les États empruntent-ils&nbsp;?</h3>
        <ul>
          <li><strong>Construire et investir&nbsp;:</strong> routes, écoles, hôpitaux, énergie propre.</li>
          <li><strong>Gérer les crises&nbsp;:</strong> catastrophes, récessions, pandémies.</li>
          <li><strong>Lisser les flux&nbsp;:</strong> quand recettes et dépenses ne coïncident pas.</li>
        </ul>

        <h3>Comment mesure-t-on la dette&nbsp;?</h3>
        <p>
          La dette s’exprime en euros (€) et aussi en part de l’économie :
          le <strong>ratio dette/PIB</strong>.
        </p>
        <div className="tag" role="note" style={{ marginTop: 6, lineHeight: 1.5 }}>
          <strong>Exemple&nbsp;:</strong> si un pays produit €1&nbsp;billion par an (PIB)
          et doit €500&nbsp;milliards, le ratio dette/PIB est de <strong>50&nbsp;%</strong>.
        </div>

        <h3>Pourquoi est-ce important&nbsp;?</h3>
        <ul>
          <li><strong>Coûts d’intérêts&nbsp;:</strong> plus de dette = plus d’intérêts à payer.</li>
          <li><strong>Marge de manœuvre&nbsp;:</strong> des charges d’intérêts élevées laissent moins pour l’éducation,
              la santé ou les baisses d’impôts.</li>
          <li><strong>Stabilité&nbsp;:</strong> dans l’UE, les niveaux de dette sont suivis pour garder des économies saines.</li>
        </ul>

        <h3>FAQ</h3>
        <p><strong>Qui prête aux États&nbsp;?</strong><br/>
          Principalement des investisseurs qui achètent des obligations d’État : banques, fonds de pension et parfois d’autres pays ou institutions.
        </p>
        <p><strong>Quel est un niveau « sûr » de dette&nbsp;?</strong><br/>
          Il n’existe pas de seuil unique. Dans l’UE, on utilise souvent <strong>60&nbsp;% du PIB</strong> comme repère,
          mais les niveaux varient selon les pays et les périodes.
        </p>
        <p><strong>Où voir les chiffres actuels&nbsp;?</strong><br/>
          Utilisez la <Link href="/fr" className="btn" style={{ padding: "2px 8px" }}>carte de l’UE</Link>
          {" "}et cliquez sur un pays pour une estimation en direct.
        </p>

        <p className="tag" style={{ marginTop: 10 }}>
          Sources : Eurostat (statistiques des finances publiques) et ministères nationaux des Finances.
        </p>
      </section>
    </main>
  );
}
