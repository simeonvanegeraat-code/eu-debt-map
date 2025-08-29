export const metadata = { title: "About – EU Debt Map" };
export default function AboutPage(){
  return (
    <main className="container">
      <div className="card">
        <h1>About this project</h1>
        <p>This site visualizes estimated government gross debt for EU countries. Colors on the map indicate whether debt has increased (red) or decreased (green) since the previous period. Country pages show an estimated, 'ticking' value derived from the last two official data points.</p>
        <h2>Method (MVP)</h2>
        <ul>
          <li>Official releases (quarterly) are used as anchors.</li>
          <li>Between two releases we interpolate linearly to provide an estimated per-second change.</li>
          <li>Numbers here are demo data. Replace the dataset in <code>data/eu.json</code> with official values when available.</li>
        </ul>
        <p className="small">Disclaimer: estimates may differ from official statistics; always consult original sources for decisions.</p>
      </div>
    </main>
  );
}
