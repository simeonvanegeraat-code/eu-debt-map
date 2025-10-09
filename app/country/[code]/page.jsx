// app/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "./CountryClient";
import CountryIntro from "@/components/CountryIntro";
import { countryName } from "@/lib/countries";
import { getLocaleFromPathname } from "@/lib/locale";
import { getLatestGDPForGeoEUR } from "@/lib/eurostat.gen";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export const dynamic = "error";

export default async function CountryPage({ params: { code } }) {
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  // Detecteer taal via jullie bestaande helper; val terug op 'en'
  const rawLang = getLocaleFromPathname?.() || "en";
  const lang = ["en", "nl", "de", "fr"].includes(rawLang) ? rawLang : "en";

  // Alleen de display-naam lokaliseren; data/URL blijven gelijk
  const localizedCountry = { ...country, name: countryName(country.code, lang) };

  // ### NIEUW: Haal GDP live op via Eurostat (gecachet in eurostat.gen)
  // We gebruiken ISO2 landcode (bv. "NL")
  let gdpAbs = null;
  let gdpPeriod = null;
  try {
    const { valueEUR, period } = await getLatestGDPForGeoEUR(country.code);
    gdpAbs = Number.isFinite(valueEUR) ? valueEUR : null;
    gdpPeriod = period || null;
  } catch {
    gdpAbs = null;
    gdpPeriod = null;
  }

  // Maak yearLabel (mooie SEO-tekst) uit GDP-periode of uit last_date
  const yearLabel =
    (typeof gdpPeriod === "string" && gdpPeriod.slice(0, 4)) ||
    (country?.last_date ? String(country.last_date).slice(0, 4) : "Latest");

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient
          country={localizedCountry}
          lang={lang}
          gdpAbs={gdpAbs}
          gdpPeriod={gdpPeriod}
          yearLabel={yearLabel}
          introSlot={<CountryIntro country={localizedCountry} lang={lang} />}
        />
      </section>
    </main>
  );
}
