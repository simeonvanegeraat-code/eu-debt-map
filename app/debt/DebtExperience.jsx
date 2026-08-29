"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./debt.module.css";

const STORY_STEPS = [
  {
    kicker: "01 — The gap",
    title: "Spending exceeds revenue",
    text: "A deficit appears when government expenditure is higher than government revenue during a budget period. That deficit is a flow: it is measured over time.",
  },
  {
    kicker: "02 — The bond",
    title: "The government borrows",
    text: "The treasury raises money by issuing debt securities or taking loans. Investors provide cash now in exchange for a promise of future repayment and interest.",
  },
  {
    kicker: "03 — The cost",
    title: "Interest enters the budget",
    text: "Interest payments become part of future government expenditure. The cost depends on the amount borrowed, the maturity of the debt and the yields investors demand.",
  },
  {
    kicker: "04 — The stock",
    title: "Deficits accumulate as debt",
    text: "Outstanding borrowing remains on the balance sheet until it is repaid. Maturing bonds are often refinanced, so debt can persist even when an individual bond disappears.",
  },
];

const DEFAULT_STORY_COPY = {
  eyebrow: "The borrowing cycle",
  title: "How government debt works",
  intro: "Follow one euro of new borrowing from the budget gap to the outstanding debt stock. Scroll through the four stages; the diagram stays fixed while the mechanism changes.",
  cycleLabel: "One borrowing cycle",
  stageLabel: "Stage",
  steps: STORY_STEPS,
  nodes: [
    { label: "Public budget", detail: "Revenue falls short" },
    { label: "Treasury", detail: "Issues a bond" },
    { label: "Investors", detail: "Provide cash" },
    { label: "Future budgets", detail: "Pay interest or refinance" },
  ],
};

const DEFAULT_BUILDER_COPY = {
  eyebrow: "Interactive model",
  title: "A deficit is a flow. Debt is the stock it leaves behind.",
  intro: "Move the controls to see how repeated annual deficits add to the outstanding debt balance. This simplified model excludes interest, growth, inflation, repayments and valuation changes.",
  openingDebt: "Opening debt",
  annualDeficit: "Annual deficit",
  billions: "bn",
  perYear: "/ year",
  note: "Illustrative calculation, not a forecast. A surplus or repayment would reduce the stock instead.",
  afterYears: "After 10 years",
  addedDebt: "Added debt",
  now: "Now",
  tenYears: "+10y",
  chartAria: "Illustrative debt rises from {opening} billion euro to {end} billion euro after ten years",
};

function FlowNode({ number, label, detail, active }) {
  return (
    <div className={`${styles.flowNode} ${active ? styles.flowNodeActive : ""}`}>
      <span className={styles.flowNodeNumber}>{number}</span>
      <span className={styles.flowNodeLabel}>{label}</span>
      <span className={styles.flowNodeDetail}>{detail}</span>
    </div>
  );
}

