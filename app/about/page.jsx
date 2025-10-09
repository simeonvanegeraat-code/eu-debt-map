// app/about/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/about";
  const title = "About & Contact | EU Debt Map";
  const description = "Learn about EU Debt Map, why it was created, and how to get in touch.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}${path}`,
        nl: `${base}/nl${path}`,
        de: `${base}/de${path}`,
        fr: `${base}/fr${path}`,
        "x-default": `${base}${path}`,
      },
    },
    openGraph: {
      title,
      description:
        "EU Debt Map is an independent hobby project visualizing EU-27 national debt. Contact Simeon via email for feedback or questions.",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function AboutPage() {
  const email = "firenature23@gmail.com";

  // JSON-LD (Person) voor eenvoudige 'about' markup
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Simeon",
    url: "https://www.eudebtmap.com",
    email,
    description:
      "Independent hobby project visualizing EU government debt with live estimates.",
  };

  return (
    <main className="container grid gap-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      {/* Personal intro */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h1 className="text-3xl font-extrabold tracking-tight">About & Contact</h1>
        <p className="mt-4 text-gray-300">👋 Hi, I’m <strong>Simeon</strong>.</p>
        <p className="mt-3 text-gray-300">
          I created <strong>EU Debt Map</strong> as a personal hobby project. I’ve always
          been curious about economics and data, and I wanted to build something
          that makes complex numbers, like national debt, easier to understand.
        </p>
        <p className="mt-3 text-gray-300">
          This site is independent: I’m not part of any government or institution.
          It’s just me experimenting with web development and data visualization.
        </p>
        <p className="mt-3 text-gray-300">
          Since I’m still learning and improving the site, your feedback means a lot.
          If you spot mistakes, have ideas for new features, or just want to say hi:
        </p>
        <p className="mt-3 text-gray-200 font-semibold">
          📧 <a href={`mailto:${email}`} className="underline hover:no-underline">{email}</a>
        </p>
      </section>

      {/* Project */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">About the Project</h2>
        <p className="mt-3 text-gray-300">
          EU Debt Map is an educational visualization of government debt across the EU-27.
          We combine the two most recent Eurostat reference periods to estimate a live,
          ticking total per country. Our aim is to raise awareness and make complex
          financial data easier to grasp.
        </p>
        <p className="mt-3 text-gray-300">
          For detailed calculations and sources, please see our{" "}
          <a href="/methodology" className="underline hover:no-underline">Methodology</a> page.
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Disclaimer: Estimates are for educational purposes only and not official statistics.
        </p>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border border-gray-700/50 p-6 bg-[#0b1220]/60">
        <h2 className="text-2xl font-bold">Stay in Touch</h2>
        <p className="mt-3 text-gray-300">
          You can always reach me directly via email, or follow updates on social media.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href={`mailto:${email}`} className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            Email Simeon
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-600 px-4 py-3 text-center font-semibold hover:bg-gray-800">
            Follow on X (Twitter)
          </a>
        </div>
      </section>
    </main>
  );
}
