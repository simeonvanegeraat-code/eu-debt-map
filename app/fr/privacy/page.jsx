export const metadata = {
  title: "Politique de confidentialité • EU Debt Map",
  description:
    "Politique de confidentialité et cookies pour EU Debt Map, y compris Google AdSense, Google Analytics 4 et la gestion du consentement.",
  alternates: { canonical: "https://www.eudebtmap.com/fr/privacy" },
};

export default function PrivacyPage() {
  const email = "firenature23@gmail.com";
  const lastUpdated = "16 septembre 2025";

  return (
    <main className="container grid gap-6 py-10">
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Politique de confidentialité & cookies</h1>
        <p className="mt-2 text-sm text-gray-400">Dernière mise à jour : {lastUpdated}</p>
        <p className="mt-4 text-gray-300">
          EU Debt Map (« nous ») respecte votre vie privée. Cette page explique quelles données nous traitons,
          comment nous utilisons les cookies et quels choix vous avez.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Publicité & Google AdSense</h2>
        <p className="mt-3 text-gray-300">
          Nous utilisons Google AdSense pour afficher des annonces. Dans l’UE/UK/CH, nous suivons les exigences de Google concernant le consentement.
          Selon votre choix, Google peut afficher des annonces personnalisées ou non personnalisées.
        </p>
        <p className="mt-3">
          <a
            href="https://policies.google.com/technologies/ads?hl=fr"
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
          Lors de votre première visite, vous verrez une bannière de consentement fournie par <strong>CookieScript</strong> (IAB TCF et Google Consent Mode v2).
          Vous pouvez modifier ou retirer votre consentement à tout moment :
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <a href="#" className="csconsentlink underline hover:no-underline">
              Ouvrir les préférences de cookies
            </a>{" "}
            (mettre à jour vos choix)
          </li>
          <li>Gérer ou supprimer les cookies via les paramètres de votre navigateur.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analyse</h2>
        <p className="mt-3 text-gray-300">
          Nous utilisons <strong>Google Analytics 4</strong> pour comprendre l’utilisation du site. Dans l’UE/UK/CH, Analytics ne fonctionne
          qu’après votre consentement (via Consent Mode v2). L’anonymisation IP est activée.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="mt-3 text-gray-300">
          Questions sur cette politique ? Envoyez un e-mail à{" "}
          <a href={`mailto:${email}`} className="underline hover:no-underline">
            {email}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
