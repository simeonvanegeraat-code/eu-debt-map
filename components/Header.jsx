// components/Header.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { withLocale, getLocaleFromPathname } from "@/lib/locale";

/**
 * NAV-items (labels kun je later vertalen per taal).
 * href's zijn "basisroutes" zonder locale-prefix; we voegen die dynamisch toe.
 */
const NAV = [
  { href: "/", label: "Home" },
  { href: "/debt-to-gdp", label: "Debt-to-GDP" },
  { href: "/debt", label: "What is Debt?" },
  { href: "/articles", label: "Articles" },        // nu WÉL meertalig
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
];

/**
 * Routes die NOOIT een taalprefix krijgen.
 * Laat deze voorlopig leeg. Wil je iets uitsluiten, zet hier het EERSTE padsegment in (zonder slash),
 * bv: new Set(["ads-test"])
 */
const NO_LOCALE = new Set([]);

/** Ondersteunde talen */
const LOCALES = [
  { code: "",   label: "English",   short: "EN", flag: "🇬🇧" },
  { code: "nl", label: "Nederlands", short: "NL", flag: "🇳🇱" },
  { code: "de", label: "Deutsch",   short: "DE", flag: "🇩🇪" },
  { code: "fr", label: "Français",  short: "FR", flag: "🇫🇷" },
];

/** Helpers */
function firstSegment(pathname) {
  const seg = pathname.replace(/^\/+/, "").split("/")[0] || "";
  return seg;
}
function isExternal(href) {
  return /^https?:\/\//i.test(href);
}

/** Bouw locale-afhankelijke href (voegt /nl, /de, /fr toe behalve voor en/NO_LOCALE/externe URL) */
function localeAwareHref(hrefBase, locale) {
  if (!hrefBase) return "/";
  if (isExternal(hrefBase)) return hrefBase;

  // Normaliseer
  const clean = hrefBase.startsWith("/") ? hrefBase : `/${hrefBase}`;

  // routes die nooit gelokaliseerd worden (per eerste segment)
  const seg = firstSegment(clean);
  if (NO_LOCALE.has(seg)) return clean;

  // en = geen prefix
  if (!locale || locale === "en" || locale === "") return clean;

  // root
  if (clean === "/") return `/${locale}`;

  return `/${locale}${clean}`;
}

/** Active-state: exact of child-pad */
function isActivePath(pathname, hrefBase, locale) {
  const target = localeAwareHref(hrefBase, locale);
  return pathname === target || pathname.startsWith(target + "/");
}

function LanguageDropdown() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const current = getLocaleFromPathname(pathname); // "", "nl", "de", "fr"

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const currentLocale = LOCALES.find((l) => l.code === current) || LOCALES[0];

  function onSelect(next) {
    const url = new URL(window.location.href);
    const pathOnly = url.pathname; // behoud query/hash later

    // 1) strip bestaande locale segment
    let withoutLocale = pathOnly;
    const seg = firstSegment(pathOnly);
    if (LOCALES.some((l) => l.code && l.code === seg)) {
      withoutLocale = pathOnly.replace(new RegExp(`^/${seg}`), "") || "/";
    }

    // 2) check NO_LOCALE op basis van EERSTE segment van het pad zonder locale
    const baseSeg = firstSegment(withoutLocale);
    const keepRoot = NO_LOCALE.has(baseSeg);

    // 3) bouw target met nieuwe locale
    let nextPath;
    if (keepRoot || !next.code) {
      // geen locale (en) of expliciet uitgesloten
      nextPath = withoutLocale;
    } else {
      nextPath = withoutLocale === "/"
        ? `/${next.code}`
        : `/${next.code}${withoutLocale}`;
    }

    // 4) behoud query + hash
    const target = nextPath + url.search + url.hash;

    setOpen(false);
    router.push(target);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
        className="lang-trigger"
        title="Change language"
      >
        <span style={{ fontSize: 16, marginRight: 6 }}>{currentLocale.flag}</span>
        <span style={{ fontWeight: 600 }}>{currentLocale.label}</span>
        <svg width="14" height="14" viewBox="0 0 20 20" style={{ marginLeft: 6, opacity: 0.8 }}>
          <path d="M5 7l5 6 5-6H5z" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="lang-menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            minWidth: 200,
            background: "var(--header-menu-bg)",
            border: "1px solid var(--header-border)",
            borderRadius: 12,
            padding: 6,
            boxShadow: "var(--shadow-md)",
            zIndex: 50,
          }}
        >
          {LOCALES.map((opt) => {
            const active = opt.code === current;
            return (
              <li key={opt.code || "en"} role="none">
                <button
                  role="menuitem"
                  onClick={() => onSelect(opt)}
                  className="lang-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: active ? "var(--header-chip-active-bg)" : "transparent",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{opt.flag}</span>
                  <span style={{ flex: 1 }}>{opt.label}</span>
                  {active && <span className="tag lang-active-tag">Active</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <style jsx>{`
        .lang-trigger {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid var(--header-border);
          background: var(--header-chip-bg);
          color: var(--header-fg);
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .lang-trigger:hover { border-color: var(--header-border-strong); background: var(--header-chip-bg-hover); }
        .lang-trigger:focus { outline: 2px solid #2563eb33; outline-offset: 2px; }
        .lang-active-tag{
          font-size: 11px;
          background: var(--header-active-tag-bg);
          border: 1px solid var(--header-active-tag-border);
          color: var(--header-active-tag-fg);
          padding: 1px 6px;
          border-radius: 999px;
        }
        @media (max-width: 768px) {
          .lang-trigger { padding: 8px 10px; }
        }
      `}</style>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header site-header--light">
      <div className="container header-inner">
        <Link href={localeAwareHref("/", locale)} className="brand" aria-label="EU Debt Map – Home">
          <span className="brand-logo">EU</span>
          <span className="brand-text">Debt Map</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={localeAwareHref(item.href, locale)}
              className={
                "nav-link" + (isActivePath(pathname, item.href, locale) ? " nav-link--active" : "")
              }
            >
              {item.label}
            </Link>
          ))}
          <LanguageDropdown />
        </nav>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${open ? "nav-drawer--open" : ""}`}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={localeAwareHref(item.href, locale)}
            className={
              "drawer-link" + (isActivePath(pathname, item.href, locale) ? " drawer-link--active" : "")
            }
          >
            {item.label}
          </Link>
        ))}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--header-border)" }}>
          <LanguageDropdown />
        </div>
      </div>
    </header>
  );
}
