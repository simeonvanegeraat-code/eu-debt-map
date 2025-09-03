"use client";

import Link from "next/link";

const POPULAR = [
  { code: "DE", flag: "🇩🇪", name: { en:"Germany", nl:"Duitsland", de:"Deutschland", fr:"Allemagne" } },
  { code: "FR", flag: "🇫🇷", name: { en:"France", nl:"Frankrijk", de:"Frankreich", fr:"France" } },
  { code: "IT", flag: "🇮🇹", name: { en:"Italy", nl:"Italië", de:"Italien", fr:"Italie" } },
  { code: "ES", flag: "🇪🇸", name: { en:"Spain", nl:"Spanje", de:"Spanien", fr:"Espagne" } },
  { code: "NL", flag: "🇳🇱", name: { en:"Netherlands", nl:"Nederland", de:"Niederlande", fr:"Pays-Bas" } },
  { code: "PL", flag: "🇵🇱", name: { en:"Poland", nl:"Polen", de:"Polen", fr:"Pologne" } },
];

const PAIRS = [
  ["DE","FR"], ["IT","ES"], ["NL","BE"], ["PL","CZ"], ["SE","FI"], ["PT","ES"],
];

function t(lang, key) {
  const L = {
    en: {
      compare: "Compare two countries",
      openBoth: "Open both pages to compare live figures.",
      popular: "Popular country pages",
      more: "More",
      map: "See the EU map",
      learn: "Learn more",
      methodology: "Methodology",
    },
    nl: {
      compare: "Vergelijk twee landen",
      openBoth: "Open beide pagina’s om live cijfers te vergelijken.",
      popular: "Populaire landpagina’s",
      more: "Meer",
      map: "Bekijk de EU-kaart",
      learn: "Meer weten",
      methodology: "Methodologie",
    },
    de: {
      compare: "Zwei Länder vergleichen",
      openBoth: "Öffnen Sie beide Seiten, um Live-Werte zu vergleichen.",
      popular: "Beliebte Länderseiten",
      more: "Mehr",
      map: "EU-Karte ansehen",
      learn: "Mehr erfahren",
      methodology: "Methodik",
    },
    fr: {
      compare: "Comparer deux pays",
      openBoth: "Ouvrez les deux pages pour comparer les chiffres en direct.",
      popular: "Pages pays populaires",
      more: "Plus",
      map: "Voir la carte de l’UE",
      learn: "En savoir plus",
      methodology: "Méthodologie",
    },
  };
  return (L[lang] || L.en)[key];
}

/**
 * CTASidebar
 * @param {"en"|"nl"|"de"|"fr"} lang
 * @param {string} homeHref  e.g. "/", "/nl", "/de", "/fr"
 * @param {string} methodologyHref e.g. "/methodology", "/nl/methodology", ...
 */
export default function CTASidebar({ lang="en", homeHref="/", methodologyHref="/methodology" }) {
  return (
    <aside className="card" style={{ gridColumn: "1 / -1" }}>
      {/* Compare two countries */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1f2b3a",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div className="tag">{t(lang,"compare")}</div>
          <p style={{ marginTop: 6 }} className="tag">{t(lang,"openBoth")}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0" }}>
            {PAIRS.map(([a,b]) => {
              const A = POPULAR.find(p=>p.code===a);
              const B = POPULAR.find(p=>p.code===b) || { code:b, flag:"", name:{[lang]:b} };
              return (
                <li key={`${a}-${b}`} style={{ marginBottom: 6 }}>
                  <Link className="mono" href={`/country/${a.toLowerCase()}`}>
                    {A?.flag} {A?.name?.[lang] || a}
                  </Link>
                  <span className="tag" style={{ marginLeft: 8 }}>
                    {t(lang,"more")}: <Link href={`/country/${b.toLowerCase()}`}>{B?.flag} {B?.name?.[lang] || b}</Link>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Popular country pages */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1f2b3a",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div className="tag">{t(lang,"popular")}</div>
          <div style={{ marginTop: 8 }}>
            {POPULAR.map((c) => (
              <Link
                key={c.code}
                className="mono"
                href={`/country/${c.code.toLowerCase()}`}
                style={{
                  display: "inline-block",
                  background: "#0b2b1d",
                  border: "1px solid #1f5d43",
                  color: "#7efab2",
                  borderRadius: 10,
                  padding: "2px 8px",
                  marginRight: 6,
                  marginBottom: 6,
                  fontSize: 12,
                }}
              >
                {c.flag} {c.name[lang] || c.name.en}
              </Link>
            ))}
          </div>
        </div>

        {/* Map + Methodology */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1f2b3a",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div className="tag">{t(lang,"learn")}</div>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>
              <Link href={homeHref} className="btn" style={{ padding: "4px 10px" }}>
                {t(lang,"map")}
              </Link>
            </li>
            <li>
              <Link href={methodologyHref} className="btn" style={{ padding: "4px 10px" }}>
                {t(lang,"methodology")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
