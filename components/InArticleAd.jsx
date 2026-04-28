"use client";

import { useEffect, useRef, useState } from "react";

export default function InArticleAd() {
  const adRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!adRef.current) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Prevent crashes if AdSense is blocked, delayed or unavailable.
    }
  }, [mounted]);

  return (
    <aside className="in-article-ad" aria-label="Advertisement">
      <style jsx>{`
        .in-article-ad {
          margin: 40px 0;
          min-height: 280px;
        }

        .ad-label {
          margin: 0 0 10px;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6b7280;
          font-family: var(--font-sans, sans-serif);
        }

        .ad-placeholder {
          display: grid;
          place-items: center;
          min-height: 250px;
          border: 1px dashed #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
          color: #9ca3af;
          font-family: var(--font-sans, sans-serif);
          font-size: 0.85rem;
        }

        .ad-slot {
          display: block;
          text-align: center;
          min-height: 250px;
        }
      `}</style>

      <p className="ad-label">Advertisement</p>

      {!mounted ? (
        <div className="ad-placeholder" aria-hidden="true">
          Advertisement space
        </div>
      ) : (
        <ins
          ref={adRef}
          className="adsbygoogle ad-slot"
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-9252617114074571"
          data-ad-slot="8569800942"
        />
      )}
    </aside>
  );
}