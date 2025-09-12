// app/nl/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "@/app/country/[code]/CountryClient";

const SITE = "https://www.eudebtmap.com";

// Prebuild alle landen (sneller + betere SEO)
export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

// NL-titel/description gericht op zoektermen als "staatschuld nederland"
export async function generateMetadata({ params }) {
  const want = String(params.code).toLowerCase();
  const c = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  const name = c?.name || params.code.toUpperCase();
  const url = `${SITE}/nl/country/${want}`;

  return {
    title: `Staatsschuld ${name} (live teller) • EU Debt Map`,
    description:
      `Bekijk de actuele (geschatte) staatsschuld van ${name} met een live teller in euro per seconde. Gebaseerd op Eurostat.`,
    alternates: {
      canonical: url,
      // hreflang doen we in stap 2, maar NL canon staat alvast goed
    },
    openGraph: {
      title: `Staatsschuld ${name} (live teller)`,
      description: `Live schatting van de staatsschuld van ${name}, per seconde (Eurostat).`,
      url,
      siteName: "EU Debt Map",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Staatsschuld ${name} (live)`,
      description: `Live schatting van de staatsschuld van ${name}.`,
    },
  };
}

// Volledig statisch
export const dynamic = "error";

export default function CountryPageNL({ params: { code } }) {
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        {/* 'lang' wordt genegeerd als je CountryClient het niet gebruikt — veilig om mee te geven */}
        <CountryClient country={country} lang="nl" />
      </section>
    </main>
  );
}
