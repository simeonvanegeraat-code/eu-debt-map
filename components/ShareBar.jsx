// components/ShareBar.jsx
"use client";

import { useCallback, useMemo, useState } from "react";

export default function ShareBar({ title }) {
  const [copied, setCopied] = useState(false);
  const url = useMemo(() => (typeof window !== "undefined" ? window.location.href : ""), []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, [url]);

  const tweetUrl = useMemo(() => {
    const u = new URL("https://twitter.com/intent/tweet");
    u.searchParams.set("url", url);
    if (title) u.searchParams.set("text", title);
    return u.toString();
  }, [url, title]);

  const redditUrl = useMemo(() => {
    const u = new URL("https://www.reddit.com/submit");
    u.searchParams.set("url", url);
    if (title) u.searchParams.set("title", title);
    return u.toString();
  }, [url, title]);

  return (
    <div className="flex items-center gap-2 mt-3" aria-label="Share this page">
      <button className="btn" onClick={copy} aria-label="Copy link">
        {copied ? "✓ Copied" : "Copy link"}
      </button>
      <a className="btn" href={tweetUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        Share on X
      </a>
      <a className="btn" href={redditUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Reddit">
        Reddit
      </a>
    </div>
  );
}
