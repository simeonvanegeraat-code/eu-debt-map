"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { getLocaleFromPathname } from "@/lib/locale";
import { getArticleTranslationHref } from "@/lib/articleTranslations";

/* ---------------- NAVIGATIE ---------------- */
const NAV = [
  { href: "/", key: "home" },
  { href: "/debt-to-gdp", key: "debtToGdp" },
  { href: "/debt", key: "whatIsDebt" },
  { href: "/articles", key: "articles" },
  { href: "/about", key: "about" },
  { href: "/methodology", key: "methodology" },
];

/* ---------------- TEKSTEN ---------------- */
const TEXT = {
  en: {
    nav: {
      home: "Home",
      debtToGdp: "Debt-to-GDP",
      whatIsDebt: "What is Debt?",
      articles: "Articles",
      about: "About",
      methodology: "Methodology",
    },
    changeLanguage: "Change language",
    currentLanguage: "Current language",
    active: "Active",
    brandHome: "EU Debt Map – Home",
    toggleMenu: "Toggle menu",
  },
  nl: {
    nav: {
      home: "Home",
      debtToGdp: "Schuld/bbp",
      whatIsDebt: "Wat is schuld?",
      articles: "Artikelen",
      about: "Over",
      methodology: "Methodologie",
    },
    changeLanguage: "Taal wijzigen",
    currentLanguage: "Huidige taal",
    active: "Actief",
    brandHome: "EU Debt Map – Home",
    toggleMenu: "Menu openen",
  },
  de: {
    nav: {
      home: "Startseite",
      debtToGdp: "Schulden/BIP",
      whatIsDebt: "Was sind Schulden?",
      articles: "Artikel",
      about: "Über",
      methodology: "Methodik",
    },
    changeLanguage: "Sprache ändern",
    currentLanguage: "Aktuelle Sprache",
    active: "Aktiv",
    brandHome: "EU Debt Map – Startseite",
    toggleMenu: "Menü umschalten",
  },
  fr: {
    nav: {
      home: "Accueil",
      debtToGdp: "Dette/PIB",
      whatIsDebt: "Qu’est-ce que la dette ?",
      articles: "Articles",
      about: "À propos",
      methodology: "Méthodologie",
    },
    changeLanguage: "Changer de langue",
    currentLanguage: "Langue actuelle",
    active: "Actif",
    brandHome: "EU Debt Map – Accueil",
    toggleMenu: "Ouvrir le menu",
  },
};

/* ---------------- CONSTANTEN ---------------- */
const NO_LOCALE = new Set([]);
const LOCALES = [
  { code: "", label: "English", short: "EN" },
  { code: "nl", label: "Nederlands", short: "NL" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "fr", label: "Français", short: "FR" },
];

