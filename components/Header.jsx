"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { withLocale, getLocaleFromPathname } from "@/lib/locale";
import { getArticleTranslationHref } from "@/lib/articleTranslations";

/* ---------------- NAVIGATIE ---------------- */
const NAV = [
  { href: "/", label: "Home" },
  { href: "/debt-to-gdp", label: "Debt-to-GDP" },
  { href: "/debt", label: "What is Debt?" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
];

/* ---------------- CONSTANTEN ---------------- */
const NO_LOCALE = new Set([]);
const LOCALES = [
  { code: "", label: "English", short: "EN", flag: "🇬🇧" },
  { code: "nl", label: "Nederlands", short: "NL", flag: "🇳🇱" },
  { code: "de", label: "Deutsch", short: "DE", flag: "🇩🇪" },
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
];

/* ---------------- HELPERS ---------------- */
function firstSegment(pathname) {
  const seg = pathname.replace(/^\/+/, "").split("/")[0] || "";
  return seg;
}
function isExternal(href) {
  return /^https?:\/\//i.test(href);
}
function localeAwareHref(hrefBase, locale) {
  if (!hrefBase) return "/";
  if (isExternal(hrefBase)) return hrefBase;
  const clean = hrefBase.startsWith("/") ? hrefBase : `/${hrefBase}`;
  const seg = firstSegment(clean);
  if (NO_LOCALE.has(seg)) return clean;
  if (!locale || locale === "en" || locale === "") return clean;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}
function isActivePath(pathname, hrefBase, locale) {
  const target = localeAwareHref(hrefBase, locale);
  return pathname === target || pathname.startsWith(target + "/");
}

/* ---------------- LANGUAGE DROPDOWN ---------------- */
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
    const pathOnly = url.pathname;
    const fromLang = current || "en";
    const toLang = next.code === "" ? "en" : next.code;

    const isArticleDetail = /^\/(articles|nl\/articles|de\/articles|fr\/articles)\/[^/]+$/.test(
      pathOnly
    );

    let nextPath;

    if (isArticleDetail) {
      nextPath = getArticleTranslationHref({
        currentPath: pathOnly,
        fromLang,
        toLang,
      });
    } else {
      let withoutLocale = pathOnly;
      const seg = firstSegment(pathOnly);
      if (LOCALES.some((l) => l.code && l.code === seg)) {
        withoutLocale = pathOnly.replace(new RegExp(`^/${seg}`), "") || "/";
      }
      const baseSeg = firstSegment(withoutLocale);
      const keepRoot = NO_LOCALE.has(baseSeg);
      if (keepRoot || toLang === "en") {
        nextPath = withoutLocale;
      } else {
        nextPath = withoutLocale === "/" ? `/${toLang}` : `/${toLang}${withoutLocale}`;
      }
    }

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
        .lang-trigger:hover {
          border-color: var(--header-border-strong);
          background: var(--header-chip-bg-hover);
        }
        .lang-trigger:focus {
          outline: 2px solid #2563eb33;
          outline-offset: 2px;
        }
        .lang-active-tag {
          font-size: 11px;
          background: var(--header-active-tag-bg);
          border: 1px solid var(--header-active-tag-border);
          color: var(--header-active-tag-fg);
          padding: 1px 6px;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}

/* ---------------- HEADER ---------------- */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const drawerRef = useRef(null);

  // Sluit drawer bij route-wissel
  useEffect(() => setOpen(false), [pathname]);

  // Body scroll lock + Escape + klik op backdrop
  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function onBackdropClick(e) {
    if (!drawerRef.current) return;
    if (!drawerRef.current.contains(e.target)) setOpen(false);
  }

  return (
    <header className="site-header site-header--light">
      <div className="container header-inner">
        <Link
          href={localeAwareHref("/", locale)}
          className="brand"
          aria-label="EU Debt Map – Home"
        >
          {/* Logo ongewijzigd */}
          <span className="brand-logo">EU</span>
          <span className="brand-text">Debt Map</span>
        </Link>

        {/* Desktop nav (ongewijzigd) */}
        <nav className="nav-desktop" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={localeAwareHref(item.href, locale)}
              className={
                "nav-link" +
                (isActivePath(pathname, item.href, locale) ? " nav-link--active" : "")
              }
            >
              {item.label}
            </Link>
          ))}
          <LanguageDropdown />
        </nav>

        {/* Mobile hamburger */}
        <button
          className={"hamburger" + (open ? " is-open" : "")}
          aria-label="Toggle menu"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile overlay + drawer */}
      <div
        className={"nav-overlay" + (open ? " nav-overlay--show" : "")}
        onMouseDown={onBackdropClick}
      >
        <aside
          id="mobile-menu"
          className={"nav-drawer" + (open ? " nav-drawer--open" : "")}
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="drawer-content">
            <div className="drawer-list" role="menu">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  role="menuitem"
                  href={localeAwareHref(item.href, locale)}
                  className={
                    "drawer-link" +
                    (isActivePath(pathname, item.href, locale) ? " drawer-link--active" : "")
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="drawer-lang">
              <LanguageDropdown />
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        /* Layout */
        .header-inner {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .brand-logo {
          display: inline-grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(180deg, #3386ff, #1e59ff);
          color: #fff;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
        }
        .brand-text {
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.1px;
        }

        /* Desktop nav stays the same visually; we only hide it on small screens */
        .nav-desktop {
          display: none;
          align-items: center;
          gap: 10px;
        }
        .nav-link {
          padding: 9px 14px;
          border-radius: 999px;
          border: 1px solid var(--header-border);
          background: var(--header-chip-bg);
          color: var(--header-fg);
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: var(--header-chip-bg-hover);
          border-color: var(--header-border-strong);
        }
        .nav-link--active {
          background: var(--header-chip-active-bg);
          border-color: var(--header-border-strong);
        }

        /* Hamburger */
        .hamburger {
          display: inline-flex;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid var(--header-border);
          background: var(--header-chip-bg);
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .hamburger span {
          display: block;
          width: 18px;
          height: 2px;
          background: currentColor;
          transition: transform 150ms ease, opacity 150ms ease;
        }
        .hamburger.is-open span:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .hamburger.is-open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.is-open span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Overlay + Drawer */
        .nav-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 180ms ease;
          z-index: 60;
        }
        .nav-overlay--show {
          pointer-events: auto;
          opacity: 1;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: saturate(120%) blur(2px);
        }
        .nav-drawer {
          position: absolute;
          top: 0;
          right: 0;
          height: 100dvh;
          width: min(90vw, 360px);
          background: var(--header-menu-bg, #fff);
          border-left: 1px solid var(--header-border);
          border-top-left-radius: 14px;
          border-bottom-left-radius: 14px;
          transform: translateX(100%);
          transition: transform 220ms ease;
          box-shadow: var(--shadow-lg, 0 10px 30px rgba(0,0,0,0.12));
          display: flex;
          flex-direction: column;
        }
        .nav-drawer--open {
          transform: translateX(0);
        }
        .drawer-content {
          display: grid;
          grid-template-rows: 1fr auto;
          height: 100%;
          padding-top: max(6px, env(safe-area-inset-top));
        }
        .drawer-list {
          overflow-y: auto;
          padding: 8px 12px 12px 12px;
        }
        .drawer-link {
          display: block;
          padding: 14px 14px;
          margin: 4px 0;
          border-radius: 12px;
          border: 1px solid var(--header-border);
          background: var(--header-chip-bg);
          color: var(--header-fg);
          font-weight: 600;
          font-size: 16px;
        }
        .drawer-link--active {
          background: var(--header-chip-active-bg);
        }
        .drawer-link:active {
          transform: translateY(1px);
        }
        .drawer-lang {
          padding: 12px 12px max(12px, env(safe-area-inset-bottom));
          border-top: 1px solid var(--header-border);
          background: var(--header-menu-bg, #fff);
        }

        /* Responsive */
        @media (min-width: 960px) {
          .nav-desktop { display: inline-flex; }
          .hamburger { display: none; }
        }

        /* Motion respect */
        @media (prefers-reduced-motion: reduce) {
          .hamburger span,
          .nav-overlay,
          .nav-drawer { transition: none; }
        }
      `}</style>
    </header>
  );
}
