// app/ads-test/page.jsx
import AdBox from "@/components/AdBox";
import ConsentDebug from "@/components/ConsentDebug";

export const metadata = {
  title: "Ads Test • EU Debt Map",
  description: "Testing AdSense rendering with manual ad units + consent debugger.",
  robots: { index: false }, // niet indexeren
};

export default function AdsTestPage() {
  return (
    <main className="container card" style={{ padding: 24 }}>
      <h1>Ads Test</h1>
      <p className="tag">
        Deze pagina forceert handmatige advertentieblokken en toont live je Consent Mode status.
      </p>

      {/* ---- Handmatig advertentieblok 1 (met test-ads aan) ---- */}
      <AdBox slot="8705915822" test />

      <p>
        Als je hierboven niets ziet (ook na herladen en na het geven van advertising-consent),
        dan ligt het waarschijnlijk aan CMP/Consent of aan CSP-headers.
      </p>

      {/* ---- Handmatig advertentieblok 2 (ook test) ---- */}
      <AdBox slot="8705915822" test />

      {/* Live inzage in consent-cookies en dataLayer events */}
      <ConsentDebug />
    </main>
  );
}
