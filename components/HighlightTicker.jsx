// components/HighlightTicker.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatEURFull(value) {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value || 0)));
}

function formatEURShort(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const abs = Math.abs(safeValue);

  if (abs >= 1_000_000_000_000) {
    return `${(safeValue / 1_000_000_000_000).toFixed(2)}tn`;
  }

  if (abs >= 1_000_000_000) {
    return `${(safeValue / 1_000_000_000).toFixed(2)}bn`;
  }

  if (abs >= 1_000_000) {
    return `${(safeValue / 1_000_000).toFixed(1)}m`;
  }

  return formatEURFull(safeValue);
}

function formatPerSecond(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const sign = safeValue >= 0 ? "+" : "−";
  const abs = Math.abs(safeValue);

  return `${sign}€${formatEURFull(abs)}/s`;
}

/**
 * Props:
 * - label: "Largest debt" | "Fastest growing" | ...
 * - flag: country flag text/emoji
 * - name: country name
 * - start: starting debt value in EUR
 * - perSecond: growth per second, can be negative
 * - accent: optional css color for the trend line
 * - href: optional link target
 * - compact: optional boolean, forces short value format
 */
export default function HighlightTicker({
  label,
  flag,
  name,
  start,
  perSecond,
  accent,
  href,
  compact = false,
}) {
  const safeStart = Number.isFinite(start) ? start : 0;
  const safePerSecond = Number.isFinite(perSecond) ? perSecond : 0;

  const [value, setValue] = useState(safeStart);

  useEffect(() => {
    const startValue = safeStart;
    const startedAt = Date.now();

    function updateValue() {
      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      setValue(startValue + safePerSecond * elapsedSeconds);
    }

    updateValue();

    const id = window.setInterval(updateValue, 1000);

    return () => window.clearInterval(id);
  }, [safeStart, safePerSecond]);

  const trendIcon = useMemo(() => {
    if (safePerSecond > 0) return "↑";
    if (safePerSecond < 0) return "↓";
    return "→";
  }, [safePerSecond]);

  const trendColor = useMemo(() => {
    if (accent) return accent;
    if (safePerSecond > 0) return "var(--bad)";
    if (safePerSecond < 0) return "var(--ok)";
    return "var(--muted)";
  }, [safePerSecond, accent]);

  const card = (
    <div
      className="highlight-ticker"
      data-compact={compact ? "true" : "false"}
      aria-label={`${label}: ${name}`}
    >
      <div className="highlight-label">{label}</div>

      <div className="highlight-country">
        <span aria-hidden>{flag}</span>
        <strong>{name}</strong>
      </div>

      <div className="highlight-value num" suppressHydrationWarning>
        <span className="value-full">€{formatEURFull(value)}</span>
        <span className="value-short">€{formatEURShort(value)}</span>
      </div>

      <div className="highlight-trend" style={{ color: trendColor }}>
        {trendIcon} {formatPerSecond(safePerSecond)} · live estimate
      </div>

      <style jsx>{`
        .highlight-ticker {
          width: 100%;
          min-width: 0;
          container-type: inline-size;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 14px;
          box-shadow: var(--shadow-sm);
          color: var(--fg);
          overflow: hidden;
        }

        .highlight-label {
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.25;
          font-weight: 600;
        }

        .highlight-country {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
          margin-top: 7px;
          color: #0f172a;
          font-size: 1rem;
          line-height: 1.3;
        }

        .highlight-country strong {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .highlight-value {
          width: 100%;
          min-width: 0;
          margin-top: 8px;
          color: #0f172a;
          font-family: var(--font-display), ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: clamp(1.65rem, 5.4cqw, 2.25rem);
          line-height: 1;
          font-weight: 850;
          letter-spacing: -0.055em;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: clip;
        }

        .value-short {
          display: none;
        }

        .highlight-trend {
          margin-top: 9px;
          font-size: 0.82rem;
          line-height: 1.35;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .highlight-ticker[data-compact="true"] .value-full {
          display: none;
        }

        .highlight-ticker[data-compact="true"] .value-short {
          display: inline;
        }

        @container (max-width: 360px) {
          .value-full {
            display: none;
          }

          .value-short {
            display: inline;
          }

          .highlight-value {
            font-size: clamp(1.75rem, 10cqw, 2.2rem);
            letter-spacing: -0.045em;
          }

          .highlight-trend {
            font-size: 0.78rem;
          }
        }
      `}</style>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="highlight-ticker-link">
        {card}

        <style jsx>{`
          .highlight-ticker-link {
            display: block;
            color: inherit;
            text-decoration: none;
          }

          .highlight-ticker-link:hover {
            text-decoration: none;
          }

          .highlight-ticker-link:hover :global(.highlight-ticker) {
            border-color: #bfdbfe;
            box-shadow: 0 16px 32px rgba(37, 99, 235, 0.12);
          }
        `}</style>
      </Link>
    );
  }

  return card;
}