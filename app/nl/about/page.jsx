// app/nl/about/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/about";
  const title = "Over & Contact | EU Debt Map";
  const description = "Lees waarom EU Debt Map is gemaakt en hoe je contact kunt opnemen.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/nl${path}`,
      languages: {
        en: `${base}${path}`,
        nl: `${base}/nl${path}`,
        de: `${base}/de${path}`,
        fr: `${base}/fr${path}`,
        "x-default": `${base}${path}`,
      },
    },
    openGraph: {
      title,
      description:
        "EU Debt Map is een onafhankelijk hobbyproject dat de staatsschuld van de EU-27 visualiseert. Neem contact op met Simeon voor feedback of vragen.",
      url: `${base}/nl${path}`,
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}

export default function AboutPageNL() {
  const email = "firenature23@gmail.com";
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Simeon",
    url: "https://www.eudebtmap.com",
    email,
    description:
      "Onafhankelijk hobbyproject dat EU-staatsschuld met live schattingen visualiseert.",
  };

  return (
    <main className="container grid gap-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      {/* Intro */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Over & Contact</h1>
        <p className="mt-4 text-gray-300">👋 Hoi, ik ben <strong>Simeon</strong>.</p>
        <p className="mt-3 text-gray-300">
          Ik bouwde <strong>EU Debt Map</strong> als persoonlijk hobbyproject. Ik ben nieuwsgierig
          naar economie en data, en wilde complexe cijfers—zoals staatsschuld—makkelijker maakbaar maken.
        </p>
        <p className="mt-3 text-gray-300">
          Deze site is onafhankelijk: ik werk niet voor een overheid of instelling.
          Het is een experimenteel project rond webontwikkeling en datavisualisatie.
        </p>
        <p className="mt-3 text-gray-300">
          Feedback is welkom! Zie je fouten, heb je ideeën of wil je gewoon hallo zeggen?
        </p>
        <p className="mt-3 text-gray-200 font-semibold">
          📧 <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>
        </p>
      </section>

      {/* Project */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Over het project</h2>
        <p className="mt-3 text-gray-300">
          EU Debt Map is een educatieve visualisatie van overheidsschulden in de EU-27.
          We combineren de laatste twee Eurostat-referentieperioden tot een live, tikkende schatting per land.
          Doel: bewustwording creëren en grote cijfers begrijpelijk maken.
        </p>
        <p className="mt-3 text-gray-300">
          Voor details over berekeningen en bronnen, zie onze{" "}
          <a href="/nl/methodology" className="underline hover:no-underline">Methodologie</a>.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Disclaimer: schattingen zijn educatief en geen officiële statistiek.
        </p>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Contact houden</h2>
        <p className="mt-3 text-gray-300">
          Je kunt altijd mailen, of updates volgen via social media.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href={`mailto:${email}`} className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            Mail Simeon
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            Volg op X (Twitter)
          </a>
        </div>
      </section>
    </main>
  );
}
