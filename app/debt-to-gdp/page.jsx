// app/debt-to-gdp/page.jsx
import DebtToGDPList from "./DebtToGDPList";

export const dynamic = "force-static"; // deze pagina zelf heeft geen SSR-fetch
export const revalidate = 0;

export default function DebtToGDPPage() {
  return (
    <main className="container" style={{ display: "grid", gap: 16 }}>
      <header>
        <h1 style={{ margin: 0 }}>Debt-to-GDP</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          Why it matters: The EU’s reference value is <strong>60%</strong>. Countries below ~60% usually have
          more fiscal room and lower refinancing risk. Persistently high ratios (&gt;90%) can make public finances
          more sensitive to rate shocks and recessions.
        </p>
      </header>

      <section className="card">
        <DebtToGDPList />
      </section>
    </main>
  );
}
