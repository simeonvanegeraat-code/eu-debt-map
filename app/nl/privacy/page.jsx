export const metadata = {
  title: "Privacy & Cookies • EU Debt Map",
  description: "Privacy- en cookiebeleid van EU Debt Map en gebruik van Google AdSense.",
};

export default function PrivacyNL() {
  return (
    <main className="container card">
      <h2>Privacy & Cookies</h2>
      <p>
        EU Debt Map (“wij”) respecteert je privacy. Deze pagina legt uit hoe we omgaan met gegevens en cookies.
      </p>

      <h3>Advertenties en Google AdSense</h3>
      <p>
        We tonen advertenties via Google AdSense. Google en partners gebruiken cookies om gepersonaliseerde en niet-gepersonaliseerde advertenties weer te geven.
      </p>
      <p>
        Meer info:{" "}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
          Google’s advertentiebeleid
        </a>.
      </p>

      <h3>Cookiebot (CMP)</h3>
      <p>
        Bij je eerste bezoek verschijnt een banner van Cookiebot (een Google-gecertificeerde Consent Management Platform). Je kunt je keuzes altijd aanpassen via de banner.
      </p>

      <h3>Analytics</h3>
      <p>
        We gebruiken basis analytics om sitegebruik te begrijpen. Deze gegevens zijn niet direct identificeerbaar.
      </p>

      <h3>Jouw keuzes</h3>
      <ul>
        <li>Cookies accepteren of weigeren via de Cookiebot-banner.</li>
        <li>Cookies beheren of verwijderen via je browserinstellingen.</li>
      </ul>

      <h3>Contact</h3>
      <p>Vragen? Mail ons via info@eudebtmap.com</p>
    </main>
  );
}
