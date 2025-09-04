// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";
import Script from "next/script";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* 🔐 Cookiebot CMP — moet vóór álle scripts laden */}
        <Script
          id="cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="1c8b9798-d35e-4e4f-a808-8d5053cc6a97"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />

        {/* (optioneel) Snellere connectie voor ads */}
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

        <footer className="container grid" style={{ marginTop: 24 }}>
          <section className="card">© {new Date().getFullYear()} EU Debt Map</section>
          <section className="card" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/about">About</a>
            <a href="/methodology">Methodology</a>
            <a href="/privacy">Privacy</a>
            <a href="/cookies">Cookies</a>
          </section>
        </footer>

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
