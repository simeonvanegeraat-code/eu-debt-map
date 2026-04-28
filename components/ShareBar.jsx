// components/ShareBar.jsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const TEXT = {
  en: {
    copy: "Copy Link",
    copied: "Copied!",
    x: "Post",
    ariaCopy: "Copy link to clipboard",
    ariaX: "Share on X",
    ariaLinkedIn: "Share on LinkedIn",
    ariaWhatsApp: "Share on WhatsApp",
    ariaReddit: "Share on Reddit",
  },
  nl: {
    copy: "Kopieer link",
    copied: "Gekopieerd!",
    x: "Plaatsen",
    ariaCopy: "Kopieer link naar klembord",
    ariaX: "Delen op X",
    ariaLinkedIn: "Delen op LinkedIn",
    ariaWhatsApp: "Delen op WhatsApp",
    ariaReddit: "Delen op Reddit",
  },
  de: {
    copy: "Link kopieren",
    copied: "Kopiert!",
    x: "Posten",
    ariaCopy: "Link in die Zwischenablage kopieren",
    ariaX: "Auf X teilen",
    ariaLinkedIn: "Auf LinkedIn teilen",
    ariaWhatsApp: "Auf WhatsApp teilen",
    ariaReddit: "Auf Reddit teilen",
  },
  fr: {
    copy: "Copier le lien",
    copied: "Copié !",
    x: "Publier",
    ariaCopy: "Copier le lien dans le presse-papiers",
    ariaX: "Partager sur X",
    ariaLinkedIn: "Partager sur LinkedIn",
    ariaWhatsApp: "Partager sur WhatsApp",
    ariaReddit: "Partager sur Reddit",
  },
};

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
    focusable: "false",
  };

  if (name === "link") {
    return (
      <svg {...common}>
        <path d="M10.59 13.41a1 1 0 0 0 1.41 1.41l4.95-4.95a3 3 0 0 0-4.24-4.24l-1.41 1.41a1 1 0 1 0 1.41 1.41l1.41-1.41a1 1 0 0 1 1.41 1.41l-4.95 4.95ZM13.41 10.59a1 1 0 0 0-1.41-1.41L7.05 14.13a3 3 0 1 0 4.24 4.24l1.41-1.41a1 1 0 0 0-1.41-1.41l-1.41 1.41a1 1 0 1 1-1.41-1.41l4.95-4.95Z" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg {...common}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (name === "reddit") {
    return (
      <svg {...common}>
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-3.667-9.404a1.867 1.867 0 1 0-.001-3.734 1.867 1.867 0 0 0 .001 3.734zm7.334 0a1.867 1.867 0 1 0-.001-3.734 1.867 1.867 0 0 0 .001 3.734zm-9.041 3.327a.546.546 0 0 0-.022.77c.717.784 2.458 1.874 5.396 1.874 2.939 0 4.68-1.09 5.396-1.874a.546.546 0 1 0-.805-.736c-.443.483-1.748 1.272-4.591 1.272-2.845 0-4.148-.79-4.591-1.272a.546.546 0 0 0-.783-.034z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg {...common}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  if (name === "whatsapp") {
    return (
      <svg {...common}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    );
  }

  return null;
}

function buildShareUrl(baseUrl, params = {}) {
  const shareUrl = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value) shareUrl.searchParams.set(key, value);
  });

  return shareUrl.toString();
}

export default function ShareBar({
  url: providedUrl = "",
  title = "",
  summary,
  lang = "en",
}) {
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = TEXT[effLang] || TEXT.en;

  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(providedUrl || "");

  useEffect(() => {
    if (!providedUrl && typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [providedUrl]);

  const copy = useCallback(async () => {
    try {
      const valueToCopy =
        shareUrl ||
        providedUrl ||
        (typeof window !== "undefined" ? window.location.href : "");

      if (!valueToCopy) return;

      await navigator.clipboard.writeText(valueToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [providedUrl, shareUrl]);

  const xUrl = useMemo(() => {
    return buildShareUrl("https://twitter.com/intent/tweet", {
      url: shareUrl,
      text: title,
    });
  }, [shareUrl, title]);

  const redditUrl = useMemo(() => {
    return buildShareUrl("https://www.reddit.com/submit", {
      url: shareUrl,
      title,
    });
  }, [shareUrl, title]);

  const linkedInUrl = useMemo(() => {
    return buildShareUrl("https://www.linkedin.com/sharing/share-offsite/", {
      url: shareUrl,
    });
  }, [shareUrl]);

  const whatsAppUrl = useMemo(() => {
    return buildShareUrl("https://api.whatsapp.com/send", {
      text: [title, shareUrl].filter(Boolean).join(" "),
    });
  }, [shareUrl, title]);

  return (
    <div className="share-bar">
      <style jsx>{`
        .share-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 16px 0;
        }

        .btn-base {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          cursor: pointer;
          line-height: 1;
        }

        .btn-copy {
          background: #f3f4f6;
          color: #374151;
          border-color: #e5e7eb;
        }

        .btn-copy:hover {
          background: #e5e7eb;
          color: #111827;
        }

        .btn-x {
          background: #000000;
          color: #ffffff;
        }

        .btn-x:hover {
          opacity: 0.8;
          transform: translateY(-1px);
        }

        .btn-reddit {
          background: #ff4500;
          color: #ffffff;
        }

        .btn-reddit:hover {
          background: #e03d00;
          transform: translateY(-1px);
        }

        .btn-linkedin {
          background: #0a66c2;
          color: #ffffff;
        }

        .btn-linkedin:hover {
          background: #004182;
          transform: translateY(-1px);
        }

        .btn-whatsapp {
          background: #25d366;
          color: #ffffff;
        }

        .btn-whatsapp:hover {
          background: #128c7e;
          transform: translateY(-1px);
        }

        @media (max-width: 560px) {
          .share-bar {
            gap: 8px;
          }

          .btn-base {
            height: 38px;
            padding: 0 12px;
            font-size: 0.84rem;
          }
        }
      `}</style>

      <button
        type="button"
        onClick={copy}
        className="btn-base btn-copy"
        aria-label={t.ariaCopy}
      >
        <Icon name="link" />
        {copied ? t.copied : t.copy}
      </button>

      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-base btn-x"
        aria-label={t.ariaX}
      >
        <Icon name="x" />
        <span className="label">{t.x}</span>
      </a>

      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-base btn-linkedin"
        aria-label={t.ariaLinkedIn}
      >
        <Icon name="linkedin" />
        <span className="label">LinkedIn</span>
      </a>

      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-base btn-whatsapp"
        aria-label={t.ariaWhatsApp}
      >
        <Icon name="whatsapp" />
        <span className="label">WhatsApp</span>
      </a>

      <a
        href={redditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-base btn-reddit"
        aria-label={t.ariaReddit}
      >
        <Icon name="reddit" />
        <span className="label">Reddit</span>
      </a>
    </div>
  );
}