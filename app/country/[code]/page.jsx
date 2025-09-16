// app/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { headers, cookies } from "next/headers";
import { countries } from "@/lib/data";
import CountryClient from "./CountryClient";
import CountryIntro from "@/components/CountryIntro";
import { countryName } from "@/lib/countries";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export const dynamic = "error";

// Simple server-side language detector:
// 1) kijkt of je een taal-cookie gebruikt (ui_lang / lang / NEXT_LOCALE),
// 2) valt terug op Accept-Language header,
// 3) default = en.
function detectLang() {
  const c = cookies();
  const fromCookie =
    c.get("ui_lang")?.value ||
    c.get("lang")?.value ||
    c.get("NEXT_LOCALE")?.value ||
    "";

  const normalize = (x) =>
    (x || "").toLowerCase().slice(0, 2);

  const cand = normalize(fromCookie);
  if (["en", "nl", "de", "fr"].includes(cand)) return cand;

  const h = headers();
  const al = normalize(h.get("accept-language"));
  if (["en", "nl", "de", "fr"].includes(al)) return al;

  return "en";
}

export default function CountryPage({ params: { code } }) {
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  // Actieve UI-taal bepalen
  const lang = detectLang();

  // Alleen de display-naam lokaliseren (URLs/data blijven op ISO-code)
  const localizedCountry = {
    ...country,
    name: countryName(country.code, lang),
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient
          country={localizedCountry}
          lang={lang}
          introSlot={<CountryIntro country={localizedCountry} lang={lang} />}
        />
      </section>
    </main>
  );
}
