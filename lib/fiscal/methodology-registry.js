const { EU27, BALANCE } = require('./indicators');
const { GROWTH } = require('./growth');
const METHODOLOGY_REVIEWED = '2026-09-07T00:00:00Z';

// Metadata only: callers keep raw observations on the server.
function methodologyRegistry({ balance, perCapita, growth, interest, accounts }, legacy) {
  function stored(snapshot, key, period, context) {
    const source = snapshot.sources[key];
    return { ...source, accessed: snapshot.fetchedAt, period, context, unit: source.filters.unit || 'persons' };
  }
  function quarterly(unit, info, count) {
    const filters = { freq: 'Q', sector: 'S13', na_item: 'GD', unit };
    const query = new URLSearchParams({ lang: 'EN', ...filters, lastTimePeriod: String(count) });
    EU27.forEach(code => query.append('geo', code === 'GR' ? 'EL' : code));
    return { dataset: GROWTH.dataset, filters, unit, accessed: info.fetchedAt, updated: null, period: info.period, context: 'overview', url: `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${GROWTH.dataset}?${query}` };
  }
  const debt = quarterly('MIO_EUR', legacy.debt, 20);
  const ratio = quarterly('PC_GDP', legacy.ratio, 8);
  const extendedDebt = stored(growth, 'debt', growth.latestQuarter, 'history');
  const extendedRatio = stored(growth, 'ratio', growth.latestQuarter, 'history');
  const edp = { dataset: BALANCE.dataset, filters: balance.filters.balance, unit: 'PC_GDP', accessed: balance.fetchedAt, updated: balance.sourceUpdated, period: balance.latestCompleteYear, url: balance.sourceUrls.balance };
  const interestSource = key => stored(interest, key, interest.latestYear);
  const accountSource = key => stored(accounts, key, accounts.latestYear);
  const row = (id, kind, period, sources, method, update = 'validated') => ({ id, kind, period, sources, method, update });
  return [
    row('debt', 'official', legacy.debt.period, [debt, extendedDebt], 'definition', 'quarterly'),
    row('ratio', 'official', legacy.ratio.period, [ratio, extendedRatio], 'definition', 'quarterly'),
    row('annualRatio', 'official', balance.latestCompleteYear, [{ ...edp, filters: balance.filters.debt, url: balance.sourceUrls.debt }, stored(perCapita, 'ratio', perCapita.debtYear)], 'budget-balance-methodology'),
    row('balance', 'official', balance.latestCompleteYear, [edp], 'budget-balance-methodology'),
    row('perCapita', 'calculated', `${perCapita.debtDate} / ${perCapita.populationDate}`, [stored(perCapita, 'debt', perCapita.debtDate), stored(perCapita, 'population', perCapita.populationDate)], 'debt-per-capita-methodology'),
    row('growth', 'calculated', `${growth.periods[0]} → ${growth.latestQuarter}`, [extendedDebt, extendedRatio], 'debt-growth-methodology'),
    row('interest', 'official', interest.latestYear, [interestSource('amount'), interestSource('ratio')], 'interest-cost-methodology'),
    row('interestCapita', 'calculated', interest.latestYear, [interestSource('amount'), interestSource('population')], 'interest-cost-methodology'),
    row('interestRevenue', 'calculated', interest.latestYear, [interestSource('amount'), interestSource('revenue')], 'interest-cost-methodology'),
    row('spending', 'official', accounts.latestYear, [accountSource('expenditure'), accountSource('expenditureRatio')], 'government-accounts-methodology'),
    row('revenue', 'official', accounts.latestYear, [accountSource('revenue'), accountSource('revenueRatio')], 'government-accounts-methodology'),
    row('accountsBalance', 'official', accounts.latestYear, [accountSource('balance'), accountSource('balanceRatio')], 'government-accounts-methodology'),
    row('liveDebt', 'modelled', legacy.debt.period, [debt], 'calculation', 'model'),
    row('liveRatio', 'modelled', legacy.ratio.period, [debt, ratio], 'calculation', 'model'),
  ];
}
module.exports = { methodologyRegistry, METHODOLOGY_REVIEWED };
