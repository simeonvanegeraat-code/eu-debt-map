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
        {/* 1) Consent Mode v2 defaults: alles DENIED tot gebruiker kiest */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied'
            });
          `}
        </Script>

        {/* 2) CookieScript CMP */}
        <Script
          id="cookiescript"
          src="https://cdn.cookie-script.com/s/bbe5413b31fadf1554acac4c6b3e4986.js"
          strategy="beforeInteractive"
        />

        {/* 3) AdSense meta + preconnects */}
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

        {/* 4) GA4 – pas na Analytics-consent */}
        <script
          type="text/plain"
          data-cookiecategory="analytics"
          data-blockingmode="auto"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-N33LHKDX14"
        ></script>
        <script
          type="text/plain"
          data-cookiecategory="analytics"
          data-blockingmode="auto"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-N33LHKDX14', { anonymize_ip: true });
            `,
          }}
        ></script>

        {/* 5) AdSense loader – pas na Advertising-consent */}
        <script
          type="text/plain"
          data-cookiecategory="advertising"
          data-blockingmode="auto"
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9252617114074571"
        ></script>
      </head>

      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
