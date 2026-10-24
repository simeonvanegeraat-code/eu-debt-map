"use client";

import { useEffect, useRef } from "react";
import { activeCountrySection } from "@/lib/country-section-navigation";
import styles from "./country-page-frame.module.css";

export default function CountryPageFrame({ children, className, lang }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const navigation = root?.querySelector("#debt-now + nav");
    if (!navigation) return;
    const scroller = navigation.firstElementChild;
    const links = Array.from(navigation.querySelectorAll('a[href^="#"]'));
    const entries = links.map(link => ({
      link,
      section: root.querySelector(link.getAttribute("href")),
    })).filter(entry => entry.section);
    if (!entries.length) return;
    let frame = 0;
    let activeLink = null;

    function update() {
      frame = 0;
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-navigation-height")) || 72;
      const readingLine = Math.max(navigation.getBoundingClientRect().bottom, headerHeight + navigation.offsetHeight) + 20;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      const id = activeCountrySection(entries.map(({ section }) => ({
        id: section.id,
        top: section.getBoundingClientRect().top,
      })), readingLine, atBottom);
      const current = entries.find(entry => entry.section.id === id);
      if (!current) return;
      if (activeLink !== current.link) {
        activeLink = current.link;
        for (const entry of entries) {
          if (entry === current) entry.link.setAttribute("aria-current", "location");
          else entry.link.removeAttribute("aria-current");
        }
      }
      const visible = scroller.getBoundingClientRect();
      const item = current.link.getBoundingClientRect();
      if (item.left < visible.left) scroller.scrollLeft -= visible.left - item.left + 8;
      else if (item.right > visible.right) scroller.scrollLeft += item.right - visible.right + 8;
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    navigation.addEventListener("transitionend", schedule);
    schedule();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      navigation.removeEventListener("transitionend", schedule);
      links.forEach(link => link.removeAttribute("aria-current"));
    };
  }, []);

  return <article className={className + " " + styles.pageFrame} ref={rootRef} lang={lang}>{children}</article>;
}
