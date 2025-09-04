export const metadata = {
  title: "Confidentialité & Cookies • EU Debt Map",
  description: "Politique de confidentialité et de cookies d’EU Debt Map, et utilisation de Google AdSense.",
  alternates: {
    canonical: "https://eudebtmap.com/fr/privacy",
    languages: {
      en: "https://eudebtmap.com/privacy",
      nl: "https://eudebtmap.com/nl/privacy",
      de: "https://eudebtmap.com/de/privacy",
      fr: "https://eudebtmap.com/fr/privacy",
      "x-default": "https://eudebtmap.com/privacy",
    },
  },
};

export default function PrivacyFR() {
  return (
    <main className="container card">
      <h2>Confidentialité & Cookies</h2>
      <p>
        EU Debt Map (« nous ») respecte votre vie privée. Cette page explique
        comment nous utilisons les données et les cookies sur ce site.
      </p>

      <h3>Publicité et Google AdSense</h3>
      <p>
        Nous affichons des publicités via Google AdSense. Google et ses partenaires
        peuvent utiliser des cookies et des technologies similaires pour diffuser des
        annonces personnalisées et non personnalisées en fonction de vos visites sur ce
        site et d’autres sites.
      </p>
      <p>
        En savoir plus :{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google – Publicité & Politique de confidentialité
        </a>
        .
      </p>

      <h3>Gestion du consentement (CMP)</h3>
      <p>
        Lors de votre première visite, une bannière de cookies et de consentement s’affiche,
        fournie par une plateforme de gestion du consentement (CMP) certifiée par Google.
        Vous pouvez modifier vos choix à tout moment via les paramètres de la CMP.
      </p>

      <h3>Analyse et performance</h3>
      <p>
        Nous pouvons utiliser des analyses de base pour comprendre l’utilisation du site.
        Celles-ci ne collectent pas d’informations personnellement identifiables.
      </p>

      <h3>Vos choix</h3>
      <ul>
        <li>Vous pouvez accepter ou refuser les cookies publicitaires via la CMP.</li>
        <li>Vous pouvez gérer ou supprimer les cookies dans les paramètres de votre navigateur.</li>
      </ul>

      <h3>Contact</h3>
      <p>
        Pour toute question, contactez-nous :{" "}
        <a href="mailto:info@eudebtmap.com">info@eudebtmap.com</a>
      </p>
    </main>
  );
}
