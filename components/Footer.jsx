// components/Footer.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { withLocale, getLocaleFromPathname } from "@/lib/locale";

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);

  function reopenCookieBanner(e) {
    e.preventDefault();
    // Cookiebot API: open/renew banner indien aanwezig
    if (typeof window !== "undefined" && window.Cookiebot && typeof window.Cookiebot.renew === "function") {
      window.Cookiebot.renew();
    } else {
      // kleine fallback: meld aan gebruiker dat het moment niet lukt
      alert("Cookie banner is not available right now.");
    }
  }

  return (
    <footer
      className="container grid"
      style={{ marginTop: 24 }}
      aria-label="Site footer"
    >
      {/* Info / copyright */}
      <section className="card" aria-label="About this site">
        © {new Date().getFullYear()} EU Debt Map
        <span className="tag" style={{ marginLeft: 8 }}>
          Independent educational visualization based on Eurostat data.
        </span>
      </section>

      {/* Navigatie-links, gelokaliseerd */}
      <section
        className="card"
        style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}
        aria-label="Footer navigation"
      >
        <Link href={withLocale("/about", locale)}>About</Link>
        <Link href={withLocale("/methodology", locale)}>Methodology</Link>
        <Link href={withLocale("/privacy", locale)}>Privacy</Link>
        <Link href={withLocale("/cookies", locale)}>Cookies</Link>
        <Link href={withLocale("/contact", locale)}>Contact</Link>

        {/* Cookiebot: open banner opnieuw */}
        <a href="#" onClick={reopenCookieBanner} className="tag" style={{ marginLeft: "auto" }}>
          Cookie settings
        </a>
      </section>
    </footer>
  );
}
