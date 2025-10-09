// app/fr/debt/page.jsx
import Link from "next/link";
import CTASidebar from "@/components/CTASidebar";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title = "Qu’est-ce que la dette publique ? • EU Debt Map";
  const description =
    "Explication simple de la dette publique : pourquoi les pays empruntent, comment fonctionne le ratio dette/PIB et pourquoi c’est important pour l’économie.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/fr${path}`,
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
        "La dette publique expliquée simplement avec des exemples, une FAQ et des liens vers des sources officielles.",
      type: "article",
      url: `${base}/fr${path}`,
      siteName: "EU Debt Map",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function DebtExplainerFR() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Qu’est-ce que la dette publique ?",
    inLanguage: "fr",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/fr/debt",
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Qu’est-ce que la dette publique ?</h2>
        <p>
          La <strong>dette publique</strong> représente l’argent qu’un pays doit.
          C’est comparable à un prêt immobilier ou à un prêt étudiant : les grandes dépenses
          sont étalées dans le temps.
        </p>

        <h3>Pourquoi les gouvernements empruntent-ils ?</h3>
        <ul>
          <li><strong>Investir :</strong> routes, écoles, hôpitaux, énergies propres.</li>
          <li><strong>Faire face aux crises :</strong> catastrophes, récessions, pandémies.</li>
          <li><strong>Réguler les flux :</strong> quand les recettes fiscales et les dépenses ne coïncident pas.</li>
        </ul>

        <h3>Comment la dette est-elle mesurée ?</h3>
        <p>
          Elle est exprimée en euros (€) et en part du PIB (Produit Intérieur Brut) :
          c’est le <strong>ratio dette/PIB</strong>.
        </p>
        <div className="tag" role="note" style={{ marginTop: 6, lineHeight: 1.5 }}>
          <strong>Exemple :</strong> Si un pays produit 1 000 milliards € par an (PIB)
          et doit 500 milliards €, le ratio dette/PIB est de <strong>50 %</strong>.
        </div>

        <h3>Pourquoi est-ce important ?</h3>
        <ul>
          <li><strong>Coûts d’intérêt :</strong> plus de dette signifie plus de paiements d’intérêts.</li>
          <li><strong>Marge de manœuvre budgétaire :</strong> des charges d’intérêts élevées laissent moins d’argent pour les écoles, la santé ou les baisses d’impôts.</li>
          <li><strong>Stabilité :</strong> dans l’UE, les niveaux de dette sont surveillés pour maintenir la stabilité économique.</li>
        </ul>

        <h3>FAQ</h3>
        <p><strong>Qui prête aux pays ?</strong><br/>
          Principalement des investisseurs qui achètent des obligations d’État : banques, fonds de pension, ou parfois d’autres pays.
        </p>
        <p><strong>Quel niveau de dette est « sûr » ?</strong><br/>
          Il n’existe pas de seuil magique. L’UE recommande souvent un ratio de <strong>60 %</strong> du PIB,
          mais cela varie selon les pays et les périodes.
        </p>
        <p><strong>Où voir les chiffres actuels ?</strong><br/>
          Utilisez la <Link href="/fr" className="btn" style={{ padding: "2px 8px" }}>carte de l’UE</Link> et cliquez sur un pays
          pour voir une estimation en direct basée sur les dernières périodes de référence.
        </p>

        <p className="tag" style={{ marginTop: 10 }}>
          Sources : Eurostat (statistiques des finances publiques) et ministères nationaux des Finances.
        </p>
      </section>

      <CTASidebar lang="fr" homeHref="/fr" methodologyHref="/fr/methodology" />
    </main>
  );
}
