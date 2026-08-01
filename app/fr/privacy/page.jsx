import GoogleConsentSettingsLink from "@/components/GoogleConsentSettingsLink";

export const metadata = {
  title: "Politique de confidentialité • EU Debt Map",
  description:
    "Politique de confidentialité et cookies pour EU Debt Map, y compris Google AdSense, la gestion du consentement de Google et Vercel Web Analytics.",
  alternates: { canonical: "https://www.eudebtmap.com/fr/privacy" },
};

export default function PrivacyPage() {
  const email = "firenature23@gmail.com";
  const lastUpdated = "1 août 2026";

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
          Lors de votre première visite dans l&apos;EEE, au Royaume-Uni ou en Suisse, le message de consentement publié par Google peut apparaître.
          Il est géré dans AdSense via <strong>Google Confidentialité et messages</strong> et prend en charge le Transparency and Consent Framework (TCF) de l&apos;IAB.
          Vous pouvez modifier ou retirer votre consentement à tout moment :
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <GoogleConsentSettingsLink className="underline hover:no-underline">
              Ouvrir les paramètres de confidentialité et de cookies
            </GoogleConsentSettingsLink>{" "}
            (mettre à jour vos choix)
          </li>
          <li>Gérer ou supprimer les cookies via les paramètres de votre navigateur.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analyse</h2>
        <p className="mt-3 text-gray-300">
          Nous utilisons <strong>Vercel Web Analytics</strong> pour obtenir des statistiques de trafic agrégées. Selon Vercel,
          ce service stocke des données anonymisées et n&apos;utilise pas de cookies. Consultez la{" "}
          <a
            href="https://vercel.com/docs/analytics/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            documentation de Vercel sur la confidentialité et la conformité
          </a>
          .
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
