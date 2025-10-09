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
  slug: "digital-euro-2025-explainer",
  title: "The Digital Euro: Europe’s Leap Into the Future of Money",
  summary:
    "Student-friendly explainer of what the digital euro is, why the ECB wants it, how it could work, privacy questions, and what it means for people and banks.",
  excerpt:
    "Student-friendly explainer of what the digital euro is, why the ECB wants it, how it could work, privacy questions, and what it means for people and banks.",
  tags: ["ECB", "Digital euro", "CBDC", "Payments", "Explainer"],
  date: "2025-09-30",
  lang: "en",
  // Thumbnail shown on cards (put a file in /public/articles/)
  image: "/articles/digital-euro-2025.jpg",
  imageAlt: "Illustration: Digital euro (ECB) concept",
  body: `
    <h2>What is the digital euro?</h2>

    <!-- Figure floats right on desktop, full-width on mobile -->
    <figure
      style="
        float:right;
        width:100%;
        max-width:420px;
        margin:0 0 12px 16px;
      "
    >
      <img
        src="/images/digital-euro-concept-2025.png"
        alt="Digital euro concept: secure wallet and ECB-backed payments"
        loading="lazy"
        decoding="async"
        style="width:100%;height:auto;display:block;border-radius:10px;"
      />
      <figcaption style="font-size:0.9rem;opacity:0.8;text-align:center;margin-top:6px;">
        Rotterdam 
      </figcaption>
    </figure>

    <p>The digital euro would be a <strong>central bank digital currency (CBDC)</strong> — euro money issued by the <strong>European Central Bank (ECB)</strong>, but in digital form only.
    It would be as safe as cash because it is a <em>direct</em> claim on the central bank, not on a private bank.</p>
    <p>You could keep it in a <strong>digital wallet</strong> (inside your banking app or a new ECB-backed app) and use it to pay in stores or online.
    The ECB says it should work <strong>online and offline</strong>, so small payments would still be possible if the internet is down.</p>

    <div style="clear:both"></div>

    <h2>Why does Europe want it?</h2>
    <ul>
      <li><strong>Monetary sovereignty:</strong> make sure euro payments stay under European control as crypto, stablecoins and Big Tech systems grow.</li>
      <li><strong>Less dependence on non-EU networks:</strong> today, many cards and wallets run on non-European rails. A digital euro would be a European backbone.</li>
      <li><strong>Future-proof money:</strong> other big economies are testing CBDCs; the EU doesn’t want to fall behind.</li>
    </ul>

    <h2>How might it work?</h2>
    <p>Design plans point to a <strong>two-tier model</strong>: the ECB issues digital euros; <strong>private banks and payment firms</strong> provide wallets and customer support.
    This way, the ECB does not replace banks.</p>
    <p>Open questions the ECB and lawmakers still need to fix:</p>
    <ul>
      <li><strong>Holding limits:</strong> to stop people moving too much money out of bank deposits during a crisis.</li>
      <li><strong>Fees:</strong> will basic payments be free for users and shops?</li>
      <li><strong>Privacy rules:</strong> how to stop crime while protecting normal users’ data.</li>
    </ul>

    <h2>Privacy and trust</h2>
    <p>Cash is private; digital payments leave a trail. The ECB says a digital euro will offer <strong>strong privacy</strong>, especially for small offline payments.
    Civil-rights groups worry about <strong>surveillance</strong>. Too little privacy reduces trust; too much privacy could make it hard to fight fraud and money laundering.
    Finding the <strong>right balance</strong> is key.</p>

    <h2>What could it mean for citizens?</h2>
    <ul>
      <li><strong>Universal acceptance:</strong> like cash, usable across the euro area.</li>
      <li><strong>Financial inclusion:</strong> a simple wallet could help people without a bank account join digital payments.</li>
      <li><strong>Resilience:</strong> if a private network fails, a state-backed option keeps payments running.</li>
    </ul>
    <p><em>Trade-off:</em> if it is too attractive to hold digital euros, banks could lose deposits, which might raise loan costs.
    That is why holding limits and design choices matter.</p>

    <h2>The global race</h2>
    <p>Over 100 countries are exploring CBDCs. China’s digital yuan is far along. The Bahamas, Nigeria and Jamaica have already launched.
    Europe’s project is slower and careful, but it would be one of the <strong>largest CBDC pilots in the world</strong>.</p>

    <h2>Big open questions</h2>
    <ul>
      <li>Will it <strong>replace cash</strong> or only complement it? (Officials say cash will stay.)</li>
      <li>Will people <strong>trust</strong> a central-bank wallet as much as their bank’s app?</li>
      <li>Could governments set <strong>temporary limits</strong> in a crisis (for example, on very large transfers)?</li>
      <li>Could a successful digital euro <strong>boost the euro’s global role</strong> in trade and finance?</li>
    </ul>

    <h2>Bottom line</h2>
    <p>The digital euro could make payments <strong>faster, safer and more inclusive</strong>, and strengthen Europe’s independence.
    But it also raises hard questions about privacy and the role of banks.
    The choices Europe makes now will decide whether the digital euro becomes a trusted everyday tool or a controversial experiment.</p>

    <p class="tag">Note: This explainer summarizes the public discussion around the ECB’s digital euro project as of 2025. It is educational content, not legal or financial advice.</p>
  `
},

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
          <thead>
            <tr><th>Country</th><th>Debt-to-GDP (%)</th><th>Change vs end-2024</th></tr>
          </thead>
          <tbody>
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
          </tbody>
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
    image: "/articles/owns-eu-debt-2025.jpg",
    imageAlt: "Thumbnail: Who owns EU government debt in 2025?",
    body: `
    <p class="tag">This article is written in simple language for students and general readers.</p>

    <div class="clearfix">
      <figure class="figure figure--right">
        <img
          src="/images/chart-who-owns-eu-debt-2025.png"
          alt="Chart: Who owns EU government debt in 2025"
          loading="lazy"
          decoding="async"
        />
        <figcaption></figcaption>
      </figure>

      <h2>Why this topic matters</h2>
      <p>When a government borrows, it issues <strong>bonds</strong>. Investors then buy and hold these bonds. In the EU, the owners are usually a mix of <strong>domestic investors</strong> (banks, insurers, pension funds, households), <strong>other EU investors</strong>, <strong>non-EU investors</strong> (like US or UK funds), and the <strong>European Central Bank (ECB)</strong>. Knowing <em>who owns the debt</em> helps explain interest costs, risks, and why problems in one country can affect others.</p>
    </div>

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
    `,
  },

  {
    slug: "eu-interest-vs-education-health-2025",
    title: "EU debt interest vs schools and hospitals: 2025 explained",
    summary:
      "An easy explainer comparing how much EU countries spend on debt interest versus education and healthcare in 2025.",
    excerpt:
      "An easy explainer comparing how much EU countries spend on debt interest versus education and healthcare in 2025.",
    tags: ["EU", "Debt", "Education", "Healthcare", "Analysis"],
    date: "2025-09-14",
    lang: "en",
    image: "/articles/eu-interest-vs-education-health-2025.jpg",
    imageAlt: "Thumbnail: EU interest payments compared with education and health spending",
    body: `
    <p class="tag">This article is written in simple language so students and general readers can follow.</p>

    <h2>What this article shows</h2>
    <p>In 2025, many EU governments spend a lot of money paying <strong>interest</strong> on their public debt.
    But they also spend huge amounts on <strong>schools</strong> and <strong>hospitals</strong>.
    This article compares those three areas — interest, education, and healthcare — to see which countries spend more on debt and which invest more in people.</p>

    <h2>Per-country breakdown (latest data)</h2>
    <p>The table below shows spending in billions of euros and per person. Data are mostly from 2024, because 2025 figures are not fully available yet.</p>

    <figure style="max-width:1000px;margin:16px auto;">
      <img
        src="/images/chart-interest-vs-education-health-2025.png"
        alt="Chart: EU countries, debt interest vs education and healthcare spending"
        loading="lazy"
        decoding="async"
        style="width:100%;height:auto;display:block;border-radius:10px;"
      />
      <figcaption style="font-size:0.9rem;opacity:0.8;text-align:center;margin-top:6px;">
        Source: Eurostat, European Commission (general government spending data, 2024).
      </figcaption>
    </figure>

    <h2>Top 3 countries by interest burden (per person)</h2>
    <ul>
      <li><strong>Italy:</strong> About €1,440 per person. Italy spent ~€85 billion on interest in 2024, nearly the same as on all education nationwide.</li>
      <li><strong>Belgium:</strong> Around €1,200 per person. Belgium’s interest bill is rising because of high debt and higher rates.</li>
      <li><strong>France:</strong> About €870 per person. France paid ~€59 billion in 2024. The national auditor warns it could pass €100 billion a year by 2029.</li>
    </ul>
    <p><em>Note:</em> Ireland also pays close to €900 per person, but total interest spending is smaller.</p>

    <h2>Where interest eats into social spending</h2>
    <p>In some high-debt countries, debt service takes away money that could go to schools or hospitals:</p>
    <ul>
      <li><strong>Italy:</strong> Interest (~€85 bn) was slightly higher than the education budget (~€80 bn). This is rare in Europe.</li>
      <li><strong>Greece:</strong> Interest (~€7 bn) is close to education (~€8 bn) and healthcare (~€10 bn). It used to be worse but is now slowly improving.</li>
      <li><strong>Portugal:</strong> Interest (~€7 bn) is about half of the education budget and ~40% of the health budget. Debt is still over 110% of GDP.</li>
    </ul>

    <h2>Countries that invest more in people</h2>
    <p>Other EU countries spend far more on social services than on debt:</p>
    <ul>
      <li><strong>Nordic countries:</strong> Sweden, Denmark, and Finland spend many times more on schools and hospitals than on debt. Sweden spends ~14% of its budget on education and 19% on health, but less than 1% on interest.</li>
      <li><strong>Germany:</strong> Health (~€436 bn) is nearly 20× its interest bill (~€25 bn). Education is almost 8× interest costs.</li>
      <li><strong>Luxembourg:</strong> Very low debt, very high spending on people. Over €10,000 per person goes to health and education combined, while interest is tiny.</li>
    </ul>

    <h2>FAQ</h2>
    <h3>Does Italy spend more on debt interest than on education?</h3>
    <p>Yes, almost. In 2024 Italy spent about €85 bn on interest and €80 bn on education — interest was slightly higher.</p>

    <h3>Do any EU countries spend more on interest than on healthcare?</h3>
    <p>No. Even in Italy and Greece, health spending is still larger than interest. But in those countries, interest is two-thirds or more of the health budget.</p>

    <h3>Which EU country has the biggest interest burden?</h3>
    <p>Italy. Its interest costs are about 3.9% of GDP — the highest in the EU. Greece follows at around 3%.</p>

    <h3>Who benefits from low interest burdens?</h3>
    <p>Citizens in countries like Sweden, Denmark, Germany, and Luxembourg. These countries spend most of their tax money on hospitals, schools, and services, not on debt.</p>

    <p class="tag">Sources: Eurostat COFOG (government expenditure by function), European Commission, IMF, Reuters, DBRS. Figures mostly for 2024, shown in euros per person where possible.</p>
    `,
  },

  /* =========================
     NEW: NYT-style feature
     ========================= */
  {
    slug: "france-debt-to-gdp-crisis-2025-nyt",
    title: "The Silent Bomb Beneath Europe: France’s Debt Spiral and the Coming Reckoning for the Euro",
    summary:
      "A New York Times–style feature on debt-to-GDP, creative accounting, inflation risk, and why France’s rising debt could shake the euro.",
    excerpt:
      "A New York Times–style feature on debt-to-GDP, creative accounting, inflation risk, and why France’s rising debt could shake the euro.",
    tags: ["France", "Debt-to-GDP", "Eurozone", "Inflation", "Feature"],
    date: "2025-10-10",
    lang: "en",
    image: "/articles/france-debt-spiral-2025.jpg",
    imageAlt: "Paris skyline with euro symbol overlay, signaling debt stress",
    body: `
    <p><em>Paris, October 2025</em></p>
    <p>For years, Europe has been living beside a silent fuse. It cannot be heard in the cafés of Paris or the markets of Marseille, yet it hums beneath every government balance sheet and Eurostat spreadsheet. Public debt keeps rising, faster than growth, faster than wages, faster than reason.</p>
    <p>Nowhere is that rhythm louder than in France, the beating heart of continental Europe and increasingly its most fragile link. France’s debt-to-GDP ratio, once a manageable figure, now hovers around 115 percent. Economists call it unsustainable. Markets call it dangerous. The French government prefers the word <em>temporary</em>. Temporary debts have a way of becoming permanent, and permanent debts have a way of becoming existential.</p>

    <h2>The metric that rules nations</h2>
    <p>Debt-to-GDP is a simple fraction that measures how much a country owes compared with what it produces in a year. When the ratio rises too high, symptoms appear: borrowing costs increase, interest payments devour tax revenue, and investors begin to ask the question no finance minister wants to hear: <em>Can this country still pay its bills?</em> Bound to the euro, France cannot print its way out of trouble. Its debt is effectively foreign, and its promise to repay depends on trust. Trust, in the world of finance, is scarcer than money.</p>

    <h2>The art of creative accounting</h2>
    <p>On paper, the European Union enforces discipline: deficits below 3 percent and debt under 60 percent of GDP. In practice, those rules have encouraged ingenuity. Governments learned to move liabilities off their balance sheets, classify spending as investment, postpone payments, or label expenses as one-time relief measures. Each maneuver is legal. Each makes the books look better than reality. France has become especially skilled at this quiet arithmetic. Every year, the numbers appear healthier than they truly are, and every year the markets believe them a little less.</p>
    <p>The danger lies not only in the manipulation but in the erosion of credibility. When investors stop trusting the numbers, they demand higher returns, which increase borrowing costs and deepen the problem. Once confidence falters, no speech or reform can restore it quickly enough.</p>

    <h2>Lessons from a Greek tragedy</h2>
    <p>Europe has seen this story before. In 2010, Greece’s creative bookkeeping detonated into a full-scale crisis. Bond yields soared, bailouts followed, and a generation learned the word <em>austerity</em>. France is not Greece; its economy is larger and its institutions stronger. But the warning remains the same: truth delayed is disaster deferred. The denial that doomed Athens now echoes in Paris, and the European Central Bank may not have the political appetite to rescue everyone at once.</p>

    <h2>Inflation, the hidden predator</h2>
    <p>Inflation once seemed a relic of the 1970s. Then came a pandemic, energy shocks and war. Prices surged, central banks tightened, and the era of easy money ended abruptly. For countries heavy with debt, that change was seismic. When inflation rises, interest rates follow, and debt service costs explode. France already spends more on interest than on its military. Analysts warn that the burden could reach one hundred billion euros a year before the decade is out.</p>
    <p>Inflation also reshapes expectations. Savings lose value, contracts become unstable, and lenders demand higher returns. A temporary rise in prices can spiral into distrust, capital flight and, in extreme cases, hyperinflation. When inflation takes hold in a high-debt country, even mild fiscal slippage can trigger panic. Bondholders sell, borrowing costs spike, and central banks are trapped between saving economies or saving the currency.</p>

    <h2>France’s political paralysis</h2>
    <p>In 2025, France’s political system is adrift. The prime minister resigned after only a few weeks. Parliament is divided and reform has become a forbidden word. The Cour des Comptes warns the country would be dangerously exposed if growth slows. Yet the latest budget keeps the deficit well above the European limit. Officials insist that growth will rebound and debt will stabilize. The charts disagree. Ratings have been cut, bond yields rose and the euro slipped. Investors whisper a word Europe hoped never to hear again: contagion.</p>

    <h2>The euro’s uncomfortable truth</h2>
    <p>The eurozone was built on the promise that discipline in one country would ensure stability for all. That promise was never fully kept. Now the European Central Bank faces an impossible choice. Raise rates to fight inflation and risk pushing France and Italy toward crisis, or keep them low to protect those economies and risk eroding faith in the currency. As France’s deficit widens, some investors ask the once-unthinkable: what happens if the euro itself loses credibility?</p>

    <h2>The domino effect</h2>
    <p>A French stumble would not remain a French problem. Rising bond spreads between Paris and Berlin would send investors running for safety. Spain, Portugal and Italy would see borrowing costs surge. Emergency bond-buying could follow, but political backlash from the north would be immediate. Populist parties would call the euro a trap and sovereignty the only escape. The result could be not only financial turmoil but a political rupture, beginning at Europe’s core.</p>

    <h2>The psychology of denial</h2>
    <p>Societies rarely confront debt until it becomes unavoidable. Debt accumulates quietly, without sirens. Each year brings new exceptions until the numbers no longer fit the page. In France, debate centers on who should pay more, not whether the state should spend less. After years of inflation and reform fatigue, voters have lost patience. Complacency replaces caution. That is how crises begin.</p>

    <h2>Europe’s nightmare scenario</h2>
    <p>Energy prices jump after a geopolitical shock. Growth stalls, inflation returns and the central bank hesitates. France’s borrowing costs climb. Investors dump long-term bonds. Downgrades follow and the euro slides. Europe faces a choice: rescue France or defend the currency. Emergency intervention sparks legal challenges and political fury. Protests fill the streets. Credit tightens. The quiet ticking beneath Europe’s economy becomes a roar.</p>

    <h2>Why this matters to everyone</h2>
    <p>The eurozone is a single organism. If confidence in French debt erodes, confidence in European debt as a whole can follow. Foreign investors retreat, the currency weakens and import prices rise, feeding inflation even in disciplined economies. Euroskeptic movements surge, claiming vindication. The euro, designed to unify Europe through stability, risks dividing it through excess.</p>

    <h2>A narrow path forward</h2>
    <p>France still possesses enormous wealth and talent. The path to safety exists but narrows each year. Three steps are urgent: publish fully transparent budgets and end off-balance-sheet accounting; limit annual spending growth to real economic growth; rebuild credibility in Brussels by meeting fiscal rules honestly, not cosmetically. If France takes that road, it could restore confidence in itself and the eurozone. If it does not, the next European crisis will begin at the continent’s core.</p>

    <h2>The clock is ticking</h2>
    <p>History does not repeat, but it rhymes. Europe ignored warnings before Greece collapsed and spent a decade paying the price. It faces the same test again, on a grander scale. When debt grows faster than output, when accounting replaces honesty and when inflation stirs, mathematics wins. France’s numbers no longer add up. If that reality remains unspoken, the next crisis will be the most predictable disaster in modern European history.</p>

    <p class="tag">Editor’s note: This feature is an opinionated analysis written in clear, accessible language, inspired by the narrative tone of major international newspapers.</p>
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
