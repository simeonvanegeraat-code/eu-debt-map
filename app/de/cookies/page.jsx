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
          <strong>Analyse</strong> — hilft uns, die Nutzung zu messen (Google Analytics 4).
        </li>
        <li>
          <strong>Werbung</strong> — ermöglicht die Anzeige von Google AdSense-Anzeigen.
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Anbieter</h3>
      <ul>
        <li><strong>CookieScript</strong> — Consent-Management (IAB TCF, Consent Mode v2).</li>
        <li><strong>Google Analytics 4</strong> — Messung & Insights (nach Einwilligung).</li>
        <li><strong>Google AdSense</strong> — Werbung (personalisiert nur nach Einwilligung in EWR/UK/CH).</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Präferenzen verwalten</h3>
      <p style={{ marginBottom: 12 }}>
        Sie können Ihre Einwilligung jederzeit ändern oder widerrufen:
      </p>

      <a
        href="#"
        className="csconsentlink underline hover:no-underline"
        style={{ display: "inline-block", marginTop: 8 }}
      >
        Cookie-Einstellungen öffnen
      </a>

      <div style={{ marginTop: 32 }} />
    </main>
  );
}
