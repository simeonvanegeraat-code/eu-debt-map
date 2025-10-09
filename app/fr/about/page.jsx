// app/fr/about/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/about";
  const title = "À propos & Contact | EU Debt Map";
  const description = "En savoir plus sur EU Debt Map, pourquoi le site a été créé et comment nous contacter.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/fr${path}`,
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
        "EU Debt Map est un projet indépendant visualisant la dette publique des pays de l’UE-27.",
      url: `${base}/fr${path}`,
      siteName: "EU Debt Map",
      type: "website",
    },
  };
}

export default function AboutPageFR() {
  const email = "firenature23@gmail.com";
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Simeon",
    url: "https://www.eudebtmap.com",
    email,
    description:
      "Projet indépendant visualisant la dette publique de l’UE avec des estimations en direct.",
  };

  return (
    <main className="container grid gap-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      {/* Contenu provisoirement en anglais */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">About & Contact</h1>
        <p className="mt-4 text-gray-300">👋 Hi, I’m <strong>Simeon</strong>.</p>
        {/* ... */}
      </section>
    </main>
  );
}
