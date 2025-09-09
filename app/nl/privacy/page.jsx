export const metadata = {
  title: "Privacybeleid • EU Debt Map",
  description:
    "Privacy- en cookiebeleid voor EU Debt Map, inclusief Google AdSense en toestemmingsbeheer.",
  alternates: { canonical: "https://www.eudebtmap.com/nl/privacy" },
};

export default function PrivacyPage() {
  const email = "firenature23@gmail.com";
  const lastUpdated = "9 september 2025";

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
          Wij gebruiken Google AdSense om advertenties weer te geven. Google en zijn partners kunnen cookies
          of vergelijkbare technologieën gebruiken om gepersonaliseerde en niet-gepersonaliseerde advertenties
          te tonen op basis van je bezoeken aan deze en andere websites.
        </p>
        <p className="mt-3">
          <a
            href="https://policies.google.com/technologies/ads"
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
          Bij je eerste bezoek zie je een cookiebanner die wordt aangestuurd door Cookiebot (een door Google
          gecertificeerd CMP). Je kunt je toestemming altijd wijzigen of intrekken:
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <a href="javascript:Cookiebot.renew()" className="underline hover:no-underline">
              Open cookie-instellingen
            </a>{" "}
            (open het banner opnieuw om je keuzes bij te werken)
          </li>
          <li>Beheer of verwijder cookies via de instellingen van je browser</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="mt-3 text-gray-300">
          Wij gebruiken eenvoudige, privacyvriendelijke analytics om sitegebruik te begrijpen. Deze verzamelen
          geen persoonlijk identificeerbare informatie.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="mt-3 text-gray-300">
          Vragen over dit beleid? Mail naar{" "}
          <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>.
        </p>
      </section>
    </main>
  );
}
