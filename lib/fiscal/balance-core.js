const { EU27 } = require("./indicators");

function percentagePointChange(current, previous, status = "") {
  return Number.isFinite(current) && Number.isFinite(previous) && !/[bdf]/i.test(status)
    ? Math.round((current - previous) * 10) / 10 : null;
}

function balanceBand(value) {
  if (!Number.isFinite(value)) return "missing";
  if (value > 0) return "surplus";
  if (value === 0) return "balanced";
  if (value >= -3) return "smallDeficit";
  return "largeDeficit";
}

// Competition ranks: equal published values share a rank (1, 2, 2, 4).
// Missing observations remain visible without a rank. EU aggregates are never ranked.
function balanceRows(snapshot, year = snapshot.latestCompleteYear) {
  const rows = EU27.map((code) => {
    const current = snapshot.series[code]?.[year] || {};
    const previous = snapshot.series[code]?.[String(Number(year) - 1)] || {};
    const changeStatus = [...new Set(`${current.balanceStatus || ""}${previous.balanceStatus || ""}`)].sort().join("");
    return {
      code, year, balance: current.balance ?? null, previous: previous.balance ?? null,
      debtRatio: current.debtRatio ?? null,
      change: percentagePointChange(current.balance, previous.balance, changeStatus), changeStatus,
      balanceStatus: current.balanceStatus || "", previousStatus: previous.balanceStatus || "",
      debtStatus: current.debtStatus || "",
    };
  }).sort((a, b) => (b.balance ?? -Infinity) - (a.balance ?? -Infinity) || a.code.localeCompare(b.code, "en"));
  let rank = null;
  return rows.map((row, index) => {
    if (Number.isFinite(row.balance) && (index === 0 || row.balance !== rows[index - 1].balance)) rank = index + 1;
    return { ...row, rank: Number.isFinite(row.balance) ? rank : null };
  });
}
module.exports = { percentagePointChange, balanceBand, balanceRows };
