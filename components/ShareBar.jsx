// components/ShareBar.jsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

function Icon({ name, size = 16 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", ariaHidden: true };
  if (name === "link") {
    return (
      <svg {...common}><path d="M10.59 13.41a1 1 0 0 0 1.41 1.41l4.95-4.95a3 3 0 0 0-4.24-4.24l-1.41 1.41a1 1 0 1 0 1.41 1.41l1.41-1.41a1 1 0 0 1 1.41 1.41l-4.95 4.95ZM13.41 10.59a1 1 0 0 0-1.41-1.41L7.05 14.13a3 3 0 1 0 4.24 4.24l1.41-1.41a1 1 0 0 0-1.41-1.41l-1.41 1.41a1 1 0 1 1-1.41-1.41l4.95-4.95Z"/></svg>
    );
  }
  if (name === "x") {
    return (
      <svg {...common}><path d="M4 4h2.8l5.2 6.7L17.3 4H20l-7.1 9 7.5 9H17.6l-5.6-7.1L6.2 22H4l7.5-9L4 4z"/></svg>
    );
  }
  if (name === "reddit") {
    return (
      <svg {...common}><path d="M22 12c0 4.42-4.48 8-10 8S2 16.42 2 12s4.48-8 10-8c1.77 0 3.43.37 4.88 1.02l1.7-3.02 1.79.98-1.86 3.3A7.8 7.8 0 0 1 22 12Zm-14.5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM12 19c2.02 0 3.76-.86 4.66-2.11a.75.75 0 0 0-1.22-.86C14.79 16.9 13.5 17.5 12 17.5s-2.79-.6-3.44-1.47a.75.75 0 0 0-1.22.86C8.24 18.14 9.98 19 12 19Z"/></svg>
    );
  }
  return null;
}

export default function ShareBar({ title }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.href);
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }, [url]);

  const xUrl = useMemo(() => {
    const u = new URL("https://twitter.com/intent/tweet");
    if (url) u.searchParams.set("url", url);
    if (title) u.searchParams.set("text", title);
    return u.toString();
  }, [url, title]);

  const redditUrl = useMemo(() => {
    const u = new URL("https://www.reddit.com/submit");
    if (url) u.searchParams.set("url", url);
    if (title) u.searchParams.set("title", title);
    return u.toString();
  }, [url, title]);

  const Btn = ({ onClick, href, children, ariaLabel }) => (
    href ? (
      <a
        className="btn"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, paddingInline: 12 }}
      >
        {children}
      </a>
    ) : (
      <button
        className="btn"
        onClick={onClick}
        aria-label={ariaLabel}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, paddingInline: 12 }}
      >
        {children}
      </button>
    )
  );

  return (
    <div className="flex items-center gap-2 mt-3">
      <Btn onClick={copy} ariaLabel="Copy link">
        <Icon name="link" />
        {copied ? "Copied" : "Copy"}
      </Btn>
      <Btn href={xUrl} ariaLabel="Share on X">
        <Icon name="x" />
        X
      </Btn>
      <Btn href={redditUrl} ariaLabel="Share on Reddit">
        <Icon name="reddit" />
        Reddit
      </Btn>
    </div>
  );
}
