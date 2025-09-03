"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/debt", label: "What is Debt?" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

function LangSwitch() {
  const pathname = usePathname();
  // Simpele check: highlight als je in die taalroute zit
  return (
    <div className="lang-switch" style={{ marginLeft: 16, display: "inline-flex", gap: 8 }}>
      <Link
        href="/en"
        className={pathname?.startsWith("/en") || pathname === "/" ? "nav-link nav-link--active" : "nav-link"}
      >
        EN
      </Link>
      <span style={{ opacity: 0.4 }}>·</span>
      <Link
        href="/nl"
        className={pathname?.startsWith("/nl") ? "nav-link nav-link--active" : "nav-link"}
      >
        NL
      </Link>
      <span style={{ opacity: 0.4 }}>·</span>
      <Link
        href="/de"
        className={pathname?.startsWith("/de") ? "nav-link nav-link--active" : "nav-link"}
      >
        DE
      </Link>
      <span style={{ opacity: 0.4 }}>·</span>
      <Link
        href="/fr"
        className={pathname?.startsWith("/fr") ? "nav-link nav-link--active" : "nav-link"}
      >
        FR
      </Link>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Sluit het menu bij route wissel
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Logo / title */}
        <Link href="/" className="brand">
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
          <LangSwitch />
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

        {/* Taal switch in mobile menu */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1f2937", display: "flex", gap: 12 }}>
          <Link href="/en" className="drawer-link">EN</Link>
          <Link href="/nl" className="drawer-link">NL</Link>
          <Link href="/de" className="drawer-link">DE</Link>
          <Link href="/fr" className="drawer-link">FR</Link>
        </div>
      </div>
    </header>
  );
}
