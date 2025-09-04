"use client";

import { usePathname } from "next/navigation";

function getLocalePrefix(pathname) {
  const first = (pathname || "/").split("/").filter(Boolean)[0] || "";
  return ["nl", "de", "fr"].includes(first) ? `/${first}` : "";
}

export default function Footer() {
  const pathname = usePathname();
  const prefix = getLocalePrefix(pathname);

  return (
    <footer className="container grid" style={{ marginTop: 24 }}>
      <section className="card">
        © {new Date().getFullYear()} EU Debt Map
      </section>

      <section
        className="card"
        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <a href={`${prefix}/about`}>About</a>
        <a href={`${prefix}/methodology`}>Methodology</a>
        <a href={`${prefix}/privacy`}>Privacy</a>
        <a href={`${prefix}/cookies`}>Cookies</a>

        {/* Cookiebot: open banner opnieuw */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window?.Cookiebot?.renew?.();
          }}
        >
          Cookie settings
        </a>
      </section>
    </footer>
  );
}
