// components/Footer.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { withLocale, getLocaleFromPathname } from "@/lib/locale";
import GoogleConsentSettingsLink from "@/components/GoogleConsentSettingsLink";

const FOOTER_COPY = {
  en: {
    tagline: "Independent educational visualization based on Eurostat data.",
    navLabel: "Footer",
    about: "About",
    methodology: "Methodology",
    privacy: "Privacy",
    cookies: "Cookie Policy",
    consentSettings: "Privacy and cookie settings",
  },
  nl: {
    tagline: "Onafhankelijke educatieve visualisatie op basis van Eurostat-gegevens.",
    navLabel: "Voettekst",
    about: "Over",
    methodology: "Methodologie",
    privacy: "Privacy",
    cookies: "Cookiebeleid",
    consentSettings: "Privacy- en cookie-instellingen",
  },
  de: {
    tagline: "Unabhängige Bildungsvisualisierung auf Basis von Eurostat-Daten.",
    navLabel: "Fußzeile",
    about: "Über",
    methodology: "Methodik",
    privacy: "Datenschutz",
    cookies: "Cookie-Richtlinie",
    consentSettings: "Datenschutz- und Cookie-Einstellungen",
  },
  fr: {
    tagline: "Visualisation pédagogique indépendante fondée sur les données d’Eurostat.",
    navLabel: "Pied de page",
    about: "À propos",
    methodology: "Méthodologie",
    privacy: "Confidentialité",
    cookies: "Politique relative aux cookies",
    consentSettings: "Paramètres de confidentialité et de cookies",
  },
};

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const copy = FOOTER_COPY[locale] || FOOTER_COPY.en;
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
            {copy.tagline}
          </span>
        </div>

        {/* Onderste rij: navigatie */}
        <nav
          aria-label={copy.navLabel}
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
            {copy.about}
          </Link>
          <Link href={withLocale("/methodology", locale)} className="footer-link">
            {copy.methodology}
          </Link>
          <Link href={withLocale("/privacy", locale)} className="footer-link">
            {copy.privacy}
          </Link>
          <Link href={withLocale("/cookies", locale)} className="footer-link">
            {copy.cookies}
          </Link>

          <GoogleConsentSettingsLink className="footer-link">
            {copy.consentSettings}
          </GoogleConsentSettingsLink>
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
