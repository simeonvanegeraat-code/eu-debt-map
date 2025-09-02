// app/layout.jsx
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "EU Debt Map",
  description:
    "Explore EU-27 government debt. Click a country to see a live ticking estimate. Data derived from Eurostat; figures are demo estimates.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Explore EU-27 government debt. Click a country to see a live ticking estimate.",
    url: "https://eu-debt-map.vercel.app/",
    siteName: "EU Debt Map",
    type: "website",
  },
  metadataBase: new URL("https://eu-debt-map.vercel.app"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
{/* AdSense loader (1x site-wide) */}
<Script
  id="adsense-js"
  strategy="afterInteractive"
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9252617114074571"
  crossOrigin="anonymous"
/>
        <Header />

        {children}

        <footer className="container grid" style={{ marginTop: 24 }}>
          <section className="card">© {new Date().getFullYear()} EU Debt Map</section>
          <section className="card">
            <a href="/about">About</a>
          </section>
        </footer>
      </body>
    </html>
  );
}
