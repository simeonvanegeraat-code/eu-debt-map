// app/nl/about/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/about";
  const title = "Over & Contact | EU Debt Map";
  const description = "Lees meer over EU Debt Map, waarom het is gemaakt en hoe je contact opneemt.";

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
        "EU Debt Map is een onafhankelijk hobbyproject dat de staatsschuld van EU-27 visualiseert. Neem contact op met Simeon voor feedback of vragen.",
      url: `${base}/nl${path}`,
      siteName: "EU Debt Map",
      type: "website",
    },
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

      {/* Inhoud voorlopig Engels */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">About & Contact</h1>
        <p className="mt-4 text-gray-300">👋 Hi, I’m <strong>Simeon</strong>.</p>
        <p className="mt-3 text-gray-300">
          I created <strong>EU Debt Map</strong> as a personal hobby project...
        </p>
        <p className="mt-3 text-gray-200 font-semibold">
          📧 <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">About the Project</h2>
        <p className="mt-3 text-gray-300">
          EU Debt Map is an educational visualization of government debt across the EU-27...
        </p>
        <p className="mt-3 text-gray-300">
          For detailed calculations and sources, please see our{" "}
          <a href="/nl/methodology" className="underline hover:no-underline">Methodology</a> page.
        </p>
      </section>
    </main>
  );
}
