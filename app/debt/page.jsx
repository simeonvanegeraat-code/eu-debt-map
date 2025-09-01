// app/debt/page.jsx
export const metadata = {
  title: "What is Government Debt? • EU Debt Map",
  description:
    "Plain-English explanation of general government (S.13) gross debt in the EU, why it exists, and why it matters.",
};

export default function DebtExplainer() {
  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>What is Government Debt?</h2>
        <p>
          In EU statistics, <strong>government debt</strong> refers to the debt of the
          <em> general government sector (S.13)</em>: central, state, local governments
          and social security funds. It is usually shown as <strong>gross debt</strong> —
          total liabilities such as bonds and loans, without subtracting financial assets.
        </p>

        <h3>Why do governments borrow?</h3>
        <ul>
          <li>To fund public services and long-term investment.</li>
          <li>To stabilise the economy during recessions.</li>
          <li>To smooth cash flows when revenues and spending don’t align.</li>
        </ul>

        <h3>Why does debt matter?</h3>
        <ul>
          <li>Higher debt means higher interest costs and less fiscal space.</li>
          <li>Debt affects rates, inflation expectations and growth.</li>
          <li>In the EU it’s used to assess fiscal rules and sustainability.</li>
        </ul>

        <p className="tag">
          Definitions follow Eurostat concepts for general government (S.13) and
          Maastricht gross debt.
        </p>
      </section>
    </main>
  );
}
