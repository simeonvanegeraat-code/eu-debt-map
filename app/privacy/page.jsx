// app/privacy/page.jsx
import GoogleConsentSettingsLink from "@/components/GoogleConsentSettingsLink";

export const metadata = {
  title: "Privacy Policy • EU Debt Map",
  description:
    "Privacy & cookies policy for EU Debt Map, including Google AdSense, Google's consent management, and Vercel Web Analytics.",
  alternates: { canonical: "https://www.eudebtmap.com/privacy" },
};

export default function PrivacyPage() {
  const email = "firenature23@gmail.com";
  const lastUpdated = "August 1, 2026";

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
          On your first visit in the EEA, UK or Switzerland, Google&apos;s published consent message may appear. It is managed through
          <strong> Google Privacy &amp; messaging</strong> in AdSense and supports the IAB Transparency and Consent Framework (TCF).
          You can change or withdraw your consent at any time:
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <GoogleConsentSettingsLink className="underline hover:no-underline">
              Open privacy and cookie settings
            </GoogleConsentSettingsLink>{" "}
            (update your choices)
          </li>
          <li>Manage or delete cookies via your browser settings.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="mt-3 text-gray-300">
          We use <strong>Vercel Web Analytics</strong> for aggregated traffic statistics. According to Vercel, this analytics service
          stores anonymized data and does not use cookies. Read more in Vercel&apos;s{" "}
          <a
            href="https://vercel.com/docs/analytics/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            privacy and compliance documentation
          </a>
          .
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
