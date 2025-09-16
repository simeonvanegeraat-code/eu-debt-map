export const metadata = {
  title: "Datenschutzrichtlinie • EU Debt Map",
  description:
    "Datenschutz- und Cookie-Richtlinie für EU Debt Map, einschließlich Google AdSense, Google Analytics 4 und Consent-Management.",
  alternates: { canonical: "https://www.eudebtmap.com/de/privacy" },
};

export default function PrivacyPage() {
  const email = "firenature23@gmail.com";
  const lastUpdated = "16. September 2025";

  return (
    <main className="container grid gap-6 py-10">
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Datenschutz- & Cookie-Richtlinie</h1>
        <p className="mt-2 text-sm text-gray-400">Zuletzt aktualisiert: {lastUpdated}</p>
        <p className="mt-4 text-gray-300">
          EU Debt Map („wir“, „uns“) respektiert Ihre Privatsphäre. Diese Seite erklärt, welche Daten wir verarbeiten,
          wie wir Cookies verwenden und welche Wahlmöglichkeiten Sie haben.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Werbung & Google AdSense</h2>
        <p className="mt-3 text-gray-300">
          Wir verwenden Google AdSense zur Anzeige von Werbung. In der EU/UK/CH halten wir uns an die Anforderungen von Google zur Einwilligung.
          Abhängig von Ihrer Wahl zeigt Google personalisierte oder nicht-personalisierte Anzeigen.
        </p>
        <p className="mt-3">
          <a
            href="https://policies.google.com/technologies/ads?hl=de"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Weitere Informationen zu den Werbetechnologien von Google
          </a>
          .
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Consent-Management</h2>
        <p className="mt-3 text-gray-300">
          Beim ersten Besuch sehen Sie ein Zustimmungsbanner von <strong>CookieScript</strong> (IAB TCF und Google Consent Mode v2).
          Sie können Ihre Einwilligung jederzeit ändern oder widerrufen:
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <a href="#" className="csconsentlink underline hover:no-underline">
              Cookie-Einstellungen öffnen
            </a>{" "}
            (aktualisieren Sie Ihre Auswahl)
          </li>
          <li>Cookies über die Browsereinstellungen verwalten oder löschen.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analyse</h2>
        <p className="mt-3 text-gray-300">
          Wir verwenden <strong>Google Analytics 4</strong>, um die Nutzung der Website zu verstehen. In der EU/UK/CH läuft Analytics
          nur nach Ihrer Zustimmung (über Consent Mode v2). IP-Anonymisierung ist aktiviert.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Kontakt</h2>
        <p className="mt-3 text-gray-300">
          Fragen zu dieser Richtlinie? Schreiben Sie eine E-Mail an{" "}
          <a href={`mailto:${email}`} className="underline hover:no-underline">
            {email}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
