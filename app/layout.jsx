// app/layout.jsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata = { /* ...jouw metadata... */ };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* 1) Consent Mode v2 defaults (laad altijd eerst) */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            // Default: alles denied tot de gebruiker kiest
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500 // geef CMP even tijd
            });
          `}
        </Script>

        {/* 2) CookieScript CMP (laat deze staan) */}
        <Script
          id="cookiescript"
          src="https://cdn.cookie-script.com/s/bbe5413b31fadf1554acac4c6b3e4986.js"
          strategy="beforeInteractive"
        />

        {/* 3) AdSense meta + preconnects */}
        <meta name="google-adsense-account" content="ca-pub-9252617114074571" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />

        {/* 4) Laad AdSense ALTIJD (niet blokkeren); Consent Mode regelt opslag */}
        <Script
          id="adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9252617114074571"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* 5) GA4: mag je blijven blokkeren tot analytics-consent (optioneel) */}
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

        {/* 6) Bridge: update Consent Mode zodra de CMP-keuze bekend is */}
        <Script id="cmp-bridge" strategy="afterInteractive">
          {`
            function getCookie(name){
              return ('; '+document.cookie).split('; '+name+'=').pop().split(';')[0] || '';
            }
            function updateConsentFromCookieScript(){
              try{
                // CookieScript bewaart JSON in 'CookieScriptConsent'
                const raw = decodeURIComponent(getCookie('CookieScriptConsent'));
                if(!raw) return;
                const data = JSON.parse(raw);
                // Typische categorie-keys: necessary, analytics, advertisement, preferences
                const analytics = !!(data?.categories?.includes?.('analytics'));
                const ads = !!(data?.categories?.includes?.('advertisement'));
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'update', {
                  analytics_storage: analytics ? 'granted' : 'denied',
                  ad_storage:       ads ? 'granted' : 'denied',
                  ad_user_data:     ads ? 'granted' : 'denied',
                  ad_personalization: ads ? 'granted' : 'denied'
                });
              }catch(e){}
            }
            // Run bij pageload en elke keer als gebruiker voorkeuren wijzigt
            document.addEventListener('CookieScriptLoaded', updateConsentFromCookieScript);
            document.addEventListener('CookieScriptConsentUpdated', updateConsentFromCookieScript);
            // fallback
            setTimeout(updateConsentFromCookieScript, 1500);
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
