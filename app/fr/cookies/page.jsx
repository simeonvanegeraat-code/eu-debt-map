import GoogleConsentSettingsLink from "@/components/GoogleConsentSettingsLink";

export const metadata = {
  title: "Politique relative aux cookies • EU Debt Map",
  description:
    "Découvrez comment EU Debt Map utilise les cookies (nécessaires, analytiques, publicitaires) et comment gérer vos préférences.",
  alternates: { canonical: "https://www.eudebtmap.com/fr/cookies" },
};

export default function CookiesPageFR() {
  return (
    <div className="container card" style={{ paddingTop: 24, paddingBottom: 36 }}>
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
          <strong>Analytiques</strong> — Vercel Web Analytics mesure l&apos;usage agrégé sans cookies analytiques.
        </li>
        <li>
          <strong>Publicitaires</strong> — permet l’affichage des annonces Google AdSense.
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Partenaires</h3>
      <ul>
        <li><strong>Google Consent Management Platform</strong> — gestion du consentement via Confidentialité et messages (IAB TCF).</li>
        <li><strong>Google AdSense</strong> — publicité selon les choix effectués dans le message de consentement de Google.</li>
        <li><strong>Vercel Web Analytics</strong> — analyse agrégée du site sans cookies.</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Gérer vos préférences</h3>
      <p style={{ marginBottom: 12 }}>
        Vous pouvez modifier ou retirer votre consentement à tout moment :
      </p>

      <GoogleConsentSettingsLink
        className="underline hover:no-underline"
        style={{ display: "inline-block", marginTop: 8 }}
      >
        Ouvrir les paramètres de confidentialité et de cookies
      </GoogleConsentSettingsLink>

      <div style={{ marginTop: 32 }} />
    </div>
  );
}
