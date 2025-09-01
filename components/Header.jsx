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

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Sluit het menu wanneer je van route wisselt
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
              className={
                "nav-link" + (pathname === item.href ? " nav-link--active" : "")
              }
            >
              {item.label}
            </Link>
          ))}
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
            className={
              "drawer-link" + (pathname === item.href ? " drawer-link--active" : "")
            }
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
