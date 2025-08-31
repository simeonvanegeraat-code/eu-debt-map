export default function AboutPage(){
  return (
    <main className="container card">
      <h2>About this project</h2>
      <p>
        This site shows an indicative, ticking estimate of government debt by EU country,
        based on two reference dates. It is for education/visualization only and is not an
        official statistic.
      </p>
      <p>
        For production, you can later connect Eurostat/ECB data and run a scheduled update.
      </p>
    </main>
  );
}
