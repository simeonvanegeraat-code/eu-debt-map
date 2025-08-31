import "./globals.css";

export const metadata = {
  title: "EU Debt Map",
  description: "Indicative government debt per EU country (demo data)."
};

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <body>
        <header className="container">
          <h1 className="big">EU Debt Map</h1>
          <div className="tag">MVP — demo figures, not official statistics</div>
        </header>
        {children}
        <footer className="container" style={{opacity:.8,paddingTop:24}}>
          <div className="grid">
            <div className="card">© {new Date().getFullYear()} EU Debt Map</div>
            <div className="card"><a href="/about">About</a></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
