import Link from "next/link";

const SITE = "https://www.eudebtmap.com";

const breadcrumbs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "EU Debt Map France",
      item: `${SITE}/fr`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Dette publique de la France",
      item: `${SITE}/fr/country/fr`,
    },
  ],
};

export default function FranceDebtClockBreadcrumbs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <nav
        aria-label="Fil d’Ariane"
        style={{ gridColumn: "1 / -1", fontSize: 14, color: "rgb(71,85,105)" }}
      >
        <ol
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link href="/fr">EU Debt Map</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">Dette publique de la France</li>
        </ol>
      </nav>
    </>
  );
}
