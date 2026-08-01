import GoogleConsentSettingsLink from "@/components/GoogleConsentSettingsLink";

export const metadata = {
  title: "Cookie-Richtlinie • EU Debt Map",
  description:
    "Erfahren Sie, wie EU Debt Map Cookies verwendet (erforderlich, Analyse, Werbung) und wie Sie Ihre Präferenzen verwalten.",
  alternates: { canonical: "https://www.eudebtmap.com/de/cookies" },
};

export default function CookiesPageDE() {
  return (
    <main className="container card" style={{ padding: "24px 0 36px" }}>
      <h2 style={{ marginBottom: 8 }}>Cookie-Richtlinie</h2>
      <p className="tag" style={{ marginBottom: 16 }}>
        Wir verwenden Cookies, um unsere Website zu betreiben und zu verstehen, wie sie genutzt wird.
        In der EU/UK/CH respektieren wir Ihre Wahl über unser Consent-Banner.
      </p>

      <h3 style={{ marginTop: 24 }}>Kategorien</h3>
      <ul>
        <li>
          <strong>Erforderlich</strong> — notwendig für Kernfunktionen und Sicherheit.
        </li>
        <li>
          <strong>Analyse</strong> — Vercel Web Analytics misst die aggregierte Nutzung ohne Analyse-Cookies.
        </li>
        <li>
          <strong>Werbung</strong> — ermöglicht die Anzeige von Google AdSense-Anzeigen.
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Anbieter</h3>
      <ul>
        <li><strong>Google Consent Management Platform</strong> — Einwilligungsverwaltung über Datenschutz &amp; Mitteilungen (IAB TCF).</li>
        <li><strong>Google AdSense</strong> — Werbung entsprechend der Auswahl in Googles Einwilligungsnachricht.</li>
        <li><strong>Vercel Web Analytics</strong> — aggregierte Website-Analyse ohne Cookies.</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Präferenzen verwalten</h3>
      <p style={{ marginBottom: 12 }}>
        Sie können Ihre Einwilligung jederzeit ändern oder widerrufen:
      </p>

      <GoogleConsentSettingsLink
        className="underline hover:no-underline"
        style={{ display: "inline-block", marginTop: 8 }}
      >
        Datenschutz- und Cookie-Einstellungen öffnen
      </GoogleConsentSettingsLink>

      <div style={{ marginTop: 32 }} />
    </main>
  );
}
