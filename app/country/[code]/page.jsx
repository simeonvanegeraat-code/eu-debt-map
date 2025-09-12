// app/country/[code]/page.jsx
import { notFound } from "next/navigation";
import { countries } from "@/lib/data";
import CountryClient from "./CountryClient";
import CountryIntro from "@/components/CountryIntro";

export async function generateStaticParams() {
  const list = Array.isArray(countries) ? countries : [];
  return list.map((c) => ({ code: String(c.code).toLowerCase() }));
}

export const dynamic = "error";

export default function CountryPage({ params: { code } }) {
  const want = String(code).toLowerCase();
  const country = (Array.isArray(countries) ? countries : []).find(
    (x) => String(x.code).toLowerCase() === want
  );
  if (!country) return notFound();

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <CountryClient
          country={country}
          lang="en"
          introSlot={<CountryIntro country={country} lang="en" />}
        />
      </section>
    </main>
  );
}
