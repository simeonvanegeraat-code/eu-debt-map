// lib/articles.js
// Klein, file-based "CMS" voor artikelen. Pas of voeg items toe.
// Beschikbare velden:
// slug (unique), title, summary, tags[], date (YYYY-MM-DD), lang ("en"|"nl"|"de"|"fr"), body (JSX string)

export const articles = [
  {
    slug: "eu-debt-to-gdp-2025",
    title: "Debt-to-GDP Ratios of EU Countries in 2025",
    summary: "A full overview of government debt across all 27 EU countries in 2025, explained in simple terms with rankings, trends, and key insights.",
    tags: ["EU", "Debt", "GDP", "Analysis"],
    date: "2025-09-07",
    lang: "en",
    body: `
    <h2>What is Debt-to-GDP?</h2>
    <p>The debt-to-GDP ratio shows how much money a country owes compared to the size of its economy. 
    If the ratio is 100%, the country owes the same as it produces in one year. 
    A higher number means a heavier debt burden, while a lower number shows a lighter debt load. 
    This measure is often used to compare the financial health of countries.</p>

    <h2>EU averages in 2025</h2>
    <p>At the start of 2025, government debt in the European Union was about <strong>82% of GDP</strong>. 
    In the euro area (the 20 countries using the euro), the average was even higher, around <strong>88%</strong>. 
    EU rules suggest debt should stay below 60%, but more than half of the member states are above this level.</p>

    <h2>Ranking of EU countries (Q1 2025)</h2>
    <p>Here is the ranking of all 27 EU countries by their debt-to-GDP ratio in the first quarter of 2025:</p>
    <table>
      <tr><th>Country</th><th>Debt-to-GDP (%)</th><th>Change vs end-2024</th></tr>
      <tr><td>Greece</td><td>152.5</td><td>-1.1</td></tr>
      <tr><td>Italy</td><td>137.9</td><td>+2.5</td></tr>
      <tr><td>France</td><td>114.1</td><td>+0.9</td></tr>
      <tr><td>Belgium</td><td>106.8</td><td>+2.1</td></tr>
      <tr><td>Spain</td><td>103.5</td><td>+1.6</td></tr>
      <tr><td>Portugal</td><td>96.4</td><td>+1.5</td></tr>
      <tr><td>Austria</td><td>84.9</td><td>+3.5</td></tr>
      <tr><td>Finland</td><td>83.7</td><td>+1.6</td></tr>
      <tr><td>Hungary</td><td>75.3</td><td>+1.8</td></tr>
      <tr><td>Slovenia</td><td>69.9</td><td>+2.9</td></tr>
      <tr><td>Cyprus</td><td>64.3</td><td>-0.8</td></tr>
      <tr><td>Slovakia</td><td>62.8</td><td>+3.5</td></tr>
      <tr><td>Germany</td><td>62.3</td><td>-0.1</td></tr>
      <tr><td>Croatia</td><td>58.4</td><td>+0.8</td></tr>
      <tr><td>Poland</td><td>57.4</td><td>+2.2</td></tr>
      <tr><td>Romania</td><td>55.8</td><td>+1.0</td></tr>
      <tr><td>Malta</td><td>48.1</td><td>+0.7</td></tr>
      <tr><td>Latvia</td><td>45.6</td><td>-1.2</td></tr>
      <tr><td>Czechia</td><td>43.4</td><td>0.0</td></tr>
      <tr><td>Netherlands</td><td>43.2</td><td>-0.6</td></tr>
      <tr><td>Lithuania</td><td>40.6</td><td>+2.4</td></tr>
      <tr><td>Ireland</td><td>34.9</td><td>-3.7</td></tr>
      <tr><td>Sweden</td><td>33.5</td><td>-0.4</td></tr>
      <tr><td>Denmark</td><td>29.9</td><td>-0.6</td></tr>
      <tr><td>Luxembourg</td><td>26.1</td><td>-0.2</td></tr>
      <tr><td>Estonia</td><td>24.1</td><td>+0.5</td></tr>
      <tr><td>Bulgaria</td><td>23.9</td><td>-0.2</td></tr>
    </table>
    <figure style="max-width:900px;margin:16px auto;">
  <img
    src="/images/eu-debt-heatmap-2025.png"
    alt="EU countries ranked by debt-to-GDP ratio in Q1 2025"
    loading="lazy"
    decoding="async"
    style="width:100%;height:auto;display:block;border-radius:8px;"
  />
  <figcaption style="font-size:0.9rem;opacity:0.8;text-align:center;margin-top:6px;">
    Source: Eurostat (gov_10q_ggdebt, Q1 2025)
  </figcaption>
</figure>


    <h2>Top and bottom countries</h2>
    <p><strong>Highest debt:</strong> Greece (152.5%), Italy (137.9%), France (114.1%). 
    These countries carry very heavy debt burdens and are closely watched by financial markets.</p>
    <p><strong>Lowest debt:</strong> Bulgaria (23.9%), Estonia (24.1%), Luxembourg (26.1%). 
    These countries have strong finances and plenty of room to borrow if needed.</p>

    <h2>Regional patterns</h2>
    <p>There is a clear North–South divide in Europe. 
    Southern countries like Greece, Italy, Spain and Portugal have much higher debt. 
    Northern and Eastern countries such as Denmark, Sweden, Estonia and Bulgaria keep debt much lower. 
    Still, there are exceptions: Finland in the north has debt above 80%, while Portugal has managed to cut its debt in recent years.</p>

    <h2>Why debt levels change</h2>
    <p>Several key factors explain why some countries’ debt goes up and others’ goes down:</p>
    <ul>
      <li><strong>Economic growth:</strong> If GDP grows fast, the ratio usually goes down, even if debt stays the same.</li>
      <li><strong>Inflation:</strong> Rising prices increase GDP in money terms, making debt look smaller compared to the economy.</li>
      <li><strong>Government spending:</strong> Countries with big budget deficits (spending more than they earn) see debt rise quickly.</li>
      <li><strong>Interest costs:</strong> Higher interest rates make debt more expensive to service, especially for high-debt countries like Italy.</li>
    </ul>

    <h2>Recent changes since 2024</h2>
    <p>Between early 2024 and early 2025:</p>
    <ul>
      <li><strong>Biggest improvements:</strong> Greece (–9.3 points), Cyprus (–8.2), Ireland (–6.1).</li>
      <li><strong>Biggest increases:</strong> Poland (+6.1), Finland (+5.1), Austria (+3.5).</li>
    </ul>
    <p>This shows that some countries are making progress, while others are still struggling.</p>

    <h2>Why it matters</h2>
    <p>High public debt is not just a number. 
    It affects what governments can spend on services like healthcare, education, and infrastructure. 
    It also matters for the stability of the euro area: if a large country like Italy faces debt trouble, it could affect all of Europe. 
    That’s why the EU keeps close watch on these figures.</p>

    <h2>FAQ</h2>
    <h3>Which EU country has the highest debt in 2025?</h3>
    <p>Greece, with 152.5% of GDP.</p>

    <h3>Which country has the lowest debt?</h3>
    <p>Bulgaria, with just 23.9% of GDP.</p>

    <h3>What is the EU rule for debt?</h3>
    <p>The Stability and Growth Pact sets a limit of 60% of GDP. Most EU countries are above this level in 2025.</p>

    <h3>Has EU debt improved since COVID-19?</h3>
    <p>Yes, the EU average debt ratio has fallen from about 90% in 2020 to around 82% in 2025. 
    But progress is uneven, with some countries reducing debt fast and others still going up.</p>

    <p class="tag">Source: Eurostat (gov_10q_ggdebt, Q1 2025), European Commission.</p>
    `
  }, // <--- hier de KOMMA toegevoegd
  {
    slug: "why-debt-matters-interest-inflation",
    title: "Why government debt matters for rates and inflation",
    summary:
      "How public debt interacts with interest rates, inflation and fiscal stability—in plain language.",
    tags: ["Explainer"],
    date: "2025-09-03",
    lang: "en",
    body: `
<p>Public debt influences financial markets through the volume and maturity of issued bonds, expectations about deficits, and central bank conditions.</p>
<p>Higher debt can coincide with higher rates if investors demand compensation, but the relation depends on growth, credibility and monetary policy.</p>
<p class="tag">This article is educational, not financial advice.</p>
    `,
  },
];

// Helpers
export function listArticles({ lang } = {}) {
  let list = [...articles];
  if (lang) list = list.filter(a => a.lang === lang);
  // nieuwste eerst
  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug) {
  return articles.find(a => a.slug === slug) || null;
}