/* ---------------- ICONS ---------------- */
function GlobeIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Zm7.93 9h-3.06a15.7 15.7 0 0 0-1.52-5.07A8.03 8.03 0 0 1 19.93 11ZM12 4.07c1.1 1.28 2.04 3.6 2.42 6.93H9.58C9.96 7.67 10.9 5.35 12 4.07ZM4.07 13h3.06c.18 1.86.67 3.6 1.52 5.07A8.03 8.03 0 0 1 4.07 13Zm3.06-2H4.07a8.03 8.03 0 0 1 4.58-5.07A15.7 15.7 0 0 0 7.13 11Zm4.87 8.93c-1.1-1.28-2.04-3.6-2.42-6.93h4.84c-.38 3.33-1.32 5.65-2.42 6.93ZM9.58 11c.38-3.33 1.32-5.65 2.42-6.93c1.1 1.28 2.04 3.6 2.42 6.93H9.58Zm5.77 7.07A15.7 15.7 0 0 0 16.87 13h3.06a8.03 8.03 0 0 1-4.58 5.07Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 10.5l3 3l7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ size = 14, open = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.18s ease",
      }}
    >
      <path d="M5 7l5 6l5-6H5z" fill="currentColor" />
    </svg>
  );
}

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
function LanguageDropdown({ t }) {
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

    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
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
        nextPath =
          withoutLocale === "/" ? `/${toLang}` : `/${toLang}${withoutLocale}`;
      }
    }

    const target = nextPath + url.search + url.hash;
    setOpen(false);
    router.push(target);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.changeLanguage}
        onClick={() => setOpen((v) => !v)}
        className="lang-trigger"
        title={t.changeLanguage}
      >
        <span className="lang-trigger-icon">
          <GlobeIcon size={16} />
        </span>
        <span className="lang-trigger-code">{currentLocale.short}</span>
        <span className="lang-trigger-label">{currentLocale.label}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul
          role="menu"
          className="lang-menu"
          aria-label={t.changeLanguage}
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 10px)",
            minWidth: 240,
            background: "var(--card, #ffffff)",
            color: "var(--fg, #0f172a)",
            border: "1px solid rgba(15,23,42,0.10)",
            borderRadius: 16,
            padding: 8,
            boxShadow:
              "0 18px 40px rgba(15,23,42,0.14), 0 4px 10px rgba(15,23,42,0.08)",
            zIndex: 140,
            backdropFilter: "blur(8px)",
          }}
        >
          {LOCALES.map((opt) => {
            const active = opt.code === current;
            return (
              <li key={opt.code || "en"} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => onSelect(opt)}
                  className={`lang-item${active ? " lang-item--active" : ""}`}
                >
                  <span className="lang-item-main">
                    <span className="lang-item-short">{opt.short}</span>
                    <span className="lang-item-label">{opt.label}</span>
                  </span>

                  <span className="lang-item-side">
                    {active ? (
                      <>
                        <span className="lang-active-pill">{t.active}</span>
                        <span className="lang-check">
                          <CheckIcon size={16} />
                        </span>
                      </>
                    ) : null}
                  </span>
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
          gap: 10px;
          height: 42px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.10);
          background: rgba(255, 255, 255, 0.9);
          color: var(--header-fg);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          transition: border-color 0.18s ease, background 0.18s ease,
            box-shadow 0.18s ease, transform 0.18s ease;
          backdrop-filter: blur(8px);
        }
        .lang-trigger:hover {
          border-color: rgba(15, 23, 42, 0.18);
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.08);
        }
        .lang-trigger:focus-visible {
          outline: 2px solid rgba(37, 99, 235, 0.22);
          outline-offset: 2px;
        }

        .lang-trigger-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(15, 23, 42, 0.68);
        }

        .lang-trigger-code {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.06);
          color: rgba(15, 23, 42, 0.88);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .lang-trigger-label {
          font-weight: 600;
          color: rgba(15, 23, 42, 0.92);
        }

        .lang-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 12px;
          border: none;
          border-radius: 12px;
          background: #ffffff;
          color: inherit;
          cursor: pointer;
          transition: background 0.16s ease, transform 0.16s ease;
        }

        .lang-item:hover {
          background: rgba(15, 23, 42, 0.04);
        }

        .lang-item--active {
          background: rgba(37, 99, 235, 0.08);
        }

        .lang-item-main {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .lang-item-short {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 26px;
          padding: 0 8px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.06);
          color: rgba(15, 23, 42, 0.80);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .lang-item-label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(15, 23, 42, 0.92);
          white-space: nowrap;
        }

        .lang-item-side {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .lang-active-pill {
          font-size: 11px;
          font-weight: 700;
          color: #1d4ed8;
          background: rgba(37, 99, 235, 0.10);
          border: 1px solid rgba(37, 99, 235, 0.14);
          padding: 3px 8px;
          border-radius: 999px;
        }

        .lang-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #1d4ed8;
        }

        @media (max-width: 900px) {
          .lang-trigger-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ---------------- MOBILE DRAWER VIA PORTAL ---------------- */
function MobileDrawer({ open, onClose, children }) {
  const [mounted, setMounted] = useState(false);
  const [el, setEl] = useState(null);

  useEffect(() => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    setEl(div);
    setMounted(true);

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  if (!mounted || !el) return null;

  return createPortal(
    <div
      className={`nav-drawer ${open ? "nav-drawer--open" : ""}`}
      onClick={onClose}
    >
      <div className="nav-drawer-inner" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    el
  );
}

/* ---------------- HEADER ---------------- */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const effLocale = locale || "en";
  const t = useMemo(() => TEXT[effLocale] || TEXT.en, [effLocale]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="site-header site-header--light">
        <div className="container header-inner">
          <Link
            href={localeAwareHref("/", locale)}
            className="brand"
            aria-label={t.brandHome}
          >
            <span className="brand-logo">EU</span>
            <span className="brand-text">Debt Map</span>
          </Link>

          <nav className="nav-desktop">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={localeAwareHref(item.href, locale)}
                className={
                  "nav-link" +
                  (isActivePath(pathname, item.href, locale)
                    ? " nav-link--active"
                    : "")
                }
                aria-current={
                  isActivePath(pathname, item.href, locale) ? "page" : undefined
                }
              >
                {t.nav[item.key]}
              </Link>
            ))}
            <LanguageDropdown t={t} />
          </nav>

          <button
            className="hamburger"
            aria-label={t.toggleMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={localeAwareHref(item.href, locale)}
            className={
              "drawer-link" +
              (isActivePath(pathname, item.href, locale)
                ? " drawer-link--active"
                : "")
            }
            aria-current={
              isActivePath(pathname, item.href, locale) ? "page" : undefined
            }
          >
            {t.nav[item.key]}
          </Link>
        ))}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--header-border)",
          }}
        >
          <LanguageDropdown t={t} />
        </div>
      </MobileDrawer>
    </>
  );
}