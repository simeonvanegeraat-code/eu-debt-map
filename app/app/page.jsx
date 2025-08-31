import EuropeMap from "@/components/EuropeMap";
import { countries, trendFor } from "@/lib/data";

function formatEUR(v) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
    Math.round(v)
  );
}

export default function HomePage() {
  const valid = countries.filter(
    (c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0
  );

  const largestDebt =
    valid.length > 0
      ? valid.reduce((a, b) =>
          a.last_value_eur > b.last_value_eur ? a : b
        )
      : null;

  const withDelta = valid.map((c) => ({
    ...c,
    delta: c.last_value_eur - c.prev_value_eur,
  }));
  const fastestGrowing =
    withDelta.length > 0
      ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b))
      : null;

  const falling = valid.filter((c) => c.last_value_eur < c.prev_value_eur);
  const fallingPreview = falling.slice(0, 6);
  const fallingMore = Math.max(falling.length - fallingPreview.length, 0);

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>
          Welcome to EU Debt Map
        </h2>
        <p style={{ margin: 0 }}>
          Explore the government debt of all EU countries.{" "}
          <strong>Click a country on the map</strong> to see a live, ticking
          estimate for that country.
        </p>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU overview</h3>
        <div className="mapWrap">
          <EuropeMap />
        </div>
      </section>
    </main>
  );
}
