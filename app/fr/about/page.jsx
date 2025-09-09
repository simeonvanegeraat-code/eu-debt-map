export const metadata = {
  title: "À propos & Contact | EU Debt Map",
  description:
    "En savoir plus sur EU Debt Map, pourquoi il a été créé et comment nous contacter.",
  alternates: { canonical: "https://www.eudebtmap.com/fr/about" },
  openGraph: {
    title: "À propos & Contact | EU Debt Map",
    description:
      "EU Debt Map est un projet hobby indépendant pour visualiser la dette publique de l’UE-27. Contactez Simeon par email pour vos questions ou retours.",
    url: "https://www.eudebtmap.com/fr/about",
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function AboutPage() {
  const email = "firenature23@gmail.com";

  return (
    <main className="container grid gap-6 py-10">
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">À propos & Contact</h1>
        <p className="mt-4 text-gray-300">👋 Bonjour, je m’appelle <strong>Simeon</strong>.</p>
        <p className="mt-3 text-gray-300">
          J’ai créé <strong>EU Debt Map</strong> comme projet personnel et hobby.  
          Passionné par l’économie et les données, je voulais construire quelque chose qui rende des chiffres complexes – comme la dette publique – plus faciles à comprendre.
        </p>
        <p className="mt-3 text-gray-300">
          Ce site est indépendant : je ne fais partie d’aucune institution ou gouvernement.  
          C’est simplement moi, expérimentant avec le développement web et la visualisation de données.
        </p>
        <p className="mt-3 text-gray-300">
          Comme j’apprends encore et que j’améliore le site en continu, vos retours sont précieux.  
          Si vous trouvez des erreurs, avez des idées ou souhaitez simplement dire bonjour :
        </p>
        <p className="mt-3 text-gray-200 font-semibold">
          📧 <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">À propos du projet</h2>
        <p className="mt-3 text-gray-300">
          EU Debt Map est une visualisation éducative de la dette publique dans l’UE-27.  
          Nous combinons les deux périodes de référence Eurostat les plus récentes pour estimer, en temps réel, la dette de chaque pays.  
          Notre objectif est de sensibiliser et de rendre les données financières plus accessibles.
        </p>
        <p className="mt-3 text-gray-300">
          Pour plus de détails et de sources, consultez la page{" "}
          <a href="/fr/methodology" className="underline hover:no-underline">Méthodologie</a>.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Avertissement : ces estimations sont fournies à titre éducatif uniquement et ne constituent pas des statistiques officielles.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="mt-3 text-gray-300">
          Vous pouvez toujours me contacter directement par email ou suivre les mises à jour sur les réseaux sociaux.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href={`mailto:${email}`} className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">Envoyer un email</a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">Suivre sur X (Twitter)</a>
        </div>
      </section>
    </main>
  );
}
