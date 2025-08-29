import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "EU Debt Map",
  description: "Live EU debt map with per-country ticking meters and trends. Estimates based on official quarterly data."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const client = "ca-pub-9252617114074571"; // replace if needed
  return (
    <html lang="en">
      <head>
        <Script id="adsense-global" strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
          crossOrigin="anonymous" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
