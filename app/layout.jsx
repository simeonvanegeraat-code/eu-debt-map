// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";
import Script from "next/script";
import { usePathname } from "next/navigation";

export const metadata = {
  title: "EU Debt Map",
  description:
    "Explore EU-27 government debt. Click a country to see a live ticking estimate. Data derived from Eurostat.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Explore EU-27 government debt. Click a country to see a live ticking estimate.",
    url: "https://eudebtmap.com/",
    siteName: "EU Debt Map",
    type: "website",
  },
  metadataBase: new URL("https://eudebtmap.com"),
};

// 👇 Helper: maakt juiste prefix afhankelijk van locale
function useLocalePrefix() {
  const pathname = usePathname();
  const seg = pathname?.split("/").filter(Boolean)[0] || "";
  if (["nl", "de", "fr"].includes(seg)) return `/${seg}`;
  return ""; // default = EN
}

function Footer() {
  const prefix = useLocalePrefix();

  return (
    <footer className="container grid" style={{ marginTop: 24 }}>
      <section className="card">
        © {new Date().getFullYear()} EU Debt Map
      </section>
      <section
        className="card"
        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <a href={`${prefix}/about`}>About</a>
        <a href={`${prefix}/methodology`}>Methodology</a>
        <a href={`${prefix}/privacy`}>Privacy</a>
        <a href={`${prefix}/cookies`}>Cookies</a>

        {/* ✅ Extra link om Cookiebot-banner opnieuw te openen */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window?.Cookiebot?.renew?.();
          }}
        >
          Cookie settings
        </a>
      </section>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* 🔐 Cookiebot CMP — vóór álle scripts */}
        <Script
          id="cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="1c8b9798-d35e-4e4f-a808-8d5053cc6a97"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />

        {/* Snellere connectie voor ads */}
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://googleads.g.doubleclick.net"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Header />

        {children}

        {/* Dynamische footer */}
        <Footer />

        {/* ✅ Google AdSense loader (na CMP) */}
        <Script
          id="adsbygoogle-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9252617114074571"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
