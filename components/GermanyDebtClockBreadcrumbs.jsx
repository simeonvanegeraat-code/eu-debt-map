import Link from "next/link";

const SITE = "https://www.eudebtmap.com";

const breadcrumbs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "EU Debt Map Deutschland",
      item: `${SITE}/de`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Schuldenuhr Deutschland",
      item: `${SITE}/de/country/de`,
    },
  ],
};

export default function GermanyDebtClockBreadcrumbs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <nav
        aria-label="Brotkrümelnavigation"
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
            <Link href="/de">EU Debt Map</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">Schuldenuhr Deutschland</li>
        </ol>
      </nav>
    </>
  );
}
