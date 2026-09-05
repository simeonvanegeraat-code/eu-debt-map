const test = require("node:test");
const assert = require("node:assert/strict");

const {
  bondPresentValue,
  calculateBondExample,
} = require("../lib/governmentBondCalculatorCore.cjs");

test("calculates the cash values of the guide example", () => {
  const result = calculateBondExample({
    faceValue: 1000,
    pricePercent: 97,
    couponPercent: 2.5,
    years: 5,
  });

  assert.equal(result.purchasePrice, 970);
  assert.equal(result.annualCoupon, 25);
  assert.equal(result.redemptionAmount, 1000);
  assert.equal(result.totalCashReceived, 1125);
  assert.equal(result.capitalDifference, 30);
  assert.ok(result.annualYield > 0.031 && result.annualYield < 0.032);
});

test("solved yield reprices the example bond", () => {
  const result = calculateBondExample({
    faceValue: 1000,
    pricePercent: 97,
    couponPercent: 2.5,
    years: 5,
  });
  const repriced = bondPresentValue(
    result.annualYield,
    result.annualCoupon,
    result.faceValue,
    result.years
  );

  assert.ok(Math.abs(repriced - result.purchasePrice) < 0.000001);
});

test("supports zero-coupon and negative-yield examples", () => {
  const discountBond = calculateBondExample({
    faceValue: 1000,
    pricePercent: 95,
    couponPercent: 0,
    years: 2,
  });
  const premiumBond = calculateBondExample({
    faceValue: 1000,
    pricePercent: 105,
    couponPercent: 0,
    years: 2,
  });

  assert.ok(discountBond.annualYield > 0);
  assert.ok(premiumBond.annualYield < 0);
});
