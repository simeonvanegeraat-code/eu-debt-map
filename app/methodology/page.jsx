// app/methodology/page.jsx
export const metadata = {
  title: "Methodology • EU Debt Map",
  description:
    "Eurostat source (gov_10q_ggdebt), units and the simple per-second interpolation for the live ticker.",
};

export default function MethodologyPage() {
  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Methodology</h2>

        <h3>Official source</h3>
        <p>
          We use Eurostat’s quarterly dataset <strong>gov_10q_ggdebt</strong> (general
          government gross debt, Maastricht definition). Filters:
        </p>
        <ul>
          <li><code>freq=Q</code> quarterly</li>
          <li><code>sector=S13</code> general government</li>
          <li><code>na_item=GD</code> gross debt</li>
          <li><code>unit=MIO_EUR</code> million euro</li>
          <li>Latest quarters for all EU-27 countries (Eurostat uses EL for Greece)</li>
        </ul>

        <h3>Conversion & structure</h3>
        <p>
          Values arrive in million euro and are converted to euro (×1,000,000). The app
          stores the latest two quarters per country and computes a live estimate.
        </p>

        <h3>Live ticker (simple interpolation)</h3>
        <pre className="card" style={{ overflowX: "auto" }}>
{`rate_per_second = (last_value - prev_value) / seconds_between_quarters

current_estimate(now) =
  if now <= last_quarter_end:
     linear interpolation between prev and last
  else:
     last_value + rate_per_second * (now - last_quarter_end)`}
        </pre>

        <h3>Limitations</h3>
        <ul>
          <li>Quarterly data → intra-quarter changes are interpolated.</li>
          <li>Some countries may have only one recent point → flat display.</li>
          <li>Minor rounding differences vs. national sources may occur.</li>
        </ul>

        <p className="tag">
          Source: Eurostat statistics API — dataset <em>gov_10q_ggdebt</em>.
        </p>
      </section>
    </main>
  );
}
