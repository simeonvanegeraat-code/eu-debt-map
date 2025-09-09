export const metadata = {
  title: "Over & Contact | EU Debt Map",
  description:
    "Lees meer over EU Debt Map, waarom het is gemaakt en hoe je contact kunt opnemen.",
  alternates: { canonical: "https://www.eudebtmap.com/nl/about" },
  openGraph: {
    title: "Over & Contact | EU Debt Map",
    description:
      "EU Debt Map is een onafhankelijk hobbyproject om de staatsschuld van de EU-27 te visualiseren. Neem contact op met Simeon via e-mail voor feedback of vragen.",
    url: "https://www.eudebtmap.com/nl/about",
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function AboutPage() {
  const email = "firenature23@gmail.com";

  return (
    <main className="container grid gap-6 py-10">
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Over & Contact</h1>
        <p className="mt-4 text-gray-300">👋 Hoi, ik ben <strong>Simeon</strong>.</p>
        <p className="mt-3 text-gray-300">
          Ik heb <strong>EU Debt Map</strong> gemaakt als een persoonlijk hobbyproject.  
          Ik ben altijd nieuwsgierig geweest naar economie en data, en wilde iets bouwen dat complexe cijfers, zoals staatsschuld, begrijpelijker maakt.
        </p>
        <p className="mt-3 text-gray-300">
          Deze site is onafhankelijk: ik ben geen onderdeel van een overheid of instelling.  
          Het is gewoon ik, al experimenterend met webontwikkeling en datavisualisatie.
        </p>
        <p className="mt-3 text-gray-300">
          Omdat ik nog steeds leer en de site verbeter, is feedback erg welkom.  
          Zie je fouten, heb je ideeën voor nieuwe functies of wil je gewoon hallo zeggen?
        </p>
        <p className="mt-3 text-gray-200 font-semibold">
          📧 <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Over het project</h2>
        <p className="mt-3 text-gray-300">
          EU Debt Map is een educatieve visualisatie van overheidsschulden in de EU-27.  
          We combineren de twee meest recente Eurostat-referentieperiodes om een live, doortikkende schatting per land te berekenen.  
          Ons doel is bewustwording te creëren en financiële data toegankelijk te maken.
        </p>
        <p className="mt-3 text-gray-300">
          Voor gedetailleerde berekeningen en bronnen, zie de{" "}
          <a href="/nl/methodology" className="underline hover:no-underline">Methodologie</a>-pagina.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Disclaimer: Schattingen zijn uitsluitend voor educatieve doeleinden en geen officiële statistieken.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Contact opnemen</h2>
        <p className="mt-3 text-gray-300">
          Je kunt me altijd direct per e-mail bereiken, of updates volgen via sociale media.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href={`mailto:${email}`} className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">E-mail Simeon</a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">Volg op X (Twitter)</a>
        </div>
      </section>
    </main>
  );
}
