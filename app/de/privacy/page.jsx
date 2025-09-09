export const metadata = {
  title: "Datenschutzrichtlinie • EU Debt Map",
  description:
    "Datenschutz- und Cookie-Richtlinie für EU Debt Map, einschließlich Google AdSense und Einwilligungsmanagement.",
  alternates: { canonical: "https://www.eudebtmap.com/de/privacy" },
};

export default function PrivacyPage() {
  const email = "firenature23@gmail.com";
  const lastUpdated = "9. September 2025";

  return (
    <main className="container grid gap-6 py-10">
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Datenschutz- & Cookie-Richtlinie</h1>
        <p className="mt-2 text-sm text-gray-400">Zuletzt aktualisiert: {lastUpdated}</p>
        <p className="mt-4 text-gray-300">
          EU Debt Map („wir“) respektiert Ihre Privatsphäre. Diese Seite erklärt, welche Daten wir verarbeiten,
          wie wir Cookies verwenden und welche Wahlmöglichkeiten Sie haben.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Werbung & Google AdSense</h2>
        <p className="mt-3 text-gray-300">
          Wir verwenden Google AdSense, um Anzeigen anzuzeigen. Google und seine Partner können Cookies oder
          ähnliche Technologien verwenden, um personalisierte und nicht-personalisierte Anzeigen basierend auf
          Ihren Besuchen auf dieser und anderen Websites bereitzustellen.
        </p>
        <p className="mt-3">
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Weitere Informationen über Googles Werbetechnologien
          </a>
          .
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Einwilligungsmanagement</h2>
        <p className="mt-3 text-gray-300">
          Beim ersten Besuch sehen Sie ein Cookie-Banner, das von Cookiebot (einem von Google zertifizierten CMP)
          gesteuert wird. Sie können Ihre Einwilligung jederzeit ändern oder widerrufen:
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <a href="javascript:Cookiebot.renew()" className="underline hover:no-underline">
              Cookie-Einstellungen öffnen
            </a>{" "}
            (öffnet das Banner erneut zur Aktualisierung Ihrer Auswahl)
          </li>
          <li>Cookies in den Einstellungen Ihres Browsers verwalten oder löschen</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="mt-3 text-gray-300">
          Wir verwenden einfache, datenschutzfreundliche Analytics, um die Nutzung der Website zu verstehen.
          Diese sammeln keine personenbezogenen Daten.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Kontakt</h2>
        <p className="mt-3 text-gray-300">
          Fragen zu dieser Richtlinie? Schreiben Sie an{" "}
          <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>.
        </p>
      </section>
    </main>
  );
}
