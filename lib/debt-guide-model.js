// Illustrative stock-flow model: every annual deficit is financed by new debt.
function debtGuideSeries(openingDebt, annualDeficit, years = 10) {
  if (!Number.isFinite(openingDebt) || !Number.isFinite(annualDeficit) || !Number.isInteger(years) || openingDebt < 0 || annualDeficit < 0 || years < 0) {
    throw new RangeError('The illustrative model requires non-negative amounts and whole years.');
  }
  return Array.from({ length: years + 1 }, (_, year) => openingDebt + annualDeficit * year);
}
module.exports = { debtGuideSeries };
