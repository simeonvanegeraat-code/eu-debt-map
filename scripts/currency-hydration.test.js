const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Execute the actual pure formatters without loading React/Next or JSX.
function loadFormatter(file, name, currencyMinimum) {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const start = source.indexOf(`function ${name}(`);
  assert(start >= 0, `Missing formatter: ${file}:${name}`);
  const end = source.indexOf("\n}", start) + 2;
  return vm.runInNewContext(`(${source.slice(start, end)})`, {
    getGrowthCopy: (locale) => ({ locale }),
    Intl: {
      NumberFormat: function (locale, options) {
        // Reproduce the differing compact-currency defaults observed between
        // production HTML (76,70) and the browser (76,7).
        const resolved = { ...options };
        if (resolved.style === "currency" && resolved.minimumFractionDigits === undefined) {
          resolved.minimumFractionDigits = Math.min(currencyMinimum, resolved.maximumFractionDigits ?? 2);
        }
        return new Intl.NumberFormat(locale, resolved);
      },
    },
  });
}

const cases = [
  ["components/country-preview/CountryDebtTrend.jsx", "formatDebt", (value, locale) => [value, locale]],
  ["components/country-preview/CountryPreviewExperience.jsx", "money", (value, locale) => [value, locale]],
  ["components/country-preview/AnimatedMetricValue.jsx", "formatValue", (value, locale) => [value, locale, "currency", true, true]],
  ["components/debt-to-gdp-preview/DebtToGDPPreviewPage.jsx", "formatDebt", (value, locale) => [value, locale]],
  ["components/fiscal/growth-copy.js", "growthNumber", (value, locale) => [value, locale, "compact", true]],
];

for (const [file, name, args] of cases) {
  test(`${name} in ${file} is stable across currency decimal defaults`, () => {
    const server = loadFormatter(file, name, 2);
    const browser = loadFormatter(file, name, 0);
    for (const locale of ["nl-NL", "en-GB", "de-DE", "fr-FR"]) {
      for (const value of [76_700_000_000, 8_500_000_000, 517_377_000_000, -6_343_000_000, 0]) {
        assert.equal(server(...args(value, locale)), browser(...args(value, locale)), `${locale}: ${value}`);
      }
    }
  });
}

test("Dutch debt trend preserves precision and currency units", () => {
  const format = loadFormatter(cases[0][0], "formatDebt", 2);
  assert.equal(format(76_700_000_000, "nl-NL"), "€\u00a076,7\u00a0mld.");
  assert.equal(format(517_377_000_000, "nl-NL"), "€\u00a0517,38\u00a0mld.");
});
