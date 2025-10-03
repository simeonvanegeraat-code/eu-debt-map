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
  alternates: {
    canonical: "https://www.eudebtmap.com/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Viewport: volle breedte (ook in in-app browsers) */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

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
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />

        {/* 3) Theme color (site is nu altijd licht) */}
        <meta name="theme-color" content="#ffffff" />

        {/* 4) AdSense (Auto Ads). Consent Mode regelt opslag/consent. */}
        <Script
          id="adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9252617114074571"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* 5) (Optioneel) GA4 – uitgeschakeld. */}
        {false && (
          <>
            <Script id="ga4-loader" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-XXXXXXX', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </head>

      {/* Kleuren/typografie via CSS-variabelen */}
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
