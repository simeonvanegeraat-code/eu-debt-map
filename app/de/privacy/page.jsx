export const metadata = {
  title: "Datenschutz & Cookies • EU Debt Map",
  description: "Datenschutz- und Cookie-Richtlinie von EU Debt Map sowie Verwendung von Google AdSense.",
  alternates: {
    canonical: "https://eudebtmap.com/de/privacy",
    languages: {
      en: "https://eudebtmap.com/privacy",
      nl: "https://eudebtmap.com/nl/privacy",
      de: "https://eudebtmap.com/de/privacy",
      fr: "https://eudebtmap.com/fr/privacy",
      "x-default": "https://eudebtmap.com/privacy",
    },
  },
};

export default function PrivacyDE() {
  return (
    <main className="container card">
      <h2>Datenschutz & Cookies</h2>
      <p>
        EU Debt Map („wir“, „uns“) respektiert Ihre Privatsphäre. Diese Seite erklärt,
        wie wir auf dieser Website mit Daten und Cookies umgehen.
      </p>

      <h3>Werbung und Google AdSense</h3>
      <p>
        Wir verwenden Google AdSense zur Anzeigenschaltung. Google und Partner können
        Cookies und ähnliche Technologien verwenden, um personalisierte und nicht
        personalisierte Anzeigen auf Basis Ihrer Besuche auf dieser und anderen Websites
        bereitzustellen.
      </p>
      <p>
        Weitere Informationen:{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google – Werbung & Datenschutz
        </a>
        .
      </p>

      <h3>Einwilligungsverwaltung (CMP)</h3>
      <p>
        Beim ersten Besuch erscheint ein Cookie- und Einwilligungsbanner eines
        von Google zertifizierten Consent Management Platforms (CMP). Sie können
        Ihre Auswahl jederzeit über die CMP-Einstellungen ändern.
      </p>

      <h3>Analytics und Performance</h3>
      <p>
        Wir können grundlegende Analytics einsetzen, um die Nutzung der Website zu verstehen.
        Diese erheben keine direkt identifizierenden Daten.
      </p>

      <h3>Ihre Optionen</h3>
      <ul>
        <li>Sie können Werbe-Cookies über die CMP akzeptieren oder ablehnen.</li>
        <li>Sie können Cookies in Ihren Browsereinstellungen verwalten oder löschen.</li>
      </ul>

      <h3>Kontakt</h3>
      <p>
        Fragen zu dieser Richtlinie? Kontaktieren Sie uns unter:{" "}
        <a href="mailto:info@eudebtmap.com">info@eudebtmap.com</a>
      </p>
    </main>
  );
}
