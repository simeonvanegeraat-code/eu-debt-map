export default function GermanyDebtClockIntro() {
  return (
    <section
      className="card"
      aria-labelledby="germany-debt-clock-intro"
      style={{ padding: 12, marginTop: 12 }}
    >
      <h2
        id="germany-debt-clock-intro"
        className="text-base font-semibold mb-2"
      >
        Deutschlands Staatsverschuldung im Überblick
      </h2>
      <p className="text-sm text-slate-300">
        Diese Seite zeigt die <strong>Schuldenuhr Deutschland</strong> als
        geschätzte Fortschreibung der Staatsverschuldung. Der Zähler basiert
        auf den zwei jüngsten offiziellen Eurostat-Referenzwerten und führt
        deren durchschnittliche Veränderung bis heute fort.
      </p>
      <p className="text-sm text-slate-300" style={{ marginTop: 6 }}>
        Der Live-Wert ist ein Modell und keine amtliche Echtzeitmessung. Die
        offiziellen Referenzperioden, die Schuldenquote und das geschätzte
        Tempo werden auf dieser Seite getrennt ausgewiesen.
      </p>
    </section>
  );
}
