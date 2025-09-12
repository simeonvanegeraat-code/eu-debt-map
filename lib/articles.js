// lib/articles.js
// Klein, file-based "CMS" voor artikelen.
//
// Velden per artikel:
// - slug (unique)
// - title
// - summary (korte samenvatting)
// - excerpt (zelfde als summary; gebruikt door sommige componenten)
// - tags[] (max 5 is prima)
// - date (YYYY-MM-DD)
// - lang ("en" | "nl" | "de" | "fr")
// - image (pad vanaf /public, bv. "/articles/voorbeeld.jpg")
// - imageAlt (alt-tekst voor de thumbnail)
// - body (HTML string)

export const articles = [
  {
    slug: "eu-debt-to-gdp-2025",
    title: "Debt-to-GDP Ratios of EU Countries in 2025",
    summary:
      "A full overview of government debt across all 27 EU countries in 2025, explained in simple terms with rankings, trends, and key insights.",
    excerpt:
      "A full overview of government debt across all 27 EU countries in 2025, explained in simple terms with rankings, trends, and key insights.",
    tags: ["EU", "Debt", "GDP", "Analysis"],
    date: "2025-09-07",
    lang: "en",
    image: "/articles/eu-gdp-2025.jpg",
    imageAlt: "EU countries ranked by debt-to-GDP in 2025",
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

    <div class="chart-layout">
      <div class="chart-table">
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
      </div>
      <div class="chart-image">
        <img
          src="/images/eu-debt-heatmap-2025.png"
          alt="EU countries ranked by debt-to-GDP ratio in Q1 2025"
          loading="lazy"
        />
        <p class="caption">Source: Eurostat (gov_10q_ggdebt, Q1 2025)</p>
      </div>
    </div>

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
    `,
  },
  {
    slug: "france-debt-2025",
    title: "France’s public debt in 2025: what the numbers tell us",
    summary:
      "A clear, student-friendly explainer of France’s debt and deficit in 2025, why politics matter, and what this means for Europe.",
    excerpt:
      "A clear, student-friendly explainer of France’s debt and deficit in 2025, why politics matter, and what this means for Europe.",
    tags: ["France", "Debt", "EU", "Analysis"],
    date: "2025-09-06",
    lang: "en",
    image: "/articles/france-debt-2025.jpg",
    imageAlt: "France public debt in 2025",
    body: `
    <h2>Key figures (simple overview)</h2>
    <ul>
      <li><strong>Total public debt:</strong> about <strong>€3.3 trillion</strong>.</li>
      <li><strong>Debt-to-GDP ratio:</strong> roughly <strong>114%</strong> (the debt is bigger than one year of the economy).</li>
      <li><strong>Budget deficit (2025):</strong> around <strong>5.8% of GDP</strong> (EU rule is 3%).</li>
      <li><strong>EU comparison:</strong> France’s debt ratio is among the highest in the EU (only Greece and Italy are higher). The euro area average is much lower.</li>
    </ul>

    <figure style="max-width:860px;margin:16px auto;">
      <img
        src="/images/france-debt-2025.png"
        alt="France’s public debt and deficit in 2025 (simple chart)"
        loading="lazy"
        decoding="async"
        style="width:100%;height:auto;display:block;border-radius:8px;"
      />
      <figcaption style="font-size:0.9rem;opacity:0.8;text-align:center;margin-top:6px;">
        Source: Eurostat / European Commission (latest quarterly data).
      </figcaption>
    </figure>

    <h2>What does “debt-to-GDP” mean?</h2>
    <p>It shows how big a country’s debt is compared to the size of its economy. If the ratio is 100%, the debt equals one year of everything the country produces. A higher number means a heavier debt burden.</p>

    <h2>Political context (why this is in the news)</h2>
    <ul>
      <li>The government announced a <strong>savings plan</strong> of about <strong>€44 billion</strong> to shrink the deficit.</li>
      <li>One proposal (very controversial) even suggested <strong>scrapping public holidays</strong> to boost output.</li>
      <li>Opposition parties threatened <strong>no-confidence votes</strong>, so the government’s position is fragile.</li>
      <li>Public support for cutting holidays is <strong>low</strong>, and protests underline how difficult budget reforms are.</li>
    </ul>

    <h2>Economic risks (in plain language)</h2>
    <ul>
      <li><strong>Rising interest costs:</strong> When rates go up, borrowing becomes more expensive. France already spends tens of billions per year on interest—money that can’t go to schools or hospitals.</li>
      <li><strong>Credit rating pressure:</strong> If rating agencies downgrade France, borrowing could become even more expensive.</li>
      <li><strong>Investor nerves:</strong> Political fights make it harder to pass reforms, which can worry markets.</li>
    </ul>

    <h2>Why this matters (for France and Europe)</h2>
    <ul>
      <li>France is the <strong>second-largest economy</strong> in the euro area. If France struggles, it can affect the whole region.</li>
      <li>EU fiscal rules say deficits should be <strong>below 3%</strong> and debt <strong>near 60%</strong>. France being far above those levels puts the <strong>credibility of the rules</strong> to the test.</li>
      <li>Higher French borrowing costs can push up <strong>borrowing costs in other countries</strong> too.</li>
    </ul>

    <h2>Trends &amp; what to watch</h2>
    <ul>
      <li><strong>Deficit path:</strong> Can France reduce the deficit toward 3% without hurting growth?</li>
      <li><strong>Reforms:</strong> Pension, spending control, and better tax collection are key—but politically hard.</li>
      <li><strong>New priorities:</strong> Defense, energy support, and climate investments make cutting the deficit tougher.</li>
    </ul>

    <h2>FAQ</h2>
    <h3>Why is France’s debt so high?</h3>
    <p>Because the government has run <strong>budget deficits for many years</strong>. Crises (like COVID-19) also pushed spending up. Interest costs and slow growth make it harder to bring debt down.</p>

    <h3>What is France’s debt-to-GDP in 2025?</h3>
    <p>About <strong>114%</strong>. That means the total debt is larger than one year of the economy.</p>

    <h3>How does France compare to Italy?</h3>
    <p>Italy’s debt ratio is <strong>even higher</strong> (around the upper-130s % of GDP). But France’s ratio is still far above the EU target.</p>

    <h3>Will France be downgraded by rating agencies?</h3>
    <p>It’s a <strong>risk</strong>. If deficits stay high and reforms stall, borrowing could get more expensive after a downgrade.</p>

    <p class="tag">Source: Eurostat (gov_10q_ggdebt), European Commission. This explainer uses the latest official figures available in 2025.</p>
  `,
  },
  {
    slug: "who-owns-eu-debt-2025",
    title: "Who owns EU government debt in 2025?",
    summary:
      "Easy-to-read explainer on who holds EU countries’ government bonds — domestic investors, other EU countries, non-EU investors, and the European Central Bank — and why it matters.",
    excerpt:
      "Easy-to-read explainer on who holds EU countries’ government bonds — domestic investors, other EU countries, non-EU investors, and the European Central Bank — and why it matters.",
    tags: ["EU debt ownership", "ECB", "Sovereign bonds", "Eurozone", "Debt", "Explainer"],
    date: "2025-09-12",
    lang: "en",
    image: "/articles/who-owns-eu-debt-2025.jpg", // <-- thumbnail path used by the cards
    imageAlt: "Thumbnail: Who owns EU government debt in 2025?",
    body: `
    <p class="tag">This article is written in simple language for students and general readers.</p>

    <h2>Why this topic matters</h2>
    <p>When a government borrows, it issues <strong>bonds</strong>. Investors then buy and hold these bonds. In the EU, the owners are usually a mix of <strong>domestic investors</strong> (banks, insurers, pension funds, households), <strong>other EU investors</strong>, <strong>non-EU investors</strong> (like US or UK funds), and the <strong>European Central Bank (ECB)</strong>. Knowing <em>who owns the debt</em> helps explain interest costs, risks, and why problems in one country can affect others.</p>

    <figure style="max-width:860px;margin:16px auto;">
      <img
        src="/images/chart-who-owns-eu-debt-2025.png"
        alt="Chart placeholder: Who owns EU government debt in 2025"
        loading="lazy"
        decoding="async"
        style="width:100%;height:auto;display:block;border-radius:10px;"
      />
      <figcaption style="font-size:0.9rem;opacity:0.8;text-align:center;margin-top:6px;">
        Replace with your infographic comparing domestic, EU, non-EU, and ECB holdings.
      </figcaption>
    </figure>

    <h2>The four main holders</h2>
    <ul>
      <li><strong>Domestic investors:</strong> local banks, insurers, pension funds, and sometimes households. In many countries they own a big share.</li>
      <li><strong>Other EU investors:</strong> neighbors often buy each other’s bonds (for example, French or German funds buying Italian or Spanish bonds).</li>
      <li><strong>Non-EU investors:</strong> global funds and central banks outside Europe (for example, in the US, UK, or Asia).</li>
      <li><strong>The ECB (Eurosystem):</strong> since 2015 the ECB bought a large amount of government bonds. It still holds a <em>significant</em> share today, though it is slowly letting that stock shrink.</li>
    </ul>

    <h2>Simple patterns across Europe</h2>
    <ul>
      <li><strong>Italy and Spain:</strong> more debt is held at home (by domestic investors and the national central bank). This is called “home bias”.</li>
      <li><strong>Germany, France, the Netherlands:</strong> a larger share is owned by foreign investors, including many outside the EU, because these bonds are seen as very safe and easy to trade.</li>
      <li><strong>Smaller markets (e.g., Baltics, Cyprus):</strong> often rely more on foreign holders because their local investor base is small.</li>
      <li><strong>ECB’s role:</strong> in several big countries the ECB still owns about a quarter to a third of government bonds.</li>
    </ul>

    <h2>Why EU countries buy each other’s debt</h2>
    <p>Inside the eurozone there is no currency risk, so buying a neighbor’s bonds is natural. Investors want to <strong>diversify</strong>, manage <strong>risk</strong>, and mix different <strong>yields</strong> (very safe German bonds with higher-yield Italian bonds). Rules for banks also make EU government bonds attractive.</p>

    <h2>Benefits and risks (kept simple)</h2>
    <ul>
      <li><strong>Benefit:</strong> a wider investor base can keep borrowing costs lower and markets more stable.</li>
      <li><strong>Risk of spillovers:</strong> if one country gets into trouble, others that hold its bonds can be hit too (<em>contagion</em>).</li>
      <li><strong>Bank–sovereign link:</strong> when domestic banks hold a lot of their own government’s bonds, stress can move back and forth between the state and the banks (the “doom loop”).</li>
      <li><strong>ECB cushion:</strong> ECB holdings can calm markets, but there are questions about how quickly those bonds can roll off without pushing yields up.</li>
    </ul>

    <h2>What changed since the euro crisis and COVID-19?</h2>
    <ul>
      <li><strong>Euro crisis (2010–2012):</strong> foreign investors cut exposure to stressed countries; domestic investors and the ECB took a bigger role.</li>
      <li><strong>COVID-19:</strong> the ECB bought many bonds to keep financing costs low. Foreign private investors’ share fell in some places and recovered later.</li>
      <li><strong>Now (2025):</strong> the ECB is letting its portfolio shrink slowly, and global investors are again important buyers—especially in core countries.</li>
    </ul>

    <h2>Why ownership matters for policy</h2>
    <p>Debt ownership shapes debates about <strong>EU fiscal rules</strong>, bank regulation, and ideas like <strong>joint EU bonds</strong>. Supporters say euro-wide bonds could spread risk and create a common “safe asset”. Critics worry about moral hazard. Either way, the fact that EU countries already own a lot of each other’s debt shows how <strong>interconnected</strong> the eurozone has become.</p>

    <h2>FAQ</h2>
    <h3>Who owns Italy’s debt?</h3>
    <p>Mostly <strong>domestic investors</strong> (banks, insurers, pension funds, households) and the <strong>ECB</strong>. A smaller share is held by foreign investors, including other EU countries.</p>

    <h3>Does Germany hold French bonds?</h3>
    <p>Yes. German investors hold French government bonds, and French investors hold German Bunds. Cross-holdings are common in the eurozone.</p>

    <h3>How much EU debt is owned by the ECB?</h3>
    <p>The ECB (via the Eurosystem) still holds a <strong>large</strong> share of euro-area government bonds. In many big countries this is roughly <strong>a quarter to a third</strong> of the total, but the share varies and is slowly declining.</p>

    <h3>Why do EU countries buy each other’s debt?</h3>
    <p>To diversify, manage risk, and access different yields. Within the euro area there is also no currency risk, which makes cross-border investing easier.</p>

    <p class="tag">Sources: European Central Bank (Securities Holdings Statistics, APP/PEPP updates), Eurostat (government finance), BIS. Summary based on official information available in 2025.</p>
  `
  }
];

// Helpers
export function listArticles({ lang } = {}) {
  let list = [...articles];
  if (lang) list = list.filter((a) => a.lang === lang);
  // nieuwste eerst
  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug) {
  return articles.find((a) => a.slug === slug) || null;
}
