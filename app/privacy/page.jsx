// app/privacy/page.jsx
export const metadata = {
  title: "Privacy Policy • EU Debt Map",
  description:
    "Privacy & cookies policy for EU Debt Map, including Google AdSense, Google Analytics 4, and consent management details.",
  alternates: { canonical: "https://www.eudebtmap.com/privacy" },
};

export default function PrivacyPage() {
  const email = "firenature23@gmail.com";
  const lastUpdated = "September 16, 2025"; // update wanneer je iets wijzigt

  return (
    <main className="container grid gap-6 py-10">
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy & Cookies Policy</h1>
        <p className="mt-2 text-sm text-gray-400">Last updated: {lastUpdated}</p>
        <p className="mt-4 text-gray-300">
          EU Debt Map (“we”, “our”, “us”) respects your privacy. This page explains what data we process,
          how we use cookies, and the choices you have.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Advertising & Google AdSense</h2>
        <p className="mt-3 text-gray-300">
          We use Google AdSense to display ads. In the EEA/UK/CH we follow Google’s requirements for user consent.
          Depending on your choice, Google may show personalized or non-personalized ads.
        </p>
        <p className="mt-3">
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Learn more about Google’s advertising technologies
          </a>
          .
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Consent Management</h2>
        <p className="mt-3 text-gray-300">
          On your first visit you’ll see a consent banner powered by <strong>CookieScript</strong> (IAB TCF and Google Consent Mode v2).
          You can change or withdraw your consent at any time:
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                try {
                  const cs = window.CookieScript || {};
                  if (typeof cs.showPreferences === "function") return cs.showPreferences();
                  if (typeof cs.open === "function") return cs.open("preferences");
                  if (typeof cs.renew === "function") return cs.renew();
                  if (typeof cs.show === "function") return cs.show();
                  if (typeof window.__tcfapi === "function") {
                    return window.__tcfapi("displayConsentUi", 2, () => {});
                  }
                  alert("Cookie preferences are currently unavailable. Please try again.");
                } catch {
                  alert("Cookie preferences are currently unavailable. Please try again.");
                }
              }}
              className="underline hover:no-underline"
            >
              Open cookie preferences
            </a>{" "}
            (update your choices)
          </li>
          <li>Manage or delete cookies via your browser settings.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="mt-3 text-gray-300">
          We use <strong>Google Analytics 4</strong> to understand site usage. In the EEA/UK/CH Analytics only runs
          after you grant consent (via Consent Mode v2). IP anonymization is enabled.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="mt-3 text-gray-300">
          Questions about this policy? Email{" "}
          <a href={`mailto:${email}`} className="underline hover:no-underline">
            {email}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
