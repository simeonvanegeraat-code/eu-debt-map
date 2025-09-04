export const metadata = {
  title: "Cookies • EU Debt Map",
  description: "Cookie-overzicht en toestemmingsinstellingen voor EU Debt Map.",
};

export default function CookiesNL() {
  return (
    <main className="container card">
      <h2>Cookies</h2>
      <p className="tag" style={{ marginBottom: 12 }}>
        Op deze pagina zie je de huidige cookiecategorieën op deze site. Je kunt je toestemming wijzigen via de banner.
      </p>

      <script
        id="CookieDeclaration"
        src="https://consent.cookiebot.com/1c8b9798-d35e-4e4f-a808-8d5053cc6a97/cd.js"
        type="text/javascript"
        data-culture="nl"
        async
      ></script>
      <div id="CookieDeclaration"></div>
    </main>
  );
}
