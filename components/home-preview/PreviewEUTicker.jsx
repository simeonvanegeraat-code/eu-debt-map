"use client";

import { useEffect, useState } from "react";
import styles from "./home-preview.module.css";

function formatEuro(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

export default function PreviewEUTicker({
  officialTotal,
  perSecond,
  locale,
  ariaLabel,
}) {
  const [value, setValue] = useState(officialTotal);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !Number.isFinite(perSecond)) return undefined;

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      setValue(officialTotal + perSecond * elapsedSeconds);
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [officialTotal, perSecond]);

  return (
    <div className={styles.liveTicker} role="img" aria-label={ariaLabel}>
      <strong aria-hidden="true" suppressHydrationWarning>
        {formatEuro(value, locale)}
      </strong>
    </div>
  );
}
