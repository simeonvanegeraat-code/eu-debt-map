function formatQuarter(value) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(value || "").trim());
  return match ? `T${match[2]} ${match[1]}` : value || "Période non disponible";
}

function formatBillions(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Non disponible";

  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(amount / 1_000_000_000)} Md€`;
}

function formatRatio(value) {
  const ratio = Number(value);
  if (!Number.isFinite(ratio) || ratio <= 0) return "Non disponible";

  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(ratio)} %`;
}

export default function FranceDebtClockIntro({ country }) {
  const debtPeriod = formatQuarter(country?.official_latest_time);
  const ratioPeriod = formatQuarter(country?.official_debt_to_gdp_time);

  return (
    <section
      className="card"
      aria-labelledby="france-debt-clock-intro"
      style={{ padding: 12, marginTop: 12 }}
    >
      <h2
        id="france-debt-clock-intro"
        className="text-base font-semibold mb-2"
      >
        Dette publique française : chiffre officiel et estimation
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginTop: 10,
        }}
      >
        <div>
          <div className="tag">Dernier montant officiel</div>
          <div className="mono" style={{ marginTop: 4 }}>
            {formatBillions(country?.last_value_eur)}
          </div>
          <div className="tag" style={{ marginTop: 4, opacity: 0.8 }}>
            {debtPeriod} · Eurostat
          </div>
        </div>

        <div>
          <div className="tag">Ratio officiel dette/PIB</div>
          <div className="mono" style={{ marginTop: 4 }}>
            {formatRatio(country?.official_debt_to_gdp_pct)}
          </div>
          <div className="tag" style={{ marginTop: 4, opacity: 0.8 }}>
            {ratioPeriod} · Eurostat
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-300" style={{ marginTop: 10 }}>
        Le grand compteur ci-dessus est une estimation qui prolonge la variation
        entre les deux derniers relevés trimestriels d’Eurostat. Il ne s’agit pas
        d’une mesure officielle en temps réel : le dernier montant publié et le
        ratio officiel sont donc affichés séparément du modèle.
      </p>
    </section>
  );
}
