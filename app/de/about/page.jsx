// app/de/about/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/about";
  const title = "Über & Kontakt | EU Debt Map";
  const description = "Erfahren Sie mehr über EU Debt Map, warum es erstellt wurde und wie Sie Kontakt aufnehmen.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/de${path}`,
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
        "EU Debt Map ist ein unabhängiges Hobbyprojekt zur Visualisierung der Staatsschulden der EU-27.",
      url: `${base}/de${path}`,
      siteName: "EU Debt Map",
      type: "website",
    },
  };
}

export default function AboutPageDE() {
  const email = "firenature23@gmail.com";
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Simeon",
    url: "https://www.eudebtmap.com",
    email,
    description: "Unabhängiges Hobbyprojekt mit Live-Schätzungen zur EU-Staatsverschuldung.",
  };

  return (
    <main className="container grid gap-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      {/* Inhalt vorerst Englisch */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">About & Contact</h1>
        <p className="mt-4 text-gray-300">👋 Hi, I’m <strong>Simeon</strong>.</p>
        {/* ... */}
      </section>
    </main>
  );
}
