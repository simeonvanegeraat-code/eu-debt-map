const COPY = {
  en: {
    locale: "en-GB",
    previewLabel: "Methodology design study · isolated preview",
    currentPage: "View current page",
    eyebrow: "Data provenance · Calculation · Limitations",
    title: "From Eurostat data to live EU debt estimates.",
    lede:
      "EU Debt Map separates published facts from modelled movement. This page shows every important step—from the original quarterly observation to the number moving on screen.",
    heroAction: "Follow the data",
    heroNote: "Method version 2.0 · reviewed 30 August 2026",
    sourcePanel: "The data lineage",
    sourceSteps: [
      ["01", "Eurostat", "Official quarterly observations"],
      ["02", "Validation", "Coverage, dates and values checked"],
      ["03", "Snapshot", "Last-known-good data stored locally"],
      ["04", "Model", "Quarterly movement expressed per second"],
      ["05", "Display", "Official and estimated values labelled separately"],
    ],
    navLabel: "Methodology",
    nav: ["Overview", "Definition", "Pipeline", "Calculation", "Safeguards", "Limits", "Sources"],
    overview: {
      eyebrow: "01 — The short answer",
      title: "One official number. One clearly labelled model.",
      intro:
        "The debt stock and debt-to-GDP ratio come from Eurostat. The live counter does not. EU Debt Map extends the change between the two latest official quarters at a constant pace so the scale and direction remain visible between releases.",
      officialLabel: "Official observation",
      officialTitle: "Published by Eurostat",
      officialText:
        "A dated quarterly stock of consolidated general government gross debt, plus Eurostat’s official percentage-of-GDP series.",
      modelLabel: "Modelled estimate",
      modelTitle: "Calculated by EU Debt Map",
      modelText:
        "A linear continuation of the latest observed quarterly movement. It is an educational display—not an official statistic or forecast.",
      ruleLabel: "The rule that governs the whole site",
      rule: "If a number moves every second, it is modelled. If it is official, it carries a Eurostat reference period.",
    },
    definition: {
      eyebrow: "02 — What is being measured",
      title: "The debt measure is narrower—and more precise—than ‘everything a government owes’.",
      intro:
        "EU Debt Map uses Maastricht debt: consolidated gross debt at nominal value for the general government sector at the end of each quarter.",
      includedTitle: "Included in Maastricht debt",
      included: [
        ["AF.2", "Currency and deposits"],
        ["AF.3", "Debt securities"],
        ["AF.4", "Loans"],
      ],
      coverageTitle: "General government means",
      coverage: ["Central government", "State government where applicable", "Local government", "Social security funds"],
      excludedTitle: "Do not read it as",
      excluded: [
        "Net debt after subtracting government assets",
        "A complete measure of future pensions or other contingent obligations",
        "The budget deficit, which is a flow rather than a stock",
        "A real-time government accounting balance",
      ],
      sourceLink: "Read Eurostat’s complete reference metadata",
    },
    pipeline: {
      eyebrow: "03 — Source to screen",
      title: "A reproducible chain, with no live API dependency during normal builds.",
      intro:
        "The source is remote; the production experience is deliberately stable. New observations are fetched in a controlled update, validated, and written to local snapshots before a deployment can use them.",
      steps: [
        ["Fetch", "Request gov_10q_ggdebt for all EU-27 countries in MIO_EUR and PC_GDP."],
        ["Normalize", "Map Eurostat’s EL code to GR and convert million-euro values into euros."],
        ["Validate", "Reject missing countries, invalid periods and values that disagree with the stored history."],
        ["Preserve", "If a country is absent from a valid update, retain its last-known-good official observation."],
        ["Publish", "Advance the shared EU-27 period only after all 27 countries are available for that quarter."],
      ],
      statusLabel: "Current validated snapshot",
      dataGenerated: "Debt data fetched",
      ratioGenerated: "Ratio data fetched",
      coverage: "Shared-period coverage",
      period: "Reference period",
    },
    calculation: {
      eyebrow: "04 — The model",
      title: "The counter converts one quarterly change into a constant per-second pace.",
      intro:
        "No growth, interest-rate or policy assumption is added. The model only spreads the most recent observed change across time and continues that pace after the latest quarter-end.",
      rateLabel: "Modelled rate",
      rateFormula: "(latest official debt − previous official debt) ÷ seconds between both dates",
      estimateLabel: "Estimate after the latest reference date",
      estimateFormula: "latest official debt + rate × seconds elapsed since the latest date",
      exampleEyebrow: "Worked example · current German snapshot",
      previous: "Previous official debt",
      latest: "Latest official debt",
      movement: "Quarterly movement",
      elapsed: "Time between anchors",
      pace: "Modelled pace",
      exampleNote:
        "Rounded display values may not reproduce the exact rate. The calculation uses the full stored euro amounts and UTC quarter-end timestamps.",
      ratioTitle: "How the live debt-to-GDP estimate works",
      ratioText:
        "Eurostat’s published ratio is the official starting point. The optional live view scales that ratio by the change in the modelled debt total while holding the implied GDP denominator constant.",
      ratioFormula: "official ratio × (modelled debt now ÷ official debt at the reference date)",
      ratioWarning: "That makes it an estimate of the ratio—not a live GDP measurement and not a forecast.",
    },
    safeguards: {
      eyebrow: "05 — Guardrails",
      title: "The model is allowed to stop before it is allowed to mislead.",
      intro:
        "Quarterly data can be delayed, revised or incomplete. Conservative rules keep an unusual source response from becoming a runaway counter.",
      cards: [
        ["€50,000/s hard cap", "Any calculated country pace is constrained between −€50,000 and +€50,000 per second."],
        ["Stale-country freeze", "A country more than one shared quarter behind is still shown at its last official value, but its ticker is frozen."],
        ["Missing-history fallback", "Without two usable observations, movement defaults to zero until a valid comparison exists."],
        ["Period consistency", "Quarter labels are converted to UTC quarter-end dates before elapsed time is calculated."],
        ["Shared EU period", "The EU-27 history advances only with complete 27-country coverage, preventing false total comparisons."],
        ["No silent substitution", "Official debt and official debt-to-GDP remain separate series; a missing ratio is not invented from another source."],
      ],
    },
    limitations: {
      eyebrow: "06 — Read the estimate responsibly",
      title: "Precision on screen is not precision in the underlying economy.",
      intro:
        "The counter is useful for scale, direction and comparison. It cannot reveal what happened on a particular day or predict the next official observation.",
      items: [
        ["Debt does not move smoothly", "Governments issue, redeem and revalue debt in discrete transactions. A linear ticker is a visual model."],
        ["Euro values can include exchange-rate movement", "For non-euro countries, Eurostat converts debt using the exchange rate at the last working day of the quarter."],
        ["Official histories can be revised", "National authorities and Eurostat may revise earlier quarters after new information, corrections or methodological changes."],
        ["Gross debt is not fiscal health", "Assets, interest costs, maturity, deficits, growth and currency structure also matter."],
        ["Country releases need not arrive together", "A country can temporarily retain an older official quarter while newer shared data are incomplete."],
        ["The model is not advice", "EU Debt Map is an independent educational visualization, not official reporting, forecasting or investment guidance."],
      ],
    },
    updates: {
      eyebrow: "07 — Freshness and corrections",
      title: "Every displayed update should be traceable to a source date and a method version.",
      intro:
        "Eurostat normally publishes quarterly government debt after national reporting and validation. Revisions can also arrive between regular releases.",
      cards: [
        ["Official cadence", "Quarterly; Member States transmit data within roughly three months after quarter-end."],
        ["Site refresh", "A controlled data update, validation and deployment—not an automatic browser-side API request."],
        ["Corrections", "A corrected official observation replaces the stored value after it passes the same validation checks."],
      ],
      changelogTitle: "Method record",
      changelog: [
        ["Version 2.0", "30 Aug 2026", "Adds live-ratio logic, stale-data freezes, exact guardrails, revisions and foreign-exchange limitations."],
        ["1.2", "Jul 2026", "Documents validated snapshots, official ratios and last-known-good country updates."],
      ],
    },
    sources: {
      eyebrow: "08 — Audit the method",
      title: "Original source, exact filters and a citation you can reuse.",
      intro:
        "The short explanation stays readable; the technical record remains one click away for researchers and developers.",
      sourceCards: [
        ["Primary dataset", "Eurostat · gov_10q_ggdebt", "Quarterly general government gross debt"],
        ["Debt unit", "MIO_EUR", "Converted to euros by multiplying by 1,000,000"],
        ["Official ratio unit", "PC_GDP", "Stored directly from Eurostat’s percentage-of-GDP observation"],
        ["Filters", "Q · S13 · GD · EU-27", "Quarterly · general government · gross debt"],
      ],
      detailsTitle: "Technical query and pseudocode",
      citationTitle: "Suggested citation",
      citation:
        "EU Debt Map (2026), ‘Methodology: Eurostat data and live government debt estimates’, based on Eurostat gov_10q_ggdebt. Accessed 30 August 2026.",
      copyHint: "Use the original Eurostat source alongside EU Debt Map when reusing the figures.",
      primary: "Eurostat reference metadata",
      dataset: "Open the Eurostat dataset",
      api: "Open the source API",
      nextTitle: "Continue with the data",
      next: [
        ["Open the EU-27 map", "/"],
        ["Compare debt-to-GDP", "/debt-to-gdp"],
        ["Read the debt explainer", "/debt"],
        ["View the fiscal rules", "/stability-and-growth-pact"],
      ],
    },
  },
};

export function getMethodologyCopy(lang = "en") {
  return COPY[lang] || COPY.en;
}
