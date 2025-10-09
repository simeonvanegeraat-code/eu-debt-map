// app/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "./CountryClient";
import CountryIntro from "@/components/CountryIntro";
import { countryName } from "@/lib/countries";
import { getLocaleFromPathname } from "@/lib/locale";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

// We willen absoluut geen dynamic fetch tijdens pre-render:
export const dynamic = "error";

export default async function CountryPage({ params: { code } }) {
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  // Taal bepalen
  const rawLang = getLocaleFromPathname?.() || "en";
  const lang = ["en", "nl", "de", "fr"].includes(rawLang) ? rawLang : "en";

  // Alleen display-naam lokaliseren
  const localizedCountry = { ...country, name: countryName(country.code, lang) };

  // Yearlabel uit je bestaande data (we fetchen GDP niet in SSR)
  const yearLabel =
    (country?.last_date ? String(country.last_date).slice(0, 4) : "Latest");

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient
          country={localizedCountry}
          lang={lang}
          yearLabel={yearLabel}
          introSlot={<CountryIntro country={localizedCountry} lang={lang} />}
          // GDP wordt client-side opgehaald in CountryClient via /api/gdp
        />
      </section>
    </main>
  );
}
