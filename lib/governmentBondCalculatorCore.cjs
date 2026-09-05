function finiteNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bondPresentValue(rate, annualCoupon, faceValue, years) {
  let presentValue = 0;

  for (let year = 1; year <= years; year += 1) {
    presentValue += annualCoupon / (1 + rate) ** year;
  }

  return presentValue + faceValue / (1 + rate) ** years;
}

function solveAnnualYield({ purchasePrice, annualCoupon, faceValue, years }) {
  if (purchasePrice <= 0 || faceValue <= 0 || years < 1) return null;

  let lower = -0.9999;
  let upper = 1;
  let upperDifference =
    bondPresentValue(upper, annualCoupon, faceValue, years) - purchasePrice;

  while (upperDifference > 0 && upper < 128) {
    upper *= 2;
    upperDifference =
      bondPresentValue(upper, annualCoupon, faceValue, years) - purchasePrice;
  }

  if (upperDifference > 0) return null;

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const midpoint = (lower + upper) / 2;
    const difference =
      bondPresentValue(midpoint, annualCoupon, faceValue, years) - purchasePrice;

    if (difference > 0) lower = midpoint;
    else upper = midpoint;
  }

  return (lower + upper) / 2;
}

function calculateBondExample({
  faceValue,
  pricePercent,
  couponPercent,
  years,
} = {}) {
  const normalizedFaceValue = Math.max(0, finiteNumber(faceValue));
  const normalizedPricePercent = Math.max(0, finiteNumber(pricePercent));
  const normalizedCouponPercent = Math.max(0, finiteNumber(couponPercent));
  const normalizedYears = Math.max(1, Math.round(finiteNumber(years, 1)));
  const purchasePrice = normalizedFaceValue * (normalizedPricePercent / 100);
  const annualCoupon = normalizedFaceValue * (normalizedCouponPercent / 100);
  const annualYield = solveAnnualYield({
    purchasePrice,
    annualCoupon,
    faceValue: normalizedFaceValue,
    years: normalizedYears,
  });

  return {
    faceValue: normalizedFaceValue,
    pricePercent: normalizedPricePercent,
    couponPercent: normalizedCouponPercent,
    years: normalizedYears,
    purchasePrice,
    annualCoupon,
    redemptionAmount: normalizedFaceValue,
    totalCashReceived: normalizedFaceValue + annualCoupon * normalizedYears,
    capitalDifference: normalizedFaceValue - purchasePrice,
    annualYield,
  };
}

module.exports = {
  bondPresentValue,
  calculateBondExample,
  solveAnnualYield,
};
