// components/Footer.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { withLocale, getLocaleFromPathname } from "@/lib/locale";

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const year = new Date().getFullYear();

  function openCookieSettings(e) {
    e.preventDefault();
    try {
      // 1) Officiële API – open het voorkeuren/bannervenster
      if (window?.CookieScript?.instance?.show) return window.CookieScript.instance.show();

      // 2) Fallbacks voor oudere builds
      const cs = window.CookieScript || {};
      if (typeof cs.showPreferences === "function") return cs.showPreferences();
      if (typeof cs.open === "function") return cs.open("preferences");
      if (typeof cs.renew === "function") return cs.renew();
      if (typeof cs.show === "function") return cs.show();

      // 3) Laatste redmiddel: IAB TCF helper (als TCF aanstaat)
      if (typeof window.__tcfapi === "function") {
        return window.__tcfapi("displayConsentUi", 2, () => {});
      }
    } catch (err) {
      // negeer; class-trigger pakt 'm meestal toch op
      console.warn("[CookieScript] reopen error:", err);
    }
    // Geen alert: CookieScript's eigen class-trigger (csconsentlink) klikt meestal alsnog door
  }

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
            border: "1px solid #1f2b3a",
            background: "#0b1220",
          }}
        >
          <span>
            © {year} <strong>EU Debt Map</strong>
          </span>
          <span style={{ opacity: 0.75 }}>
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
            border: "1px solid #1f2b3a",
            background: "#0b1220",
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

          {/* Belangrijk: className 'csconsentlink' is de officiële trigger.
             We houden onClick als extra fallback. */}
          <a
            href="#"
            className="footer-link csconsentlink"
            onClick={openCookieSettings}
          >
            Cookie preferences
          </a>
        </nav>
      </div>

      <style jsx>{`
        .footer-link {
          padding: 6px 10px;
          border-radius: 10px;
          border: 1px solid transparent;
        }
        .footer-link:hover {
          border-color: #2b3a4f;
          background: #0d1424;
        }
      `}</style>
    </footer>
  );
}
