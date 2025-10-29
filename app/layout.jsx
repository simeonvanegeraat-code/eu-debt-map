// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

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
  alternates: { canonical: "https://www.eudebtmap.com/" },
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Consent Mode defaults (alles denied tot keuze) */}
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

        {/* AdSense meta + preconnects */}
        <meta name="google-adsense-account" content="ca-pub-9252617114074571" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />

        <meta name="theme-color" content="#ffffff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />

        {/* AdSense Auto Ads loader (één keer, site-wide) */}
        <Script
          id="adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9252617114074571"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>

      <body>
        <a href="#content" className="visually-hidden">Skip to content</a>
        <Header />
        <main id="content" role="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
