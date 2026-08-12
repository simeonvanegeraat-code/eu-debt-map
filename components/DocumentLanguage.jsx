"use client";

import { useEffect } from "react";

const SUPPORTED_LANGUAGES = new Set(["en", "nl", "de", "fr"]);

export default function DocumentLanguage({ lang = "en" }) {
  const safeLang = SUPPORTED_LANGUAGES.has(lang) ? lang : "en";

  useEffect(() => {
    document.documentElement.lang = safeLang;

    return () => {
      document.documentElement.lang = "en";
    };
  }, [safeLang]);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(safeLang)}`,
      }}
    />
  );
}
