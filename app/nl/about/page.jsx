// app/nl/about/page.jsx
export const metadata = {
  title: "Over & Contact | EU Debt Map",
  description:
    "Lees over EU Debt Map, waarom het is gemaakt en hoe je contact kunt opnemen.",
  alternates: { canonical: "https://www.eudebtmap.com/nl/about" },
  openGraph: {
    title: "Over & Contact | EU Debt Map",
    description:
      "EU Debt Map is een onafhankelijk hobbyproject om de staatsschuld van de EU-27 te visualiseren. Neem per e-mail contact op met Simeon voor feedback of vragen.",
    url: "https://www.eudebtmap.com/nl/about",
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function AboutPageNL() {
  const email = "firenature23@gmail.com";

  return (
    <main className="container grid gap-6 py-10">
      {/* Intro */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Over & Contact</h1>
        <p className="mt-4 text-gray-300">👋 Hoi, ik ben <strong>Simeon</strong>.</p>
        <p className="mt-3 text-gray-300">
          Ik maakte <strong>EU Debt Map</strong> als hobbyproject. Ik ben nieuwsgierig naar economie
          en data en wilde iets bouwen dat grote cijfers – zoals staatsschuld – begrijpelijker maakt.
        </p>
        <p className="mt-3 text-gray-300">
          Deze site is onafhankelijk: ik hoor niet bij een overheid of instelling. Het is gewoon
          ik die experimenteert met webdevelopment en datavisualisatie.
        </p>
        <p className="mt-3 text-gray-300">
          Omdat ik nog leer en de site blijf verbeteren, is jouw feedback super waardevol. Zie je
          fouten, heb je ideeën voor features, of wil je gewoon hallo zeggen?
        </p>
        <p className="mt-3 text-gray-200 font-semibold">
          📧 <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>
        </p>
      </section>

      {/* Project */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Over het project</h2>
        <p className="mt-3 text-gray-300">
          EU Debt Map is een educatieve visualisatie van overheidsschuld in de EU-27.
          We combineren de twee meest recente Eurostat-peilmomenten om per land een
          live, tikkende schatting te laten zien. Doel: bewustzijn vergroten en
          complexe financiële data toegankelijk maken.
        </p>
        <p className="mt-3 text-gray-300">
          Zie voor details en bronnen de pagina{" "}
          <a href="/nl/methodology" className="underline hover:no-underline">Methodology</a>.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Disclaimer: schattingen zijn uitsluitend bedoeld voor educatieve doeleinden en geen
          officiële statistiek.
        </p>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Contact houden</h2>
        <p className="mt-3 text-gray-300">
          Je kunt me altijd mailen of updates volgen via social media.
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

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Simeon",
            url: "https://www.eudebtmap.com/nl",
            email,
            description:
              "Onafhankelijk hobbyproject dat EU-staatsschuld visualiseert met live schattingen.",
          }),
        }}
      />
    </main>
  );
}
