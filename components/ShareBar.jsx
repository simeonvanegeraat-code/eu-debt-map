// components/ShareBar.jsx
"use client";

import { useState } from "react";

export default function ShareBar({ url, title, summary }) {
  const [copied, setCopied] = useState(false);

  async function shareNative() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: summary, url });
      } else {
        await copy();
      }
    } catch {
      /* user cancelled */
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const btn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #1f2b3a",
    background: "#0b1220",
    cursor: "pointer",
    textDecoration: "none",
  };

  const asTag = { fontSize: 13, fontWeight: 600 };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: "𝕏",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: "in",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: "f",
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: "✉️",
    },
  ];

  return (
    <div
      role="group"
      aria-label="Share article"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {/* Native share / copy */}
      <button onClick={shareNative} style={{ ...btn, ...asTag }} className="tag">
        📤 Share
      </button>
      <button onClick={copy} style={{ ...btn, ...asTag }} className="tag">
        {copied ? "✓ Copied" : "🔗 Copy link"}
      </button>

      {/* Networks */}
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btn, ...asTag }}
          className="tag"
          aria-label={`Share on ${l.label}`}
        >
          {l.icon} {l.label}
        </a>
      ))}
    </div>
  );
}
