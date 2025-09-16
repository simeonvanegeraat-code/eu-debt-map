export const metadata = {
  title: "Politique relative aux cookies • EU Debt Map",
  description:
    "Découvrez comment EU Debt Map utilise les cookies (nécessaires, analytiques, publicitaires) et comment gérer vos préférences.",
  alternates: { canonical: "https://www.eudebtmap.com/fr/cookies" },
};

export default function CookiesPageFR() {
  return (
    <main className="container card" style={{ padding: "24px 0 36px" }}>
      <h2 style={{ marginBottom: 8 }}>Politique relative aux cookies</h2>
      <p className="tag" style={{ marginBottom: 16 }}>
        Nous utilisons des cookies pour faire fonctionner notre site et comprendre son utilisation.
        Dans l’UE/UK/CH, nous respectons vos choix via notre bannière de consentement.
      </p>

      <h3 style={{ marginTop: 24 }}>Catégories</h3>
      <ul>
        <li>
          <strong>Nécessaires</strong> — requis pour les fonctions essentielles et la sécurité.
        </li>
        <li>
          <strong>Analytiques</strong> — nous aide à mesurer l’usage (Google Analytics 4).
        </li>
        <li>
          <strong>Publicitaires</strong> — permet l’affichage des annonces Google AdSense.
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Partenaires</h3>
      <ul>
        <li><strong>CookieScript</strong> — gestion du consentement (IAB TCF, Consent Mode v2).</li>
        <li><strong>Google Analytics 4</strong> — mesure & insights (après consentement).</li>
        <li><strong>Google AdSense</strong> — publicité (personnalisée uniquement après consentement en UE/UK/CH).</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Gérer vos préférences</h3>
      <p style={{ marginBottom: 12 }}>
        Vous pouvez modifier ou retirer votre consentement à tout moment :
      </p>

      <a
        href="#"
        className="csconsentlink underline hover:no-underline"
        style={{ display: "inline-block", marginTop: 8 }}
      >
        Ouvrir les préférences de cookies
      </a>

      <div style={{ marginTop: 32 }} />
    </main>
  );
}
