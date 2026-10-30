"use client";

import { useEffect, useRef, useState } from "react";
import { activeCountrySection } from "@/lib/country-section-navigation";
import { getEUDebtCopy } from "./eu-debt-copy";
import styles from "./eu-debt-preview.module.css";

const sectionIds = ["trend", "verdeling", "betekenis", "bronnen"];

export default function EUDebtSectionNav({ lang = "nl" }) {
  const copy = getEUDebtCopy(lang).nav;
  const navRef = useRef(null);
  const linksRef = useRef(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let frame = 0;
    const entries = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    function update() {
      frame = 0;
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-navigation-height")) || 72;
      const readingLine = Math.max(navRef.current.getBoundingClientRect().bottom, headerHeight + navRef.current.offsetHeight) + 40;
      const positions = entries.map((section) => ({ id: section.id, top: section.getBoundingClientRect().top }));
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      const next = positions[0]?.top > readingLine ? null : activeCountrySection(positions, readingLine, atBottom);
      setActive(next);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    const resize = new ResizeObserver(schedule);
    entries.forEach((section) => resize.observe(section));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const scroller = linksRef.current;
    const current = scroller.querySelector('[aria-current="location"]');
    if (!current) return;
    const visible = scroller.getBoundingClientRect();
    const bounds = current.getBoundingClientRect();
    if (bounds.left < visible.left) scroller.scrollLeft -= visible.left - bounds.left + 8;
    else if (bounds.right > visible.right) scroller.scrollLeft += bounds.right - visible.right + 8;
  }, [active]);

  function browseSections() {
    const links = linksRef.current;
    const atEnd = links.scrollLeft + links.clientWidth >= links.scrollWidth - 2;
    links.scrollTo({ left: atEnd ? 0 : links.scrollLeft + links.clientWidth * 0.7, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <nav ref={navRef} className={styles.chapterNav} aria-label={copy.label}><div className={styles.container}><span className={styles.navTitle}>{copy.title}</span><div ref={linksRef} className={styles.chapterLinks} id="eu-debt-sections">{sectionIds.map((id, index) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>{copy.sections[index]}</a>)}</div><button type="button" className={styles.browseSections} onClick={browseSections} aria-label={copy.browse} aria-controls="eu-debt-sections"><span aria-hidden="true">→</span></button></div></nav>;
}
