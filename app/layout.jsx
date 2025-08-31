import "./globals.css";

export const metadata = {
  title: "EU Debt Map",
  description: "Indicatieve staatsschuld per Europees land (demo)."
};

export default function RootLayout({ children }){
  return (
    <html lang="nl">
      <body>
        <header className="container">
          <h1 className="big">EU Debt Map</h1>
          <div className="tag">MVP – demo-data, geen officiële cijfers</div>
        </header>
        {children}
        <footer className="container" style={{opacity:.8,paddingTop:24}}>
          <div className="grid">
            <div className="card">© {new Date().getFullYear()} EU Debt Map</div>
            <div className="card"><a href="/about">Over</a></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
