import GoogleConsentSettingsLink from "@/components/GoogleConsentSettingsLink";

export const metadata = {
  title: "Privacybeleid • EU Debt Map",
  description:
    "Privacy- en cookiebeleid voor EU Debt Map, inclusief Google AdSense, Googles toestemmingsbeheer en Vercel Web Analytics.",
  alternates: { canonical: "https://www.eudebtmap.com/nl/privacy" },
};

export default function PrivacyPage() {
  const email = "info@eudebtmap.com";
  const lastUpdated = "1 augustus 2026";

  return (
    <main className="container grid gap-6 py-10">
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy- & Cookiebeleid</h1>
        <p className="mt-2 text-sm text-gray-400">Laatst bijgewerkt: {lastUpdated}</p>
        <p className="mt-4 text-gray-300">
          EU Debt Map (“wij”, “ons”) respecteert je privacy. Deze pagina legt uit welke gegevens we verwerken,
          hoe we cookies gebruiken en welke keuzes je hebt.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Advertenties & Google AdSense</h2>
        <p className="mt-3 text-gray-300">
          Wij gebruiken Google AdSense om advertenties weer te geven. In de EU/EEA/UK/CH volgen we Google’s vereisten voor toestemming.
          Afhankelijk van je keuze kan Google gepersonaliseerde of niet-gepersonaliseerde advertenties tonen.
        </p>
        <p className="mt-3">
          <a
            href="https://policies.google.com/technologies/ads?hl=nl"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Meer informatie over Google’s advertentietechnologieën
          </a>
          .
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Toestemmingsbeheer</h2>
        <p className="mt-3 text-gray-300">
          Bij je eerste bezoek in de EER, het Verenigd Koninkrijk of Zwitserland kan Googles gepubliceerde toestemmingsbericht verschijnen.
          Dit wordt beheerd via <strong>Google Privacy en berichten</strong> in AdSense en ondersteunt het IAB Transparency and Consent Framework (TCF).
          Je kunt je toestemming altijd wijzigen of intrekken:
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <GoogleConsentSettingsLink className="underline hover:no-underline">
              Open privacy- en cookie-instellingen
            </GoogleConsentSettingsLink>{" "}
            (pas je keuzes aan)
          </li>
          <li>Beheer of verwijder cookies via je browserinstellingen.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analyse</h2>
        <p className="mt-3 text-gray-300">
          We gebruiken <strong>Vercel Web Analytics</strong> voor geaggregeerde verkeersstatistieken. Volgens Vercel slaat deze
          analysedienst geanonimiseerde gegevens op en gebruikt deze geen cookies. Lees meer in Vercels{" "}
          <a
            href="https://vercel.com/docs/analytics/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            documentatie over privacy en naleving
          </a>
          .
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="mt-3 text-gray-300">
          Vragen over dit beleid? Mail{" "}
          <a href={`mailto:${email}`} className="underline hover:no-underline">
            {email}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
