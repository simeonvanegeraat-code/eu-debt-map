export const metadata = {
  title: "Politique de confidentialité • EU Debt Map",
  description:
    "Politique de confidentialité et de cookies pour EU Debt Map, y compris Google AdSense et la gestion du consentement.",
  alternates: { canonical: "https://www.eudebtmap.com/fr/privacy" },
};

export default function PrivacyPage() {
  const email = "firenature23@gmail.com";
  const lastUpdated = "9 septembre 2025";

  return (
    <main className="container grid gap-6 py-10">
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Politique de confidentialité & Cookies</h1>
        <p className="mt-2 text-sm text-gray-400">Dernière mise à jour : {lastUpdated}</p>
        <p className="mt-4 text-gray-300">
          EU Debt Map (« nous ») respecte votre vie privée. Cette page explique quelles données nous traitons,
          comment nous utilisons les cookies et les choix qui s’offrent à vous.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Publicité & Google AdSense</h2>
        <p className="mt-3 text-gray-300">
          Nous utilisons Google AdSense pour afficher des annonces. Google et ses partenaires peuvent utiliser
          des cookies ou des technologies similaires pour diffuser des annonces personnalisées et non
          personnalisées en fonction de vos visites sur ce site et d’autres sites.
        </p>
        <p className="mt-3">
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            En savoir plus sur les technologies publicitaires de Google
          </a>
          .
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Gestion du consentement</h2>
        <p className="mt-3 text-gray-300">
          Lors de votre première visite, vous verrez une bannière de consentement aux cookies gérée par Cookiebot
          (un CMP certifié par Google). Vous pouvez modifier ou retirer votre consentement à tout moment :
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <a href="javascript:Cookiebot.renew()" className="underline hover:no-underline">
              Ouvrir les paramètres des cookies
            </a>{" "}
            (réouvrez la bannière pour mettre à jour vos choix)
          </li>
          <li>Gérer ou supprimer les cookies dans les paramètres de votre navigateur</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analyse</h2>
        <p className="mt-3 text-gray-300">
          Nous utilisons des outils d’analyse simples et respectueux de la vie privée pour comprendre l’utilisation du site.
          Ces outils ne collectent pas d’informations personnelles identifiables.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="mt-3 text-gray-300">
          Des questions concernant cette politique ? Écrivez-nous à{" "}
          <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>.
        </p>
      </section>
    </main>
  );
}
