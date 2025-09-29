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
        {/* 1) Consent Mode v2 defaults: alles DENIED tot keuze */}
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

        {/* 4) AdSense altijd laden (Consent Mode regelt opslag) */}
        <Script
          id="adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9252617114074571"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* 5) (Optioneel) GA4 pas na analytics-consent
            - Laat staan als je GA4 gebruikt; zo niet, kun je dit weglaten. */}
        {false && (
          <>
            <script
              type="text/plain"
              data-cookiecategory="analytics"
              data-blockingmode="auto"
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
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
                  gtag('config', 'G-XXXXXXX', { anonymize_ip: true });
                `,
              }}
            ></script>
          </>
        )}

        {/* 6) Bridge: CookieScript -> Google Consent Mode (performance/targeting mapping) */}
        <Script id="cmp-bridge" strategy="afterInteractive">
          {`
            function getCookie(name){
              return ('; '+document.cookie).split('; '+name+'=').pop().split(';')[0] || '';
            }

            function parseCategories(rawCookie) {
              try {
                const obj = JSON.parse(rawCookie);
                let cats = obj?.categories ?? [];
                if (typeof cats === 'string') {
                  try { cats = JSON.parse(cats); } catch(e) {}
                }
                return Array.isArray(cats) ? cats : [];
              } catch (e) {
                return [];
              }
            }

            function updateConsentFromCookieScript(){
              try{
                const raw = decodeURIComponent(getCookie('CookieScriptConsent'));
                if (!raw) return;

                const cats = parseCategories(raw);

                // CookieScript: analytics = "performance", advertising/personalization = "targeting"
                const analyticsGranted = cats.includes('performance');
                const adsGranted       = cats.includes('targeting');

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}

                gtag('consent', 'update', {
                  analytics_storage:  analyticsGranted ? 'granted' : 'denied',
                  ad_storage:         adsGranted ? 'granted' : 'denied',
                  ad_user_data:       adsGranted ? 'granted' : 'denied',
                  ad_personalization: adsGranted ? 'granted' : 'denied',
                  // extra storages (optioneel/informatief)
                  functionality_storage: 'granted',
                  personalization_storage: adsGranted ? 'granted' : 'denied',
                  security_storage: 'granted'
                });
              } catch (e) {}
            }

            document.addEventListener('CookieScriptLoaded', updateConsentFromCookieScript);
            document.addEventListener('CookieScriptConsentUpdated', updateConsentFromCookieScript);
            setTimeout(updateConsentFromCookieScript, 1200);
          `}
        </Script>
      </head>

      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
