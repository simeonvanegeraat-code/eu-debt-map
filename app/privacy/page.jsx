// app/privacy/page.jsx
export const metadata = {
  title: "Privacy Policy • EU Debt Map",
  description:
    "Privacy & cookies policy for EU Debt Map, including Google AdSense and consent management details.",
  alternates: { canonical: "https://www.eudebtmap.com/privacy" },
};

export default function PrivacyPage() {
  const email = "firenature23@gmail.com";
  const lastUpdated = "September 9, 2025"; // update wanneer je iets wijzigt

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
          We use Google AdSense to display ads. Google and its partners may use cookies or similar
          technologies to serve personalised and non-personalised ads based on your visits to this and
          other websites.
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
          On your first visit you’ll see a consent banner powered by Cookiebot (a Google-certified CMP).
          You can change or withdraw your consent at any time:
        </p>
        <ul className="mt-3 list-disc pl-6 text-gray-300">
          <li>
            <a
              href="javascript:Cookiebot.renew()"
              className="underline hover:no-underline"
            >
              Open cookie settings
            </a>{" "}
            (reopen the banner to update your choices)
          </li>
          <li>Manage or delete cookies via your browser settings</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="mt-3 text-gray-300">
          We use lightweight, privacy-friendly analytics to understand site usage. These do not collect
          personally identifiable information.
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
