// app/fr/stability-and-growth-pact/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA (FR)
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/fr/stability-and-growth-pact";
  const title = "Pacte de stabilité et de croissance (PSC) : bases, règles et enjeux • EU Debt Map";
  const description =
    "Explication simple du Pacte de stabilité et de croissance : objectifs, règles de dette et de déficit, rôle du ratio dette/PIB, FAQ et liens vers la méthodologie et la carte en direct.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}/stability-and-growth-pact`,
        nl: `${base}/nl/stability-and-growth-pact`,
        de: `${base}/de/stability-and-growth-pact`,
        fr: `${base}${path}`,
        "x-default": `${base}/stability-and-growth-pact`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      images: [{ url: "/og/debt-explainer-1200x630.jpg", width: 1200, height: 630, alt: "Pacte de stabilité et de croissance" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og/debt-explainer-1200x630.jpg"] },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

function Pill({ children }) {
  return (
    <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:999, background:"var(--muted, #f3f4f6)", fontSize:12, marginRight:6 }}>
      {children}
    </span>
  );
}

export default function SgpFR() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Pacte de stabilité et de croissance (PSC) : bases, règles et enjeux",
    inLanguage: "fr",
    mainEntityOfPage: "https://www.eudebtmap.com/fr/stability-and-growth-pact",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    about: ["Pacte de stabilité et de croissance","PSC","règles budgétaires UE","dette/PIB","déficit"],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type":"Question", name:"Quel est l’objectif du PSC ?", acceptedAnswer:{ "@type":"Answer", text:"Maintenir des finances publiques soutenables dans l’UE en coordonnant la politique budgétaire autour d’ancrages communs de dette et de déficit." } },
      { "@type":"Question", name:"Existe‑t‑il un seul chiffre à atteindre ?", acceptedAnswer:{ "@type":"Answer", text:"Non. La soutenabilité dépend de la trajectoire de chaque pays, de la croissance, des taux d’intérêt et des choix budgétaires." } },
      { "@type":"Question", name:"Où voir les chiffres à jour ?", acceptedAnswer:{ "@type":"Answer", text:"Sur EU Debt Map : estimation en temps quasi réel par pays basée sur les dernières dates de référence." } }
    ]
  };

  const breadcrumbsLd = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    itemListElement:[
      { "@type":"ListItem", position:1, name:"Accueil", item:"https://www.eudebtmap.com/fr" },
      { "@type":"ListItem", position:2, name:"Pacte de stabilité et de croissance", item:"https://www.eudebtmap.com/fr/stability-and-growth-pact" }
    ]
  };

  return (
    <main className="container grid" style={{ alignItems:"start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

      <section className="card section" style={{ gridColumn:"1 / -1" }}>
        <header>
          <h1 className="hero-title" style={{ fontSize:"clamp(1.8rem, 4vw + 1rem, 3rem)", background:"linear-gradient(90deg, #2563eb, #00875a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:0 }}>
            Pacte de stabilité et de croissance (PSC)
          </h1>
          <div style={{ maxWidth:"68ch" }}>
            <p className="hero-lede" style={{ marginTop:8 }}>
              Ce que visent les règles budgétaires de l’UE, comment fonctionnent les repères de dette et de déficit, et pourquoi la <em>trajectoire</em> de la dette compte autant que son niveau.
            </p>
          </div>
        </header>
      </section>

      <article className="card section" style={{ gridColumn:"1 / -1" }}>
        <section>
          <h2 className="article-title">Ce que cherche à faire le PSC</h2>
          <p>Coordonner les politiques budgétaires pour garder des finances publiques <strong>soutenables</strong>. Le PSC fixe des ancrages communs pour le <strong>déficit</strong> et la <strong>dette</strong> tout en laissant des choix nationaux.</p>
          <div className="tag" style={{ marginTop:8 }}>En bref : aligner les incitations, réduire les risques, stabiliser l’union monétaire.</div>
        </section>

        <section>
          <h2 className="article-title">Idées clés</h2>
          <p><Pill>Soutenabilité de la dette</Pill><Pill>Trajectoire budgétaire</Pill><Pill>Repères communs</Pill></p>
          <ul>
            <li><strong>Trajectoire :</strong> l’orientation de la dette compte autant que son niveau.</li>
            <li><strong>Discipline du déficit :</strong> maintenir l’écart annuel à un niveau gérable.</li>
            <li><strong>Comparabilité :</strong> dette/PIB pour comparer équitablement.</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">Dette, déficit et dette/PIB</h2>
          <p>Le PSC distingue le <strong>déficit</strong> (flux annuel) et la <strong>dette</strong> (stock). On compare via le <strong>ratio dette/PIB</strong>.</p>
          <p className="tag" style={{ marginTop:8 }}>
            Pour commencer : <Link href="/fr/debt">Qu’est‑ce que la dette ?</Link> · <Link href="/fr/debt-vs-deficit">Dette vs Déficit</Link> · <Link href="/fr/debt-to-gdp">Dette/PIB expliqué</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">Pourquoi c’est important pour les citoyens</h2>
          <ul>
            <li><strong>Intérêts :</strong> des intérêts élevés réduisent les marges pour l’éducation ou la santé.</li>
            <li><strong>Stabilité :</strong> des règles communes réduisent le risque de crises.</li>
            <li><strong>Marges de manœuvre :</strong> une meilleure dynamique crée de l’espace pour investir et amortir les chocs.</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>
          <details className="debt-faq"><summary>Existe‑t‑il un « chiffre sûr » pour la dette ?</summary><p className="tag" style={{ marginTop:8 }}>Non. La soutenabilité dépend de la croissance, des taux, de la démographie et de trajectoires crédibles.</p></details>
          <details className="debt-faq"><summary>Les règles bloquent‑elles l’investissement ?</summary><p className="tag" style={{ marginTop:8 }}>L’objectif est de permettre un investissement soutenable en gardant la dette sur une trajectoire stable.</p></details>
          <details className="debt-faq"><summary>Où voir les données à jour ?</summary><p className="tag" style={{ marginTop:8 }}>Ouvrez la{" "}<Link href="/fr" className="btn" style={{ padding:"2px 8px" }}>carte UE</Link>{" "}puis choisissez un pays.</p></details>

          <div className="cta card" style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
            <Link href="/fr" className="btn">Voir la carte →</Link>
            <Link href="/fr/debt" className="btn">Qu’est‑ce que la dette ? →</Link>
            <Link href="/fr/debt-to-gdp" className="btn">Dette/PIB →</Link>
            <Link href="/fr/methodology" className="btn">Méthodologie →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
