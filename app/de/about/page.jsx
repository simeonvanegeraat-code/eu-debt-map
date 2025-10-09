// app/de/about/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/about";
  const title = "Über & Kontakt | EU Debt Map";
  const description = "Erfahren Sie, warum EU Debt Map erstellt wurde und wie Sie Kontakt aufnehmen können.";

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
        "EU Debt Map ist ein unabhängiges Hobbyprojekt, das die Staatsverschuldung der EU-27 visualisiert. Kontaktieren Sie Simeon für Feedback oder Fragen.",
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
    description:
      "Unabhängiges Projekt zur Visualisierung der EU-Staatsverschuldung mit Live-Schätzungen.",
  };

  return (
    <main className="container grid gap-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Über & Kontakt</h1>
        <p className="mt-4 text-gray-300">👋 Hallo, ich bin <strong>Simeon</strong>.</p>
        <p className="mt-3 text-gray-300">
          Ich habe <strong>EU Debt Map</strong> als persönliches Hobbyprojekt erstellt. 
          Ich interessiere mich für Wirtschaft und Daten und wollte komplexe Zahlen – wie Staatsverschuldung – verständlicher machen.
        </p>
        <p className="mt-3 text-gray-300">
          Diese Seite ist unabhängig: Ich arbeite für keine Regierung oder Institution.
          Es ist ein Lernprojekt rund um Webentwicklung und Datenvisualisierung.
        </p>
        <p className="mt-3 text-gray-300">
          Feedback ist willkommen! Wenn Sie Fehler bemerken oder Ideen haben:
        </p>
        <p className="mt-3 text-gray-200 font-semibold">
          📧 <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Über das Projekt</h2>
        <p className="mt-3 text-gray-300">
          EU Debt Map ist eine Bildungsvisualisierung der Staatsverschuldung in der EU-27.
          Wir kombinieren die zwei neuesten Eurostat-Daten, um eine Live-Schätzung pro Land zu zeigen.
        </p>
        <p className="mt-3 text-gray-300">
          Details zur Berechnung und Quellen finden Sie auf der Seite{" "}
          <a href="/de/methodology" className="underline hover:no-underline">Methodik</a>.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Hinweis: Die Schätzungen dienen nur zu Bildungszwecken und sind keine offiziellen Statistiken.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Kontakt aufnehmen</h2>
        <p className="mt-3 text-gray-300">
          Sie können mich jederzeit per E-Mail erreichen oder Updates auf X (Twitter) folgen.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href={`mailto:${email}`} className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            E-Mail an Simeon
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            Folge auf X (Twitter)
          </a>
        </div>
      </section>
    </main>
  );
}
