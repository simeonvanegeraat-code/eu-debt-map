// app/cookies/page.jsx

export const metadata = {
  title: "Cookie Policy • EU Debt Map",
  description:
    "Learn how EU Debt Map uses cookies (necessary, analytics, advertising) and how you can manage your preferences.",
  alternates: { canonical: "https://www.eudebtmap.com/cookies" },
};

export default function CookiesPage() {
  return (
    <main className="container card" style={{ padding: "24px 0 36px" }}>
      <h2 style={{ marginBottom: 8 }}>Cookie Policy</h2>
      <p className="tag" style={{ marginBottom: 16 }}>
        We use cookies to operate our website and to understand how it is used.
        In the EU/UK/CH we respect your choices via our consent banner.
      </p>

      <h3 style={{ marginTop: 24 }}>Categories</h3>
      <ul>
        <li>
          <strong>Necessary</strong> — required for core functionality and security.
        </li>
        <li>
          <strong>Analytics</strong> — helps us measure usage (Google Analytics 4).
        </li>
        <li>
          <strong>Advertising</strong> — enables showing Google AdSense ads.
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Vendors</h3>
      <ul>
        <li><strong>CookieScript</strong> — consent management (IAB TCF, Consent Mode v2).</li>
        <li><strong>Google Analytics 4</strong> — measurement & insights (after consent).</li>
        <li><strong>Google AdSense</strong> — advertising (personalized only after consent in EEA/UK/CH).</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Manage your preferences</h3>
      <p style={{ marginBottom: 12 }}>
        You can change or withdraw your consent at any time:
      </p>

      {/* Officiële CookieScript-trigger */}
      <a
        href="#"
        className="csconsentlink underline hover:no-underline"
        style={{ display: "inline-block", marginTop: 8 }}
      >
        Open cookie preferences
      </a>

      {/* Optioneel: CookieScript declaration/report embed kan hier */}
      <div style={{ marginTop: 32 }} />
    </main>
  );
}
