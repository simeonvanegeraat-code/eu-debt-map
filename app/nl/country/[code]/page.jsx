// app/nl/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "@/app/country/[code]/CountryClient";
import CountryIntro from "@/components/CountryIntro";
import { countryName } from "@/lib/countries";

const SITE = "https://www.eudebtmap.com";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const code = String(params.code).toLowerCase();
  const name = countryName(code.toUpperCase(), "nl") || code.toUpperCase();
  const url = `${SITE}/nl/country/${code}`;

  return {
    title: `Staatsschuld ${name} (live) | EU Debt Map`,
    description: `Bekijk de staatsschuld van ${name} live met een actuele schatting op basis van Eurostat. Inclusief schuldniveau en bbp-verhouding.`,
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

export default function CountryPageNL({ params: { code } }) {
  const cc = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === cc
  );
  if (!country) return notFound();

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient
          country={country}
          lang="nl"
          introSlot={<CountryIntro country={country} lang="nl" />}
        />
      </section>
    </main>
  );
}