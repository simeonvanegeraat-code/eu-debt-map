export const metadata = {
  title: "Cookies • EU Debt Map",
  description: "Cookie overview and consent settings for EU Debt Map.",
};

export default function CookiesPage() {
  return (
    <main className="container card">
      <h2>Cookies</h2>
      <p className="tag" style={{ marginBottom: 12 }}>
        This page shows the current cookie categories detected on this site. You can change your consent in the banner.
      </p>

      {/* Cookiebot declaration script renders the table below */}
      <script
        id="CookieDeclaration"
        src="https://consent.cookiebot.com/1c8b9798-d35e-4e4f-a808-8d5053cc6a97/cd.js"
        type="text/javascript"
        data-culture="en"
        async
      ></script>
      <div id="CookieDeclaration"></div>
    </main>
  );
}
