// components/Header.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { withLocale, getLocaleFromPathname } from "@/lib/locale";

// Navigatie-items (zonder Articles; die tonen we als aparte CTA)
const NAV = [
  { href: "/", label: "Home" },
  { href: "/debt", label: "What is Debt?" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const LOCALES = [
  { code: "",  label: "English",  short: "EN", flag: "🇬🇧" }, // root = EN
  { code: "nl", label: "Nederlands", short: "NL", flag: "🇳🇱" },
  { code: "de", label: "Deutsch",    short: "DE", flag: "🇩🇪" },
  { code: "fr", label: "Français",   short: "FR", flag: "🇫🇷" },
];

function LanguageDropdown() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const current = getLocaleFromPathname(pathname);

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

  const currentLocale = LOCALES.find(l => l.code === current) || LOCALES[0];

  function onSelect(next) {
    const target = withLocale(pathname, next.code);
    setOpen(false);
    router.push(target);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
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
          role="menu"
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
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (hrefBase) => {
    const localized = withLocale(hrefBase, locale);
    return pathname === localized || pathname.startsWith(localized + "/");
  };

  const articlesHref = withLocale("/articles", locale);
  const articlesActive = isActive("/articles");

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={withLocale("/", locale)} className="brand" aria-label="EU Debt Map – Home">
          <span className="brand-logo">EU</span>
          <span className="brand-text">Debt Map</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={withLocale(item.href, locale)}
              className={"nav-link" + (isActive(item.href) ? " nav-link--active" : "")}
            >
              {item.label}
            </Link>
          ))}

          {/* Articles CTA */}
          <Link
            href={articlesHref}
            className={"nav-cta" + (articlesActive ? " nav-cta--active" : "")}
            aria-label="Read latest articles"
          >
            <span aria-hidden style={{ marginRight: 6 }}>📰</span>
            Articles
          </Link>

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
            href={withLocale(item.href, locale)}
            className={"drawer-link" + (isActive(item.href) ? " drawer-link--active" : "")}
          >
            {item.label}
          </Link>
        ))}

        {/* Articles CTA in drawer */}
        <Link
          href={articlesHref}
          className={"drawer-cta" + (articlesActive ? " drawer-cta--active" : "")}
        >
          <span aria-hidden style={{ marginRight: 6 }}>📰</span>
          Articles
        </Link>

        <div style={{ padding: "12px 16px", borderTop: "1px solid #1f2937" }}>
          <LanguageDropdown />
        </div>
      </div>

      {/* Inline styles for CTA */}
      <style jsx>{`
        .nav-cta {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid #2b3a4f;
          background: rgba(255,255,255,0.05);
          text-decoration: none;
          font-weight: 700;
          color: #e5e7eb;
          transition: background .15s ease, border-color .15s ease, transform .06s ease;
          margin-left: 6px;
        }
        .nav-cta:hover { background: rgba(255,255,255,0.08); border-color: #3a4b64; }
        .nav-cta:active { transform: translateY(1px); }
        .nav-cta--active { border-color: #5aa3ff; box-shadow: 0 0 0 2px #1d4ed833 inset; }

        .drawer-cta {
          display: inline-flex;
          align-items: center;
          margin: 8px 16px 12px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #2b3a4f;
          background: rgba(255,255,255,0.05);
          text-decoration: none;
          font-weight: 700;
          color: #e5e7eb;
        }
        .drawer-cta--active { border-color: #5aa3ff; box-shadow: 0 0 0 2px #1d4ed833 inset; }
      `}</style>
    </header>
  );
}
