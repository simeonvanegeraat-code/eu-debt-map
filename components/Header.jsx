"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/locale";
import { getArticleTranslationHref } from "@/lib/articleTranslations";
import { COUNTRY_NAMES } from "@/lib/countries";
import { navigationFor, localeAwareHref, isActivePath } from "@/lib/navigation";

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

// Ordinary disclosure links use Tab; Escape closes and returns focus to the trigger.
function useDisclosureDismiss(open, onClose, rootRef, triggerRef) {
  useEffect(() => {
    if (!open) return;
    function onOutside(event) {
      if (!rootRef.current?.contains(event.target)) onClose();
    }
    function onEscape(event) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
      triggerRef.current?.focus();
    }
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open, onClose, rootRef, triggerRef]);
}

/* ---------------- LANGUAGE DROPDOWN ---------------- */
function LanguageDropdown({ t, inline = false, onNavigate }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const current = getLocaleFromPathname(pathname);

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDisclosureDismiss(open, close, ref, triggerRef);

  const currentLocale = LOCALES.find((l) => l.code === current) || LOCALES[0];

  function onSelect(next) {
    const url = new URL(window.location.href);
    const pathOnly = url.pathname;
    const fromLang = current || "en";
    const toLang = next.code === "" ? "en" : next.code;

    const isArticleDetail = /^\/(articles|nl\/articles|de\/articles|fr\/articles)\/[^/]+$/.test(
      pathOnly
    );
    const isArticleArchivePage = /^\/(?:(?:nl|de|fr)\/)?articles\/page\/\d+$/.test(
      pathOnly
    );

    let nextPath;

    if (isArticleArchivePage) {
      const alternate = document.querySelector(
        `link[rel="alternate"][hreflang="${toLang}"]`
      );

      nextPath = alternate
        ? new URL(alternate.href).pathname
        : toLang === "en"
          ? "/articles"
          : `/${toLang}/articles`;
    } else if (isArticleDetail) {
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
    onNavigate?.();
    router.push(target);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {!inline && <button
        ref={triggerRef}
        type="button"
        aria-controls="desktop-languages"
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
        <ChevronIcon open={open} />
      </button>}

        <ul
          id={inline ? "mobile-languages" : "desktop-languages"}
          hidden={!open && !inline}
          className={`lang-menu${inline ? " lang-menu--inline" : ""}`}
          aria-label={t.changeLanguage}
          style={inline ? undefined : {
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
              <li key={opt.code || "en"}>
                <button
                  type="button"
                  aria-pressed={active}
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

      <style jsx>{`
        .lang-menu { list-style: none; margin: 0; }
        .lang-menu--inline { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; padding: 0; }
        .lang-menu--inline .lang-item { padding: 12px 8px; gap: 4px; }
        .lang-menu--inline .lang-item-main { gap: 7px; }
        .lang-menu--inline .lang-item-label { font-size: 13px; }
        .lang-menu--inline .lang-item-side { display: none; }
        .lang-item:focus-visible { outline: 2px solid #2563eb; outline-offset: -2px; }
        .lang-trigger {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          height: 42px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.1);
          background: rgba(255, 255, 255, 0.9);
          color: var(--header-fg);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          transition: border-color 0.18s ease, background 0.18s ease,
            box-shadow 0.18s ease;
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

        .lang-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: #ffffff;
          color: inherit;
          cursor: pointer;
          transition: background 0.16s ease;
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
          color: rgba(15, 23, 42, 0.8);
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
          background: rgba(37, 99, 235, 0.1);
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
      `}</style>
    </div>
  );
}

function NavigationLinks({ items, locale, pathname, onNavigate, className = 'nav-panel-link' }) {
  return items.map(item => {
    const active = isActivePath(pathname, item.href, locale);
    return (
      <Link
        key={item.key}
        href={localeAwareHref(item.href, locale)}
        prefetch={false}
        className={`${className}${active ? ` ${className}--active` : ''}`}
        aria-current={active ? 'page' : undefined}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  });
}

function DesktopGroup({ group, locale, pathname }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDisclosureDismiss(open, close, rootRef, triggerRef);
  const active = group.items.some(item => isActivePath(pathname, item.href, locale));
  const panelId = `navigation-${group.key}`;

  return (
    <div className="nav-group" ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`nav-link nav-group-trigger${active ? ' nav-link--active' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(value => !value)}
      >
        {group.label}<ChevronIcon open={open} />
      </button>
      <div id={panelId} className={`nav-panel${group.key === 'countries' ? ' nav-panel--countries' : ''}`} hidden={!open}>
        <p className="nav-panel-intro">{group.intro}</p>
        <div className="nav-panel-links">
          <NavigationLinks items={group.items} locale={locale} pathname={pathname} onNavigate={close} />
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({ open, onClose, label, closeLabel, children }) {
  const dialogRef = useRef(null);

  function keepFocusInside(event) {
    if (event.key !== 'Tab') return;
    const dialog = dialogRef.current;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), a[href], summary')]
      .filter(element => element.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    const current = document.activeElement;
    if (event.shiftKey && (current === first || current === dialog)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      id="mobile-navigation"
      className="nav-drawer"
      aria-label={label}
      onKeyDown={keepFocusInside}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="nav-drawer-inner">
        <div className="drawer-header">
          <span className="drawer-title">EU Debt Map</span>
          <button className="drawer-close" type="button" onClick={onClose} aria-label={closeLabel} autoFocus>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {open && children}
      </div>
    </dialog>
  );
}

function HeaderNavigation({ pathname }) {
  const [open, setOpen] = useState(false);
  const locale = getLocaleFromPathname(pathname);
  const { t, groups, links } = useMemo(() => navigationFor(locale || 'en', COUNTRY_NAMES), [locale]);
  const close = useCallback(() => setOpen(false), []);
  const brandRef = useRef(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1180px)');
    function onResize() {
      if (desktop.matches && open) {
        close();
        // The mobile trigger is hidden after this breakpoint.
        requestAnimationFrame(() => brandRef.current?.focus());
      }
    }
    desktop.addEventListener('change', onResize);
    return () => desktop.removeEventListener('change', onResize);
  }, [open, close]);

  return (
    <>
      <header className="site-header site-header--light">
        <div className="container header-inner">
          <Link ref={brandRef} href={localeAwareHref('/', locale)} className="brand" aria-label={t.brandHome}>
            <span className="brand-logo">EU</span>
            <span className="brand-text">Debt Map</span>
          </Link>
          <nav className="nav-desktop" aria-label={t.navigation}>
            {groups.map(group => <DesktopGroup key={group.key} group={group} locale={locale} pathname={pathname} />)}
            <NavigationLinks items={links} locale={locale} pathname={pathname} className="nav-link" />
            <LanguageDropdown key={locale} t={t} />
          </nav>
          <button
            className={`hamburger${open ? ' hamburger--open' : ''}`}
            type="button"
            aria-label={t.toggleMenu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(value => !value)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>
      <MobileDrawer open={open} onClose={close} label={t.navigation} closeLabel={t.closeMenu}>
        <nav className="drawer-nav" aria-label={t.navigation}>
          {groups.map(group => (
            <details className="drawer-group" key={`${pathname}-${group.key}`} open={group.items.some(item => isActivePath(pathname, item.href, locale))}>
              <summary>{group.label}<ChevronIcon /></summary>
              <div className={group.key === 'countries' ? 'drawer-countries' : undefined}>
                <NavigationLinks items={group.items} locale={locale} pathname={pathname} onNavigate={close} className="drawer-link" />
              </div>
            </details>
          ))}
          <div className="drawer-direct">
            <NavigationLinks items={links} locale={locale} pathname={pathname} onNavigate={close} className="drawer-link" />
          </div>
        </nav>
        <div className="drawer-languages">
          <p>{t.language}</p>
          <LanguageDropdown t={t} inline onNavigate={close} />
        </div>
      </MobileDrawer>
    </>
  );
}

export default function Header() {
  const pathname = usePathname() || '/';
  return <HeaderNavigation key={pathname} pathname={pathname} />;
}
