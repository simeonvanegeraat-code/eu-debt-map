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
    // "" in jullie project = Engels
    const norm = (x) => (x === "" ? "en" : x);
    const fromProp = norm(lang);
    const fromUrl = norm(detected);
    if (fromProp && SUPPORTED.has(fromProp)) return fromProp;
    if (fromUrl && SUPPORTED.has(fromUrl)) return fromUrl;
    return "en";
  }, [lang, detected]);

  // 2) Vertaalde weergavenaam
  const name = countryName(country.code, effLang);

  // 3) Content per taal
  if (effLang === "nl") {
    return (
      <section className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 className="text-base font-semibold mb-2">Staatsschuld {name}: live schatting</h3>
        <p className="text-sm text-slate-300">
          Op deze pagina zie je de <strong>staatschuld {name}</strong> als <strong>live teller</strong>
          (ook wel <em>schuldenklok</em>). De stand is een <strong>geschatte overheidsschuld</strong> op basis
          van de laatste twee Eurostat-referentiemomenten (gemiddelde verandering per seconde).
        </p>
        <p className="text-sm text-slate-300" style={{ marginTop: 6 }}>
          We tonen ook de wijziging t.o.v. het vorige kwartaal en de gemiddelde <strong>rate</strong> (€/s).
          Schuldquote (% bbp) volgt later.
        </p>
      </section>
    );
  }

  if (effLang === "de") {
    return (
      <section className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 className="text-base font-semibold mb-2">Staatsschulden {name}: Live-Schätzung</h3>
        <p className="text-sm text-slate-300">
          Diese Seite zeigt die <strong>Staatsschulden von {name}</strong> als <strong>Live-Zähler</strong>.
          Es handelt sich um eine <strong>geschätzte Regierungsschuld</strong> auf Basis der zwei jüngsten
          Eurostat-Referenztermine (durchschnittliche Veränderung pro Sekunde).
        </p>
        <p className="text-sm text-slate-300" style={{ marginTop: 6 }}>
          Ebenfalls enthalten: Änderung gegenüber dem Vorquartal und die durchschnittliche <strong>Rate</strong> (€/s).
          Schuldenquote (% BIP) folgt.
        </p>
      </section>
    );
  }

  if (effLang === "fr") {
    return (
      <section className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 className="text-base font-semibold mb-2">Dette publique de {name} : estimation en direct</h3>
        <p className="text-sm text-slate-300">
          Cette page affiche la <strong>dette publique de {name}</strong> sous forme de <strong>compteur en direct</strong>.
          Il s’agit d’une <strong>estimation</strong> dérivée des deux dernières dates de référence Eurostat
          (variation moyenne par seconde).
        </p>
        <p className="text-sm text-slate-300" style={{ marginTop: 6 }}>
          Nous indiquons aussi la variation depuis le dernier trimestre et le <strong>taux</strong> moyen (€/s).
          Le ratio dette/PIB arrivera bientôt.
        </p>
      </section>
    );
  }

  // EN (default)
  return (
    <section className="card" style={{ padding: 12, marginTop: 12 }}>
      <h3 className="text-base font-semibold mb-2">About {name}&rsquo;s national debt</h3>
      <p className="text-sm text-slate-300">
        This page shows <strong>{name}&rsquo;s public debt</strong> as a <strong>live counter</strong>.
        It is an <strong>estimated government debt</strong> derived from the two most recent Eurostat
        reference dates (average change per second).
      </p>
      <p className="text-sm text-slate-300" style={{ marginTop: 6 }}>
        We also display the change since the previous quarter and the average <strong>rate</strong> (€/s).
        Debt-to-GDP context coming soon.
      </p>
    </section>
  );
}
