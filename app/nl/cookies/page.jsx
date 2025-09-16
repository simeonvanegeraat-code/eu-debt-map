export const metadata = {
  title: "Cookiebeleid • EU Debt Map",
  description:
    "Lees hoe EU Debt Map cookies gebruikt (noodzakelijk, analyse, advertising) en hoe je je voorkeuren beheert.",
  alternates: { canonical: "https://www.eudebtmap.com/nl/cookies" },
};

export default function CookiesPageNL() {
  return (
    <main className="container card" style={{ padding: "24px 0 36px" }}>
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
          <strong>Analyse</strong> — helpt ons gebruik te meten (Google Analytics 4).
        </li>
        <li>
          <strong>Advertenties</strong> — maakt het tonen van Google AdSense-advertenties mogelijk.
        </li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Aanbieders</h3>
      <ul>
        <li><strong>CookieScript</strong> — toestemmingsbeheer (IAB TCF, Consent Mode v2).</li>
        <li><strong>Google Analytics 4</strong> — meting & inzichten (na toestemming).</li>
        <li><strong>Google AdSense</strong> — advertenties (gepersonaliseerd alleen na toestemming in EEA/UK/CH).</li>
      </ul>

      <h3 style={{ marginTop: 24 }}>Beheer je voorkeuren</h3>
      <p style={{ marginBottom: 12 }}>
        Je kunt je toestemming op ieder moment wijzigen of intrekken:
      </p>

      <a
        href="#"
        className="csconsentlink underline hover:no-underline"
        style={{ display: "inline-block", marginTop: 8 }}
      >
        Open cookievoorkeuren
      </a>

      <div style={{ marginTop: 32 }} />
    </main>
  );
}
