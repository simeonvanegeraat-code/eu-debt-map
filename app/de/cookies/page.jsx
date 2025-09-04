export const metadata = {
  title: "Cookies • EU Debt Map",
  description: "Cookie-Übersicht und Einwilligungseinstellungen für EU Debt Map.",
};

export default function CookiesDE() {
  return (
    <main className="container card">
      <h2>Cookies</h2>
      <p className="tag" style={{ marginBottom: 12 }}>
        Diese Seite zeigt die aktuellen Cookie-Kategorien auf dieser Website. Sie können Ihre Einwilligung über das Banner ändern.
      </p>

      <script
        id="CookieDeclaration"
        src="https://consent.cookiebot.com/1c8b9798-d35e-4e4f-a808-8d5053cc6a97/cd.js"
        type="text/javascript"
        data-culture="de"
        async
      ></script>
      <div id="CookieDeclaration"></div>
    </main>
  );
}
