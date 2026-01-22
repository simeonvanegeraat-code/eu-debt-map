import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "@/app/country/[code]/CountryClient";
import CountryIntro from "@/components/CountryIntro";

const SITE = "https://www.eudebtmap.com";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const code = String(params.code).toLowerCase();
  const c = (Array.isArray(countries) ? countries : []).find(x => String(x.code).toLowerCase() === code);
  const name = c?.name || code.toUpperCase();
  const url = `${SITE}/de/country/${code}`;

  return {
    // AANGEPAST: 'Schuldenuhr' is het gouden zoekwoord in Duitsland
    title: `Schuldenuhr ${name} (Live) • EU Debt Map`,
    // AANGEPAST: Sterkere 'call to action' met 'in Echtzeit'
    description: `Die Schuldenuhr von ${name} in Echtzeit. Sehen Sie, wie schnell die Staatsschulden pro Sekunde wachsen. Live-Berechnung basierend auf Eurostat-Daten.`,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE}/country/${code}`,
        nl: `${SITE}/nl/country/${code}`,
        de: `${SITE}/de/country/${code}`,
        fr: `${SITE}/fr/country/${code}`,
      },
    },
  };
}

export const dynamic = "error";

export default function CountryPageDE({ params: { code } }) {
  const cc = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === cc
  );
  if (!country) return notFound();

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        {/* We geven expliciet lang="de" mee, zodat CountryClient de punten/komma's goed zet */}
        <CountryClient country={country} lang="de" introSlot={<CountryIntro country={country} lang="de" />} />
      </section>
    </main>
  );
}