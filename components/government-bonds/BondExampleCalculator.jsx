"use client";

import { useMemo, useState } from "react";
import calculatorCore from "@/lib/governmentBondCalculatorCore.cjs";
import styles from "./government-bond-guide.module.css";

const { calculateBondExample } = calculatorCore;

const moneyFormatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("nl-NL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function NumericField({ id, label, value, onChange, min, max, step, suffix }) {
  return (
    <label className={styles.calculatorField} htmlFor={id}>
      <span>{label}</span>
      <span className={styles.inputShell}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <b aria-hidden="true">{suffix}</b>
      </span>
    </label>
  );
}

export default function BondExampleCalculator() {
  const [faceValue, setFaceValue] = useState("1000");
  const [pricePercent, setPricePercent] = useState("97");
  const [couponPercent, setCouponPercent] = useState("2.5");
  const [years, setYears] = useState("5");

  const result = useMemo(
    () =>
      calculateBondExample({
        faceValue,
        pricePercent,
        couponPercent,
        years,
      }),
    [faceValue, pricePercent, couponPercent, years]
  );

  return (
    <section
      className={styles.calculator}
      id="rekenvoorbeeld"
      aria-labelledby="calculator-title"
    >
      <div className={styles.calculatorIntro}>
        <p className={styles.eyebrow}>Zelf rekenen · fictief voorbeeld</p>
        <h2 id="calculator-title">Coupon is niet hetzelfde als rendement.</h2>
        <p>
          Vul een nominale waarde, koers, coupon en resterende looptijd in. De
          uitkomst laat zien hoe de aankoopkoers het indicatieve rendement tot
          aflossing verandert.
        </p>
      </div>

      <div className={styles.calculatorPanel}>
        <div className={styles.calculatorInputs}>
          <NumericField
            id="bond-face-value"
            label="Nominale waarde"
            value={faceValue}
            onChange={setFaceValue}
            min="100"
            max="1000000"
            step="100"
            suffix="€"
          />
          <NumericField
            id="bond-market-price"
            label="Koers"
            value={pricePercent}
            onChange={setPricePercent}
            min="1"
            max="250"
            step="0.1"
            suffix="%"
          />
          <NumericField
            id="bond-coupon"
            label="Jaarlijkse coupon"
            value={couponPercent}
            onChange={setCouponPercent}
            min="0"
            max="30"
            step="0.1"
            suffix="%"
          />
          <NumericField
            id="bond-years"
            label="Resterende hele jaren"
            value={years}
            onChange={setYears}
            min="1"
            max="50"
            step="1"
            suffix="jr"
          />
        </div>

        <output className={styles.calculatorResults} aria-live="polite">
          <span className={styles.resultPrimary}>
            <small>Indicatieve aankoopwaarde</small>
            <strong>{moneyFormatter.format(result.purchasePrice)}</strong>
            <em>exclusief opgebouwde rente en kosten</em>
          </span>
          <span>
            <small>Bruto coupon per jaar</small>
            <strong>{moneyFormatter.format(result.annualCoupon)}</strong>
          </span>
          <span>
            <small>Indicatief rendement tot aflossing</small>
            <strong>
              {Number.isFinite(result.annualYield)
                ? `${percentFormatter.format(result.annualYield * 100)}%`
                : "—"}
            </strong>
          </span>
          <span>
            <small>Aflossing op einddatum</small>
            <strong>{moneyFormatter.format(result.redemptionAmount)}</strong>
          </span>
        </output>

        <p className={styles.calculatorNote}>
          Educatieve berekening met één couponbetaling per jaar en hele resterende
          jaren. De berekening gebruikt geen live koers en houdt geen rekening met
          opgebouwde couponrente, belastingen, transactiekosten, wanbetaling of
          herbelegging van coupons. Dit is geen rendementsbelofte.
        </p>
      </div>
    </section>
  );
}
