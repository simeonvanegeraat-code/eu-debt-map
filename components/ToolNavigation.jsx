"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { toolNavigationFor } from "@/lib/tool-navigation";
import styles from "./tool-navigation.module.css";

export default function ToolNavigation({ pathname }) {
  const navigation = toolNavigationFor(pathname);
  const linksRef = useRef(null);

  useEffect(() => {
    const links = linksRef.current;
    const active = links?.querySelector('[aria-current]');
    if (!active) return;
    const bounds = links.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    if (item.right > bounds.right) links.scrollLeft += item.right - bounds.right;
    else if (item.left < bounds.left) links.scrollLeft -= bounds.left - item.left;
  }, [pathname]);

  if (!navigation) return null;

  function browseTopics() {
    const links = linksRef.current;
    if (!links) return;
    const atEnd = links.scrollLeft + links.clientWidth >= links.scrollWidth - 2;
    links.scrollTo({
      left: atEnd ? 0 : links.scrollLeft + links.clientWidth * 0.75,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <div data-tool-navigation className={`${styles.bar} ${navigation.home ? "" : styles.desktopOnly}`}>
      <div className={styles.inner}>
        <nav ref={linksRef} id="atlas-topics" className={styles.links} aria-label={navigation.label}>
          {navigation.items.map((item, index) => (
            <Link key={item.href} href={item.href} prefetch={false} aria-current={item.current ? index === 0 ? "location" : "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button className={styles.browse} type="button" onClick={browseTopics} aria-label={navigation.browse} aria-controls="atlas-topics"><span aria-hidden="true">→</span></button>
      </div>
    </div>
  );
}
