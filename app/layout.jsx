// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // ⬅️ gebruik client Footer
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
        {/* 🔐 Cookiebot CMP — vóór álle scripts */}
        <Script
          id="cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="1c8b9798-d35e-4e4f-a808-8d5053cc6a97"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />

        {/* (optioneel) Snellere connecties voor ads */}
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

        {/* Dynamische, taalbewuste footer als Client Component */}
        <Footer />

        {/* ✅ Google AdSense loader (ná CMP) */}
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
