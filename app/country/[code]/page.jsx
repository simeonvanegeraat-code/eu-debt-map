// app/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "./CountryClient";

export async function generateStaticParams() {
  // 'countries' is bij jou een array met { code, ... }
  try {
    const codes = Array.isArray(countries)
      ? countries.map((c) => ({ code: String(c.code).toLowerCase() }))
      : [];
    // Fallback (zou niet nodig moeten zijn als lib/data klopt)
    return codes.length
      ? codes
      : [
          "at","be","bg","hr","cy","cz","dk","ee","fi","fr","de","gr","hu","ie",
          "it","lv","lt","lu","mt","nl","pl","pt","ro","sk","si","es","se",
        ].map((code) => ({ code }));
  } catch {
    return [];
  }
}

// Volledig statisch (gooit fout bij dynamic fetches)
export const dynamic = "error";

export default function CountryPage({ params: { code } }) {
  const want = String(code).toLowerCase();
  const country =
    Array.isArray(countries)
      ? countries.find((x) => String(x.code).toLowerCase() === want)
      : null;

  if (!country) return notFound();

  // Geef het volledige country-object door aan de client component
  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient country={country} />
      </section>
    </main>
  );
}
