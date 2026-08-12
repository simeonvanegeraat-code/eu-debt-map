import GoogleConsentSettingsLink from "@/components/GoogleConsentSettingsLink";

export const metadata = {
  title: "Cookiebeleid • EU Debt Map",
  description:
    "Lees hoe EU Debt Map cookies gebruikt (noodzakelijk, analyse, advertising) en hoe je je voorkeuren beheert.",
  alternates: { canonical: "https://www.eudebtmap.com/nl/cookies" },
};

export default function CookiesPageNL() {
  return (
    <main className="container card" style={{ paddingTop: 24, paddingBottom: 36 }}>
      <h2 style={{ marginBottom: 8 }}>Cookiebeleid</h2>
      <p className="tag" style={{ marginBottom: 16 }}>
        We gebruiken cookies om onze website te laten werken en om te begrijpen hoe deze wordt gebruikt.
        In de EU/UK/CH respecteren we je keuzes via onze toestemmingsbanner.
      </p>

      <h3 style={{ marginTop: 24 }}>Categorieën</h3>
      <ul>
        <li>
          <strong>Noodzakelijk</strong> — vereist voor kernfunctionaliteit en veiligheid.
        </li>
        <li>
          <strong>Analyse</strong> — Vercel Web Analytics meet geaggregeerd gebruik zonder analysecookies.
        </li>
        <li>
          <strong>Advertenties</strong> — maakt het tonen van Google AdSense-advertenties mogelijk.
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Aanbieders</h3>
      <ul>
        <li><strong>Google Consent Management Platform</strong> — toestemmingsbeheer via Privacy en berichten (IAB TCF).</li>
        <li><strong>Google AdSense</strong> — advertenties op basis van de keuzes in Googles toestemmingsbericht.</li>
        <li><strong>Vercel Web Analytics</strong> — geaggregeerde websiteanalyse zonder cookies.</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Beheer je voorkeuren</h3>
      <p style={{ marginBottom: 12 }}>
        Je kunt je toestemming op ieder moment wijzigen of intrekken:
      </p>

      <GoogleConsentSettingsLink
        className="underline hover:no-underline"
        style={{ display: "inline-block", marginTop: 8 }}
      >
        Open privacy- en cookie-instellingen
      </GoogleConsentSettingsLink>

      <div style={{ marginTop: 32 }} />
    </main>
  );
}
