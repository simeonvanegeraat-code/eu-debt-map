"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./country-preview.module.css";

const DURATION_MS = 900;

function formatValue(value, locale, format, compact, signed) {
  if (!Number.isFinite(value)) return "—";

  if (format === "currency") {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 2 : 0,
    }).format(signed ? Math.abs(value) : value);
    if (signed && value > 0) return `+${formatted}`;
    if (signed && value < 0) return `−${formatted}`;
    return formatted;
  }

  const normalizedValue = Math.abs(value) < 0.05 ? 0 : value;
  const sign = signed && normalizedValue > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(normalizedValue)}%`;
}

export default function AnimatedMetricValue({
  value,
  locale,
  formattedValue,
  format = "percent",
  compact = false,
  signed = false,
  suffix = "",
}) {
  const target = Number(value);
  const fallbackText = useMemo(
    () => formatValue(target, locale, format, compact, signed),
    [compact, format, locale, signed, target]
  );
  const finalText = `${formattedValue || fallbackText}${suffix}`;
  const [displayValue, setDisplayValue] = useState(target);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !Number.isFinite(target)) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    let frameId = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        observer.disconnect();
        const startedAt = performance.now();

        function tick(now) {
          const progress = Math.min((now - startedAt) / DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(target * eased);
          if (progress < 1) frameId = window.requestAnimationFrame(tick);
        }

        setDisplayValue(0);
        frameId = window.requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [target]);

  return (
    <span className={styles.metricAnimationValue} ref={elementRef}>
      <span className={styles.metricAnimationSr}>{finalText}</span>
      <span aria-hidden="true">
        {displayValue === target
          ? finalText
          : `${formatValue(displayValue, locale, format, compact, signed)}${suffix}`}
      </span>
    </span>
  );
}
