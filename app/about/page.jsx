export default function AboutPage(){
  return (
    <main className="container card">
      <h2>Over dit project</h2>
      <p>Deze site toont een indicatieve, getickte schatting van staatsschulden per land aan de hand van twee peildata.
      Het doel is educatie en visualisatie. Het is geen officieel cijfer en het kan afwijken van de werkelijkheid.</p>
      <p>Voor live gebruik kun je later een datapipe bouwen met Eurostat en een cron op Vercel of een kleine backend.</p>
    </main>
  );
}
