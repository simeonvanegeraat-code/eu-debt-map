// components/Footer.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { withLocale, getLocaleFromPathname } from "@/lib/locale";

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const year = new Date().getFullYear();

  return (
    <footer
      className="container"
      style={{
        display: "grid",
        gap: 14,
        gridTemplateColumns: "1fr",
        padding: "24px 0 36px",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "1fr",
        }}
      >
        {/* Bovenste rij: copy + tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 18px",
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "var(--card)",
            boxShadow: "var(--shadow-sm)",
            color: "var(--muted)",
          }}
        >
          <span>
            © {year} <strong style={{ color: "var(--fg)" }}>EU Debt Map</strong>
          </span>
          <span style={{ opacity: 0.9 }}>
            Independent educational visualization based on Eurostat data.
          </span>
        </div>

        {/* Onderste rij: navigatie */}
        <nav
          aria-label="Footer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 18px",
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "var(--card)",
            boxShadow: "var(--shadow-sm)",
            flexWrap: "wrap",
          }}
        >
          <Link href={withLocale("/about", locale)} className="footer-link">
            About
          </Link>
          <Link href={withLocale("/methodology", locale)} className="footer-link">
            Methodology
          </Link>
          <Link href={withLocale("/privacy", locale)} className="footer-link">
            Privacy
          </Link>
          <Link href={withLocale("/cookies", locale)} className="footer-link">
            Cookie Policy
          </Link>

          {/* Officiële CookieScript-trigger: geen JS, alleen deze class */}
          <a href="#" className="footer-link csconsentlink">
            Cookie preferences
          </a>
        </nav>
      </div>

      <style jsx>{`
        .footer-link {
          padding: 6px 10px;
          border-radius: 10px;
          border: 1px solid transparent;
          color: var(--accent);
          text-decoration: none;
          text-underline-offset: 3px;
        }
        .footer-link:hover {
          background: #f8fafc;
          border-color: var(--header-border-strong);
          text-decoration: underline;
        }
        .footer-link:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }
      `}</style>
    </footer>
  );
}
