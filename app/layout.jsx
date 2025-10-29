// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import SideRails from "@/components/SideRails"; // ⬅️ NIEUW: site-wide desktop zijrails

export const metadata = {
  title: "EU Debt Map",
  description:
    "Explore EU-27 government debt. Click a country to see a live ticking estimate. Data derived from Eurostat.",
  metadataBase: new URL("https://www.eudebtmap.com"),
  openGraph: {
    title: "EU Debt Map",
    description:
      "Explore EU-27 government debt. Click a country to see a live ticking estimate.",
    url: "https://www.eudebtmap.com/",
    siteName: "EU Debt Map",
    type: "website",
  },
  alternates: {
    canonical: "https://www.eudebtmap.com/",
  },
  icons: {
    icon: [
      { url: "/eu_favicon_32.png", sizes: "32x32", type: "image/png" },
      { url: "/eu_favicon_64.png", sizes: "64x64", type: "image/png" },
      { url: "/eu_favicon_192.png", sizes: "192x192", type: "image/png" },
      { url: "/eu_favicon_512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/eu_favicon_180.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/eu_favicon_32.png"],
  },
};

export default function RootLayout({ children }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: "https://www.eudebtmap.com/",
    name: "EU Debt Map",
    logo: "https://www.eudebtmap.com/eu_favicon_512.png",
  };

  return (
    <html lang="en">
      <head>
        {/* Viewport: volle breedte (ook in in-app browsers) */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        {/* Manifest voor PWA/icons */}
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* Performance: fonts sneller beschikbaar */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* 1) Consent Mode v2 defaults: alles DENIED tot keuze (Funding Choices updatet dit) */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>

        {/* 2) AdSense meta + preconnects */}
        <meta name="google-adsense-account" content="ca-pub-9252617114074571" />
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

        {/* 3) Theme color (site is altijd licht) */}
        <meta name="theme-color" content="#ffffff" />

        {/* Klein SEO/UX zetje */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />

        {/* 4) AdSense loader voor handmatige slots (Auto Ads staat uit) */}
        <Script
          id="adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9252617114074571"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Structured data: merklogo (helpt favicon/brand in SERP) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>

      <body>
        {/* Skip link voor toetsenbord/screenreaders (gestyled via .visually-hidden in globals.css) */}
        <a href="#content" className="visually-hidden">
          Skip to content
        </a>

        <Header />

        {/* Main landmark voor betere semantiek en navigatie */}
        <main id="content" role="main">
          {children}
        </main>

        <Footer />

        {/* Site-wide desktop rails (verstopt op <1280px via CSS) */}
        <SideRails />
      </body>
    </html>
  );
}
