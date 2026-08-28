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

function FlowNode({ number, label, detail, active }) {
  return (
    <div className={`${styles.flowNode} ${active ? styles.flowNodeActive : ""}`}>
      <span className={styles.flowNodeNumber}>{number}</span>
      <span className={styles.flowNodeLabel}>{label}</span>
      <span className={styles.flowNodeDetail}>{detail}</span>
    </div>
  );
}

export function DebtMechanismStory() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

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
        <p className={styles.eyebrow}>The borrowing cycle</p>
        <h2 id="story-title">How government debt works</h2>
        <p>
          Follow one euro of new borrowing from the budget gap to the outstanding debt stock.
          Scroll through the four stages; the diagram stays fixed while the mechanism changes.
        </p>
      </div>

      <div className={styles.storyGrid}>
        <div className={styles.storyCopy}>
          {STORY_STEPS.map((step, index) => (
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
              <span>One borrowing cycle</span>
              <span className={styles.visualStatus}>Stage {activeStep + 1} / 4</span>
            </div>

            <div className={styles.flowCanvas}>
              <FlowNode
                number="01"
                label="Public budget"
                detail="Revenue falls short"
                active={activeStep === 0}
              />
              <FlowNode
                number="02"
                label="Treasury"
                detail="Issues a bond"
                active={activeStep === 1}
              />
              <FlowNode
                number="03"
                label="Investors"
                detail="Provide cash"
                active={activeStep === 1 || activeStep === 2}
              />
              <FlowNode
                number="04"
                label="Future budgets"
                detail="Pay interest or refinance"
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
              {STORY_STEPS[activeStep].title}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatBillions(value) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);
}

export function DebtBuilder() {
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
        <p className={styles.eyebrow}>Interactive model</p>
        <h2 id="model-title">A deficit is a flow. Debt is the stock it leaves behind.</h2>
        <p>
          Move the controls to see how repeated annual deficits add to the outstanding debt balance.
          This simplified model excludes interest, growth, inflation, repayments and valuation changes.
        </p>

        <div className={styles.controls}>
          <label className={styles.control}>
            <span>
              Opening debt
              <strong>€{formatBillions(openingDebt)}bn</strong>
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
              Annual deficit
              <strong>€{formatBillions(annualDeficit)}bn / year</strong>
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
          Illustrative calculation, not a forecast. A surplus or repayment would reduce the stock instead.
        </p>
      </div>

      <div className={styles.modelVisual} role="img" aria-label={`Illustrative debt rises from ${openingDebt} billion euro to ${endDebt} billion euro after ten years`}>
        <div className={styles.modelSummary}>
          <div>
            <span>After 10 years</span>
            <strong>€{formatBillions(endDebt)}bn</strong>
          </div>
          <div>
            <span>Added debt</span>
            <strong className={styles.modelIncrease}>+€{formatBillions(increase)}bn</strong>
          </div>
        </div>

        <div className={styles.modelChart} aria-hidden="true">
          {series.map((value, year) => (
            <div className={styles.modelBarColumn} key={year}>
              <div
                className={styles.modelBar}
                style={{ height: `${Math.max(12, (value / maxValue) * 100)}%` }}
              />
              <span>{year === 0 ? "Now" : year === years ? "+10y" : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
