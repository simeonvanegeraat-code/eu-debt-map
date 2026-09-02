"use client";

import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/locale";

const LABELS = {
  en: "Skip to content",
  nl: "Ga naar de inhoud",
  de: "Zum Inhalt springen",
  fr: "Aller au contenu",
};

export default function LocalizedSkipLink() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);

  return (
    <a href="#content" className="visually-hidden">
      {LABELS[locale] || LABELS.en}
    </a>
  );
}
