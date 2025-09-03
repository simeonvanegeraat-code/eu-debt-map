// app/debt/page.jsx
import Link from "next/link";
// bovenaan
import CTASidebar from "@/components/CTASidebar";

// … binnen de component, NA de main content:
<CTASidebar lang="en" homeHref="/" methodologyHref="/methodology" />


export const metadata = {
  title: "What is Government Debt? • EU Debt Map",
  description:
    "Simple explanation of government debt, why countries borrow, how debt-to-GDP works, and why it matters for people and the economy.",
  openGraph: {
    title: "What is Government Debt? • EU Debt Map",
    description:
      "Government debt explained in plain English with examples, FAQs, and links to official sources.",
    type: "article",
    url: "https://eudebtmap.com/debt",
    siteName: "EU Debt Map",
  },
  alternates: {
    canonical: "https://eudebtmap.com/debt",
    languages: {
      en: "https://eudebtmap.com/debt",
      nl: "https://eudebtmap.com/nl/debt",
      de: "https://eudebtmap.com/de/debt",
      fr: "https://eudebtmap.com/fr/debt",
      "x-default": "https://eudebtmap.com/debt",
    },
  },
};

export default function DebtExplainer() {
  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>What is Government Debt?</h2>
        <p>
          <strong>Government debt</strong> is the money a country owes. It’s similar to a
          family taking a mortgage to buy a house or a student loan for school:
          big costs are spread out over time.
        </p>

        <h3>Why do governments borrow?</h3>
        <ul>
          <li><strong>To build and invest:</strong> roads, schools, hospitals, clean energy.</li>
          <li><strong>To handle crises:</strong> disasters, recessions, pandemics.</li>
          <li><strong>To smooth timing:</strong> when tax income and spending don’t match.</li>
        </ul>

        <h3>How is debt measured?</h3>
        <p>
          Debt is shown in euros (€) and also as a share of the economy:
          the <strong>debt-to-GDP ratio</strong>.
        </p>
        <div
          className="tag"
          role="note"
          style={{ marginTop: 6, lineHeight: 1.5 }}
        >
          <strong>Example:</strong> If a country produces €1 trillion in a year (GDP) and
          owes €500 billion, the debt-to-GDP ratio is <strong>50%</strong>.
        </div>

        <h3>Why does debt matter?</h3>
        <ul>
          <li><strong>Interest costs:</strong> more debt means more money spent on interest.</li>
          <li>
            <strong>Policy room:</strong> high interest bills leave less for schools,
            healthcare, or tax cuts.
          </li>
          <li>
            <strong>Stability:</strong> in the EU, debt levels are monitored to keep
            economies healthy and stable.
          </li>
        </ul>

        <h3>FAQ</h3>
        <p><strong>Who do countries borrow from?</strong><br/>
          Mostly investors who buy government bonds: banks, pension funds, and sometimes
          other countries or institutions.
        </p>
        <p><strong>What is a “safe” level of debt?</strong><br/>
          There is no single magic number. The EU often uses <strong>60% of GDP</strong>
          as a guideline, but actual levels differ by country and over time.
        </p>
        <p><strong>Where can I see current debt figures?</strong><br/>
          Use the <Link href="/" className="btn" style={{ padding: "2px 8px" }}>EU map</Link> and click a country for a live estimate based on the latest reference dates.
        </p>

        <p className="tag" style={{ marginTop: 10 }}>
          Sources: Eurostat (government finance statistics) and national finance ministries.
        </p>
      </section>
    </main>
  );
}
