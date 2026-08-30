// app/fr/about/page.jsx
export async function generateMetadata() {
  const base = "https://www.eudebtmap.com";
  const path = "/about";
  const title = "À propos & Contact | EU Debt Map";
  const description =
    "Découvrez pourquoi EU Debt Map a été créé et comment nous contacter.";

  return {
    metadataBase: new URL(base),
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
        "EU Debt Map est un projet indépendant qui visualise la dette publique des 27 pays de l’UE. Contactez Simeon pour vos retours ou questions.",
      url: `${base}/fr${path}`,
      siteName: "EU Debt Map",
      type: "website",
    },
  };
}

export default function AboutPageFR() {
  const email = "info@eudebtmap.com";
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Simeon",
    url: "https://www.eudebtmap.com",
    email,
    description:
      "Projet indépendant visualisant la dette publique de l’Union européenne avec des estimations en direct.",
  };

  return (
    <main className="container grid gap-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">À propos & Contact</h1>
        <p className="mt-4 text-gray-300">👋 Bonjour, je m’appelle <strong>Simeon</strong>.</p>
        <p className="mt-3 text-gray-300">
          J’ai créé <strong>EU Debt Map</strong> comme projet personnel et éducatif.
          Passionné par l’économie et la donnée, je voulais rendre les grands chiffres plus faciles à comprendre.
        </p>
        <p className="mt-3 text-gray-300">
          Ce site est totalement indépendant : je ne fais partie d’aucune institution.
          C’est un projet d’apprentissage autour du développement web et de la visualisation de données.
        </p>
        <p className="mt-3 text-gray-300">
          Si vous avez des suggestions ou remarquez une erreur, n’hésitez pas à m’écrire.
        </p>
        <p className="mt-3 text-gray-200 font-semibold">
          📧 <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">À propos du projet</h2>
        <p className="mt-3 text-gray-300">
          EU Debt Map est une visualisation éducative de la dette publique dans l’Union européenne.
          Nous combinons les deux périodes les plus récentes d’Eurostat pour estimer la dette en temps réel par pays.
        </p>
        <p className="mt-3 text-gray-300">
          Pour plus de détails sur la méthode et les sources, consultez la page{" "}
          <a href="/fr/methodology" className="underline hover:no-underline">Méthodologie</a>.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Avertissement : les estimations sont fournies à titre éducatif et ne constituent pas des statistiques officielles.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Restons en contact</h2>
        <p className="mt-3 text-gray-300">
          Vous pouvez me joindre par e-mail ou suivre les mises à jour sur X (Twitter).
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href={`mailto:${email}`} className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            Écrire à Simeon
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            Suivre sur X (Twitter)
          </a>
        </div>
      </section>
    </main>
  );
}
