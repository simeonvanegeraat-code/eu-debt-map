"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/debt", label: "What is Debt?" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "de", label: "Deutsch",  flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const LOCALE_SET = new Set(LOCALES.map(l => l.code));

function getCurrentLocale(pathname) {
  // i18n default = en (zonder prefix). Met prefix: /nl, /de, /fr, /en (optioneel)
  const seg = pathname.split("/").filter(Boolean)[0] || "";
  return LOCALE_SET.has(seg) ? seg : "en";
}

function stripLocalePrefix(pathname) {
  const parts = pathname.split("/");
  // ["", "nl", "country", "nl"] -> haal locale af als eerste segment
  if (parts.length > 1 && LOCALE_SET.has(parts[1])) {
    parts.splice(1, 1);
    const out = parts.join("/") || "/";
    return out.startsWith("/") ? out : "/" + out;
  }
  return pathname || "/";
}

function buildPathForLocale(pathname, targetLocale) {
  const basePath = stripLocalePrefix(pathname); // Engelstalige basisroute
  if (targetLocale === "en") return basePath;  // en = geen prefix
  // Zorg dat dubbele slashes verdwijnen
  if (basePath === "/") return `/${targetLocale}`;
  return `/${targetLocale}${basePath.startsWith("/") ? basePath : `/${basePath}`}`;
}

function LanguageDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const current = getCurrentLocale(pathname);

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Klik-buiten om te sluiten
  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const currentLocale = LOCALES.find(l => l.code === current) || LOCALES[0];

  function onSelect(next) {
    const href = buildPathForLocale(pathname, next.code);
    setOpen(false);
    router.push(href);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
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
          role="listbox"
          className="lang-menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            minWidth: 180,
            background: "#0b1220",
            border: "1px solid #1f2b3a",
            borderRadius: 10,
            padding: 6,
            boxShadow: "0 10px 25px rgba(0,0,0,.35)",
            zIndex: 50,
          }}
        >
          {LOCALES.map((opt) => {
            const active = opt.code === current;
            return (
              <li key={opt.code} role="option" aria-selected={active}>
                <button
                  onClick={() => onSelect(opt)}
                  className="lang-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: active ? "rgba(96,165,250,.12)" : "transparent",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{opt.flag}</span>
                  <span style={{ flex: 1 }}>{opt.label}</span>
                  {active && (
                    <span
                      className="tag"
                      style={{
                        fontSize: 11,
                        background: "#0b2b1d",
                        border: "1px solid #1f5d43",
                        color: "#7efab2",
                        padding: "1px 6px",
                        borderRadius: 8,
                      }}
                    >
                      Active
                    </span>
                  )}
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
          border-radius: 10px;
          border: 1px solid #1f2b3a;
          background: #0f172a;
          color: #e5e7eb;
          transition: border-color .15s ease, background .15s ease;
        }
        .lang-trigger:hover { border-color: #2b3a4f; background: #0d1424; }
        .lang-trigger:focus { outline: 2px solid #2563eb33; outline-offset: 2px; }
        @media (max-width: 768px) {
          .lang-trigger { padding: 8px 10px; }
        }
      `}</style>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Sluit drawer bij route wissel
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Logo / title */}
        <Link href="/" className="brand" aria-label="EU Debt Map – Home">
          <span className="brand-logo">EU</span>
          <span className="brand-text">Debt Map</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={"nav-link" + (pathname === item.href ? " nav-link--active" : "")}
            >
              {item.label}
            </Link>
          ))}
          <LanguageDropdown />
        </nav>

        {/* Mobile toggle */}
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
            href={item.href}
            className={"drawer-link" + (pathname === item.href ? " drawer-link--active" : "")}
          >
            {item.label}
          </Link>
        ))}
        {/* Talen in mobiel: hergebruik dropdown (we tonen lijst inline) */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1f2937" }}>
          <LanguageDropdown />
        </div>
      </div>
    </header>
  );
}
