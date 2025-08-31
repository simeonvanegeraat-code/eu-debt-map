export const metadata = {
  title: "EU Debt Map – MVP",
  description: "Demo — live-ish estimates of national debt for EU-27 countries.",
  metadataBase: new URL("https://eu-debt-map.vercel.app"),
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <h1 style={{fontSize: '42px', fontWeight: 800, marginBottom: 6}}>EU Debt Map</h1>
          <p className="small">MVP — demo figures, not official statistics</p>
          <hr className="sep" />
          {children}
          <div className="footer">
            <span>© 2025 EU Debt Map</span>
            <a className="small" href="/about">About</a>
          </div>
        </div>
      </body>
    </html>
  );
}
