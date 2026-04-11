// components/CountryIntro.jsx
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { countryName } from "@/lib/countries";
import { getLocaleFromPathname } from "@/lib/locale";

// Toegestane talen
const SUPPORTED = new Set(["", "en", "nl", "de", "fr"]);
// NB: in jullie setup is "" = Engels op root. We normaliseren hieronder.

export default function CountryIntro({ country, lang }) {
  if (!country) return null;

  // 1) Taal bepalen: prop > URL > "en"
  const pathname = usePathname() || "/";
  const detected = getLocaleFromPathname ? getLocaleFromPathname(pathname) : "";
  const effLang = useMemo(() => {
    const norm = (x) => (x === "" ? "en" : x);
    const fromProp = norm(lang);
    const fromUrl = norm(detected);
    if (fromProp && SUPPORTED.has(fromProp)) return fromProp;
    if (fromUrl && SUPPORTED.has(fromUrl)) return fromUrl;
    return "en";
  }, [lang, detected]);

  // 2) Vertaalde weergavenaam
  const name = countryName(country.code, effLang);

  if (effLang === "nl") {
    return (
      <section className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 className="text-base font-semibold mb-2">Over de staatsschuld van {name}</h3>
        <p className="text-sm text-slate-300">
          Deze pagina toont de <strong>staatsschuld van {name}</strong> als
          <strong> live schatting</strong>. De teller is gebaseerd op de twee
          meest recente officiële Eurostat-momenten en rekent de gemiddelde
          verandering door naar nu.
        </p>
        <p className="text-sm text-slate-300" style={{ marginTop: 6 }}>
          Je ziet hierboven direct het bedrag, de verandering ten opzichte van
          het vorige kwartaal en de verhouding tussen schuld en bbp.
        </p>
      </section>
    );
  }

  if (effLang === "de") {
    return (
      <section className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 className="text-base font-semibold mb-2">Über die Staatsverschuldung von {name}</h3>
        <p className="text-sm text-slate-300">
          Diese Seite zeigt die <strong>Staatsverschuldung von {name}</strong>
          als <strong>Live-Schätzung</strong>. Der Zähler basiert auf den zwei
          jüngsten offiziellen Eurostat-Referenzwerten und schreibt die
          durchschnittliche Veränderung bis heute fort.
        </p>
        <p className="text-sm text-slate-300" style={{ marginTop: 6 }}>
          Oben siehst du direkt den Betrag, die Veränderung gegenüber dem
          Vorquartal und das Verhältnis von Schulden zu BIP.
        </p>
      </section>
    );
  }

  if (effLang === "fr") {
    return (
      <section className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 className="text-base font-semibold mb-2">À propos de la dette publique de {name}</h3>
        <p className="text-sm text-slate-300">
          Cette page affiche la <strong>dette publique de {name}</strong> sous
          forme de <strong>compteur estimé en direct</strong>. Le calcul repose
          sur les deux derniers points de référence officiels d’Eurostat et
          prolonge l’évolution moyenne jusqu’à aujourd’hui.
        </p>
        <p className="text-sm text-slate-300" style={{ marginTop: 6 }}>
          Vous voyez ci-dessus le montant actuel, la variation depuis le
          trimestre précédent et le ratio dette/PIB.
        </p>
      </section>
    );
  }

  // EN (default)
  return (
    <section className="card" style={{ padding: 12, marginTop: 12 }}>
      <h3 className="text-base font-semibold mb-2">About {name}&rsquo;s public debt</h3>
      <p className="text-sm text-slate-300">
        This page shows <strong>{name}&rsquo;s public debt</strong> as a
        <strong> live estimate</strong>. The counter is based on the two most
        recent official Eurostat reference points and extends the average
        change forward to today.
      </p>
      <p className="text-sm text-slate-300" style={{ marginTop: 6 }}>
        Above, you can immediately see the current amount, the change since the
        previous quarter, and the debt-to-GDP ratio.
      </p>
    </section>
  );
}