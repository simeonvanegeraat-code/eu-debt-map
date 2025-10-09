// app/de/about/page.jsx
export const metadata = {
  title: "Über & Kontakt | EU Debt Map",
  description:
    "Erfahren Sie mehr über EU Debt Map, warum es erstellt wurde und wie Sie Kontakt aufnehmen können.",
  alternates: { canonical: "https://www.eudebtmap.com/de/about" },
  openGraph: {
    title: "Über & Kontakt | EU Debt Map",
    description:
      "EU Debt Map ist ein unabhängiges Hobbyprojekt zur Visualisierung der Staatsschulden der EU-27. Kontakt zu Simeon per E-Mail für Feedback oder Fragen.",
    url: "https://www.eudebtmap.com/de/about",
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function AboutPageDE() {
  const email = "firenature23@gmail.com";

  return (
    <main className="container grid gap-6 py-10">
      {/* Intro */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Über & Kontakt</h1>
        <p className="mt-4 text-gray-300">👋 Hallo, ich bin <strong>Simeon</strong>.</p>
        <p className="mt-3 text-gray-300">
          Ich habe <strong>EU Debt Map</strong> als persönliches Hobbyprojekt erstellt.
          Ich interessiere mich für Wirtschaft und Daten und wollte etwas bauen, das
          komplexe Zahlen – wie die Staatsverschuldung – leichter verständlich macht.
        </p>
        <p className="mt-3 text-gray-300">
          Diese Seite ist unabhängig: Ich bin Teil keiner Regierung oder Institution.
          Es ist nur ein Experiment mit Webentwicklung und Datenvisualisierung.
        </p>
        <p className="mt-3 text-gray-300">
          Da ich viel lerne und die Seite fortlaufend verbessere, freue ich mich über
          Feedback. Wenn Sie Fehler entdecken oder Ideen haben – oder einfach Hallo
          sagen möchten:
        </p>
        <p className="mt-3 text-gray-200 font-semibold">
          📧 <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>
        </p>
      </section>

      {/* Projekt */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Über das Projekt</h2>
        <p className="mt-3 text-gray-300">
          EU Debt Map ist eine pädagogische Visualisierung der Staatsschulden in der EU-27.
          Wir kombinieren die beiden jüngsten Eurostat-Referenzzeiträume, um eine
          live tickende Schätzung pro Land zu berechnen. Ziel ist es, Bewusstsein zu
          schaffen und Finanzdaten leichter verständlich zu machen.
        </p>
        <p className="mt-3 text-gray-300">
          Details und Quellen finden Sie auf der Seite{" "}
          <a href="/de/methodology" className="underline hover:no-underline">Methodology</a>.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Hinweis: Schätzungen dienen nur Bildungszwecken und sind keine offiziellen Statistiken.
        </p>
      </section>

      {/* Kontakt */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Kontakt aufnehmen</h2>
        <p className="mt-3 text-gray-300">
          Sie können mich jederzeit per E-Mail erreichen oder Updates in sozialen Medien verfolgen.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href={`mailto:${email}`} className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            E-Mail an Simeon
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            Auf X (Twitter) folgen
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
            url: "https://www.eudebtmap.com/de",
            email,
            description:
              "Unabhängiges Hobbyprojekt zur Visualisierung der EU-Staatsschulden mit Live-Schätzungen.",
          }),
        }}
      />
    </main>
  );
}
