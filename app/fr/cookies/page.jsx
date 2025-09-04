export const metadata = {
  title: "Cookies • EU Debt Map",
  description: "Aperçu des cookies et préférences de consentement pour EU Debt Map.",
};

export default function CookiesFR() {
  return (
    <main className="container card">
      <h2>Cookies</h2>
      <p className="tag" style={{ marginBottom: 12 }}>
        Cette page affiche les catégories de cookies utilisées sur ce site. Vous pouvez modifier votre consentement via la bannière.
      </p>

      <script
        id="CookieDeclaration"
        src="https://consent.cookiebot.com/1c8b9798-d35e-4e4f-a808-8d5053cc6a97/cd.js"
        type="text/javascript"
        data-culture="fr"
        async
      ></script>
      <div id="CookieDeclaration"></div>
    </main>
  );
}
