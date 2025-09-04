export const metadata = {
  title: "Privacy Policy • EU Debt Map",
  description: "Privacy and cookies policy for EU Debt Map and AdSense use.",
};

export default function PrivacyPage() {
  return (
    <main className="container card">
      <h2>Privacy & Cookies Policy</h2>
      <p>
        EU Debt Map (“we”, “our”, “us”) values your privacy. This page explains
        how we handle data and cookies on this website.
      </p>

      <h3>Advertising and Google AdSense</h3>
      <p>
        We use Google AdSense to display advertisements. Google and its partners
        may use cookies and similar technologies to serve personalised and
        non-personalised ads based on your visits to this and other websites.
      </p>
      <p>
        Learn more at{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google’s Advertising Policy
        </a>
        .
      </p>

      <h3>Consent Management</h3>
      <p>
        When you first visit this site, you are presented with a cookie and
        consent banner powered by a Google-certified Consent Management
        Platform (CMP). You can change your choices at any time using the CMP
        tool.
      </p>

      <h3>Analytics and performance</h3>
      <p>
        We may use basic analytics to understand site usage. These do not
        collect personally identifiable information.
      </p>

      <h3>Your choices</h3>
      <ul>
        <li>You can accept or reject advertising cookies via the CMP.</li>
        <li>
          You can manage or delete cookies in your browser settings at any time.
        </li>
      </ul>

      <h3>Contact</h3>
      <p>
        For questions about this policy, please contact us at: info@eudebtmap.com
      </p>
    </main>
  );
}