export function DebtMechanismStory({ copy = DEFAULT_STORY_COPY }) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);
  const storySteps = copy.steps || STORY_STEPS;

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean);
    if (!nodes.length || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveStep(Number(visible.target.dataset.storyStep));
      },
      { rootMargin: "-32% 0px -42% 0px", threshold: [0.15, 0.4, 0.7] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.storySection} id="how-government-debt-works" aria-labelledby="story-title">
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id="story-title">{copy.title}</h2>
        <p>{copy.intro}</p>
      </div>

      <div className={styles.storyGrid}>
        <div className={styles.storyCopy}>
          {storySteps.map((step, index) => (
            <article
              className={`${styles.storyStep} ${activeStep === index ? styles.storyStepActive : ""}`}
              data-story-step={index}
              key={step.title}
              ref={(node) => {
                stepRefs.current[index] = node;
              }}
            >
              <p className={styles.storyKicker}>{step.kicker}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>

        <div className={styles.storyVisualColumn}>
          <div className={styles.storyVisual} data-stage={activeStep} aria-live="polite">
            <div className={styles.visualHeader}>
              <span>{copy.cycleLabel}</span>
              <span className={styles.visualStatus}>{copy.stageLabel} {activeStep + 1} / {storySteps.length}</span>
            </div>

            <div className={styles.flowCanvas}>
              <FlowNode
                number="01"
                label={copy.nodes[0].label}
                detail={copy.nodes[0].detail}
                active={activeStep === 0}
              />
              <FlowNode
                number="02"
                label={copy.nodes[1].label}
                detail={copy.nodes[1].detail}
                active={activeStep === 1}
              />
              <FlowNode
                number="03"
                label={copy.nodes[2].label}
                detail={copy.nodes[2].detail}
                active={activeStep === 1 || activeStep === 2}
              />
              <FlowNode
                number="04"
                label={copy.nodes[3].label}
                detail={copy.nodes[3].detail}
                active={activeStep >= 2}
              />

              <svg className={styles.flowLines} viewBox="0 0 600 360" aria-hidden="true">
                <path className={activeStep >= 0 ? styles.flowLineActive : ""} d="M160 92 C250 92 250 92 300 92" />
                <path className={activeStep >= 1 ? styles.flowLineActive : ""} d="M440 92 C520 92 520 180 440 180" />
                <path className={activeStep >= 2 ? styles.flowLineActive : ""} d="M300 268 C250 268 250 268 160 268" />
                <path className={activeStep >= 3 ? styles.flowLineActive : ""} d="M92 220 C92 170 92 150 92 140" />
              </svg>

              <div className={styles.flowPulse} aria-hidden="true" />
            </div>

            <div className={styles.visualFooter}>
              <span className={styles.legendDot} />
              {storySteps[activeStep].title}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatBillions(value, locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

export function DebtBuilder({ copy = DEFAULT_BUILDER_COPY, locale = "en-GB" }) {
  const [openingDebt, setOpeningDebt] = useState(800);
  const [annualDeficit, setAnnualDeficit] = useState(30);
  const years = 10;

  const series = useMemo(
    () => Array.from({ length: years + 1 }, (_, year) => openingDebt + annualDeficit * year),
    [openingDebt, annualDeficit]
  );
  const endDebt = series.at(-1);
  const increase = endDebt - openingDebt;
  const maxValue = Math.max(...series, 1);

  return (
    <section className={styles.modelSection} id="debt-vs-deficit" aria-labelledby="model-title">
      <div className={styles.modelCopy}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id="model-title">{copy.title}</h2>
        <p>{copy.intro}</p>

        <div className={styles.controls}>
          <label className={styles.control}>
            <span>
              {copy.openingDebt}
              <strong>€{formatBillions(openingDebt, locale)} {copy.billions}</strong>
            </span>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={openingDebt}
              onChange={(event) => setOpeningDebt(Number(event.target.value))}
            />
          </label>

          <label className={styles.control}>
            <span>
              {copy.annualDeficit}
              <strong>€{formatBillions(annualDeficit, locale)} {copy.billions} {copy.perYear}</strong>
            </span>
            <input
              type="range"
              min="0"
              max="150"
              step="5"
              value={annualDeficit}
              onChange={(event) => setAnnualDeficit(Number(event.target.value))}
            />
          </label>
        </div>

        <p className={styles.modelNote}>
          {copy.note}
        </p>
      </div>

      <div
        className={styles.modelVisual}
        role="img"
        aria-label={copy.chartAria
          .replace("{opening}", String(openingDebt))
          .replace("{end}", String(endDebt))}
      >
        <div className={styles.modelSummary}>
          <div>
            <span>{copy.afterYears}</span>
            <strong>€{formatBillions(endDebt, locale)} {copy.billions}</strong>
          </div>
          <div>
            <span>{copy.addedDebt}</span>
            <strong className={styles.modelIncrease}>+€{formatBillions(increase, locale)} {copy.billions}</strong>
          </div>
        </div>

        <div className={styles.modelChart} aria-hidden="true">
          {series.map((value, year) => (
            <div className={styles.modelBarColumn} key={year}>
              <div
                className={styles.modelBar}
                style={{ height: `${Math.max(12, (value / maxValue) * 100)}%` }}
              />
              <span>{year === 0 ? copy.now : year === years ? copy.tenYears : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
