const fs = require("node:fs");

const EU27 = Object.freeze([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);

const HISTORY_LIMIT = 20;
const FALLBACK_SECONDS = 91 * 24 * 60 * 60;

const toAppGeo = (code) => (code === "EL" ? "GR" : code);
const toEurostatGeo = (code) => (code === "GR" ? "EL" : code);

function parseQuarterKey(value) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(value || "").trim());
  if (!match) return null;
  return { year: Number(match[1]), quarter: Number(match[2]) };
}

function normalizeQuarterKey(value) {
  const parsed = parseQuarterKey(value);
  return parsed ? `${parsed.year}-Q${parsed.quarter}` : null;
}

function quarterOrdinal(value) {
  const parsed = parseQuarterKey(value);
  return parsed ? parsed.year * 4 + parsed.quarter - 1 : null;
}

function compareQuarters(a, b) {
  return (quarterOrdinal(a) ?? -Infinity) - (quarterOrdinal(b) ?? -Infinity);
}

function quartersBehind(older, newer) {
  const a = quarterOrdinal(older);
  const b = quarterOrdinal(newer);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.max(0, b - a);
}

function quarterEndDate(value) {
  const parsed = parseQuarterKey(value);
  if (!parsed) return null;

  const end = {
    1: [2, 31],
    2: [5, 30],
    3: [8, 30],
    4: [11, 31],
  };
  const [month, day] = end[parsed.quarter];
  return new Date(Date.UTC(parsed.year, month, day, 23, 59, 59));
}

function orderedKeys(index) {
  if (Array.isArray(index)) return [...index];
  if (!index || typeof index !== "object") return [];
  return Object.entries(index)
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map(([key]) => key);
}

function parseEurostatDataset(input) {
  const data = input?.dataset || input;
  const ids = data?.id;
  const size = data?.size;
  const dimensions = data?.dimension;

  if (!Array.isArray(ids) || !Array.isArray(size) || !dimensions || ids.length !== size.length) {
    throw new Error("Unexpected Eurostat JSON-stat structure");
  }

  const geoIndex = ids.indexOf("geo");
  const timeIndex = ids.indexOf("time");
  if (geoIndex === -1 || timeIndex === -1) {
    throw new Error("Eurostat response is missing the geo or time dimension");
  }

  for (let index = 0; index < size.length; index += 1) {
    if (index !== geoIndex && index !== timeIndex && Number(size[index]) !== 1) {
      throw new Error(`Unexpected multi-value Eurostat dimension: ${ids[index]}`);
    }
  }

  const geoKeys = orderedKeys(dimensions.geo?.category?.index);
  const rawTimeKeys = orderedKeys(dimensions.time?.category?.index);
  if (geoKeys.length === 0 || rawTimeKeys.length === 0) {
    throw new Error("Eurostat response has no countries or quarters");
  }

  const timeKeys = rawTimeKeys.map(normalizeQuarterKey);
  if (timeKeys.some((key) => !key)) {
    throw new Error("Eurostat response contains an invalid quarter key");
  }

  const strides = [];
  let accumulator = 1;
  for (let index = ids.length - 1; index >= 0; index -= 1) {
    strides[index] = accumulator;
    accumulator *= Number(size[index]);
  }

  const valueAt = (coordinates) => {
    let flatIndex = 0;
    for (let index = 0; index < coordinates.length; index += 1) {
      flatIndex += coordinates[index] * strides[index];
    }
    return data.value?.[flatIndex] ?? data.value?.[String(flatIndex)] ?? null;
  };

  const valuesByCountry = {};
  const recognizedGeoKeys = [];
  const unknownGeoKeys = [];

  for (let geoPosition = 0; geoPosition < geoKeys.length; geoPosition += 1) {
    const rawGeo = geoKeys[geoPosition];
    const code = toAppGeo(rawGeo);
    if (!EU27.includes(code)) {
      unknownGeoKeys.push(rawGeo);
      continue;
    }

    recognizedGeoKeys.push(code);
    const points = {};
    const coordinates = new Array(ids.length).fill(0);
    coordinates[geoIndex] = geoPosition;

    for (let timePosition = 0; timePosition < timeKeys.length; timePosition += 1) {
      coordinates[timeIndex] = timePosition;
      const rawValue = valueAt(coordinates);
      if (rawValue == null) continue;

      const valueMio = Number(rawValue);
      if (!Number.isFinite(valueMio) || valueMio <= 0) continue;
      points[timeKeys[timePosition]] = valueMio;
    }

    valuesByCountry[code] = points;
  }

  const validPointCount = Object.values(valuesByCountry).reduce(
    (total, points) => total + Object.keys(points).length,
    0
  );
  if (recognizedGeoKeys.length === 0 || validPointCount === 0) {
    throw new Error("Eurostat response contains no usable EU-27 debt values");
  }

  return {
    valuesByCountry,
    geoKeys: recognizedGeoKeys,
    missingGeoKeys: EU27.filter((code) => !recognizedGeoKeys.includes(code)),
    unknownGeoKeys,
    timeKeys,
    latestAvailableQuarter: [...timeKeys].sort(compareQuarters).at(-1) || null,
  };
}

function normalizeExistingSeriesRow(row) {
  if (!row || typeof row !== "object") return null;

  const previousTime = normalizeQuarterKey(row.previousTime);
  const latestTime = normalizeQuarterKey(row.latestTime);
  const startValue = Number(row.startValue);
  const endValue = Number(row.endValue);

  if (
    !previousTime ||
    !latestTime ||
    compareQuarters(previousTime, latestTime) > 0 ||
    !Number.isFinite(startValue) ||
    !Number.isFinite(endValue) ||
    startValue <= 0 ||
    endValue <= 0
  ) {
    return null;
  }

  return makeSeriesRow([
    { quarter: previousTime, valueEUR: startValue },
    { quarter: latestTime, valueEUR: endValue },
  ]);
}

function makeSeriesRow(points) {
  const sorted = [...points]
    .filter(
      (point) =>
        normalizeQuarterKey(point?.quarter) &&
        Number.isFinite(Number(point?.valueEUR)) &&
        Number(point.valueEUR) > 0
    )
    .map((point) => ({
      quarter: normalizeQuarterKey(point.quarter),
      valueEUR: Number(point.valueEUR),
    }))
    .sort((a, b) => compareQuarters(a.quarter, b.quarter));

  if (sorted.length === 0) return null;

  const latest = sorted.at(-1);
  const previous = sorted.length > 1 ? sorted.at(-2) : latest;
  const previousDate = quarterEndDate(previous.quarter);
  const latestDate = quarterEndDate(latest.quarter);
  const seconds =
    previousDate && latestDate && latestDate > previousDate
      ? Math.max(1, Math.floor((latestDate - previousDate) / 1000))
      : FALLBACK_SECONDS;
  const delta = latest.valueEUR - previous.valueEUR;

  return {
    latestTime: latest.quarter,
    previousTime: previous.quarter,
    startValue: previous.valueEUR,
    endValue: latest.valueEUR,
    startDateISO: previousDate ? previousDate.toISOString() : null,
    endDateISO: latestDate ? latestDate.toISOString() : null,
    perSecond: previous.quarter === latest.quarter ? 0 : delta / seconds,
    trend: Math.abs(delta) < 1 ? "flat" : delta > 0 ? "rising" : "falling",
  };
}

function periodSummary(series) {
  const counts = {};
  for (const code of EU27) {
    const quarter = normalizeQuarterKey(series?.[code]?.latestTime);
    if (!quarter) continue;
    counts[quarter] = (counts[quarter] || 0) + 1;
  }

  const entries = Object.entries(counts).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return compareQuarters(b[0], a[0]);
  });
  const dominantLatestTime = entries[0]?.[0] || null;
  const latestAvailableTime = Object.keys(counts).sort(compareQuarters).at(-1) || null;

  return {
    periodCounts: counts,
    dominantLatestTime,
    dominantCoverage: dominantLatestTime ? counts[dominantLatestTime] : 0,
    latestAvailableTime,
  };
}

function buildCurrentSeries(parsed, previousSeries = {}) {
  const series = {};
  const acceptedCodes = [];
  const carriedForwardCodes = [];
  const regressedSourceCodes = [];
  const missingCodes = [];

  for (const code of EU27) {
    const previousRow = normalizeExistingSeriesRow(previousSeries?.[code]);
    const fetchedPoints = Object.entries(parsed.valuesByCountry?.[code] || {})
      .map(([quarter, valueMio]) => ({
        quarter: normalizeQuarterKey(quarter),
        valueEUR: Number(valueMio) * 1_000_000,
      }))
      .filter(
        (point) =>
          point.quarter && Number.isFinite(point.valueEUR) && point.valueEUR > 0
      )
      .sort((a, b) => compareQuarters(a.quarter, b.quarter));

    if (fetchedPoints.length === 0) {
      if (previousRow) {
        series[code] = previousRow;
        carriedForwardCodes.push(code);
      } else {
        missingCodes.push(code);
      }
      continue;
    }

    const fetchedLatest = fetchedPoints.at(-1).quarter;
    if (previousRow && compareQuarters(fetchedLatest, previousRow.latestTime) < 0) {
      series[code] = previousRow;
      carriedForwardCodes.push(code);
      regressedSourceCodes.push(code);
      continue;
    }

    const candidates = new Map();
    if (previousRow) {
      candidates.set(previousRow.previousTime, previousRow.startValue);
      candidates.set(previousRow.latestTime, previousRow.endValue);
    }
    for (const point of fetchedPoints) {
      candidates.set(point.quarter, point.valueEUR);
    }

    const row = makeSeriesRow(
      [...candidates.entries()].map(([quarter, valueEUR]) => ({ quarter, valueEUR }))
    );
    if (!row) {
      if (previousRow) {
        series[code] = previousRow;
        carriedForwardCodes.push(code);
      } else {
        missingCodes.push(code);
      }
      continue;
    }

    series[code] = row;
    acceptedCodes.push(code);
  }

  const summary = periodSummary(series);
  const staleCodes = EU27.filter((code) => {
    const latest = series?.[code]?.latestTime;
    return latest && summary.dominantLatestTime && compareQuarters(latest, summary.dominantLatestTime) < 0;
  });

  return {
    series,
    report: {
      ...summary,
      acceptedCodes,
      carriedForwardCodes,
      regressedSourceCodes,
      missingCodes,
      staleCodes,
      sourceMissingGeoKeys: parsed.missingGeoKeys || [],
      sourceUnknownGeoKeys: parsed.unknownGeoKeys || [],
    },
  };
}

function normalizeHistoryRow(row) {
  const quarter = normalizeQuarterKey(row?.quarter);
  if (!quarter || !row?.countries || typeof row.countries !== "object") return null;

  const countries = {};
  for (const code of EU27) {
    const value = Number(row.countries[code]);
    if (Number.isFinite(value) && value > 0) countries[code] = value;
  }
  if (Object.keys(countries).length === 0) return null;

  const date = quarterEndDate(quarter);
  return {
    quarter,
    dateISO: date ? date.toISOString() : null,
    totalDebtEUR: Object.values(countries).reduce((sum, value) => sum + value, 0),
    countriesWithData: Object.keys(countries).length,
    countries,
  };
}

function buildHistory(parsed, previousHistory = {}) {
  const byQuarter = new Map();
  const previousRows = [
    ...(Array.isArray(previousHistory?.quarters) ? previousHistory.quarters : []),
    ...(Array.isArray(previousHistory?.partialQuarters) ? previousHistory.partialQuarters : []),
  ];

  for (const rawRow of previousRows) {
    const row = normalizeHistoryRow(rawRow);
    if (!row) continue;
    byQuarter.set(row.quarter, { ...row.countries });
  }

  for (const code of EU27) {
    for (const [quarter, valueMio] of Object.entries(parsed.valuesByCountry?.[code] || {})) {
      const normalizedQuarter = normalizeQuarterKey(quarter);
      const valueEUR = Number(valueMio) * 1_000_000;
      if (!normalizedQuarter || !Number.isFinite(valueEUR) || valueEUR <= 0) continue;

      const countries = byQuarter.get(normalizedQuarter) || {};
      countries[code] = valueEUR;
      byQuarter.set(normalizedQuarter, countries);
    }
  }

  const rows = [...byQuarter.entries()]
    .map(([quarter, countries]) => normalizeHistoryRow({ quarter, countries }))
    .filter(Boolean)
    .sort((a, b) => compareQuarters(a.quarter, b.quarter));

  const completeRows = rows
    .filter((row) => row.countriesWithData === EU27.length)
    .slice(-HISTORY_LIMIT);
  const partialRows = rows
    .filter((row) => row.countriesWithData < EU27.length)
    .slice(-HISTORY_LIMIT);
  const latest = completeRows.at(-1) || null;
  const latestAvailable = rows.at(-1) || null;

  const latestBreakdown = latest
    ? Object.entries(latest.countries)
        .map(([code, valueEUR]) => ({
          code,
          valueEUR,
          sharePct: latest.totalDebtEUR > 0 ? (valueEUR / latest.totalDebtEUR) * 100 : 0,
        }))
        .sort((a, b) => b.valueEUR - a.valueEUR)
    : [];

  return {
    quarters: completeRows,
    partialQuarters: partialRows,
    latestQuarter: latest?.quarter || null,
    latestCompleteQuarter: latest?.quarter || null,
    latestAvailableQuarter: latestAvailable?.quarter || null,
    latestDateISO: latest?.dateISO || null,
    latestTotalDebtEUR: latest?.totalDebtEUR || null,
    latestBreakdown,
    updateReport: {
      completeQuarterCount: completeRows.length,
      partialQuarters: partialRows.map((row) => ({
        quarter: row.quarter,
        countriesWithData: row.countriesWithData,
        missingCodes: EU27.filter((code) => !(code in row.countries)),
      })),
    },
  };
}

function validateCurrentSeries(series) {
  const codes = Object.keys(series || {});
  const missing = EU27.filter((code) => !codes.includes(code));
  const extra = codes.filter((code) => !EU27.includes(code));
  const invalid = EU27.filter((code) => !normalizeExistingSeriesRow(series?.[code]));

  if (missing.length || extra.length || invalid.length) {
    throw new Error(
      `Invalid current debt snapshot (missing: ${missing.join(",") || "none"}; ` +
        `extra: ${extra.join(",") || "none"}; invalid: ${invalid.join(",") || "none"})`
    );
  }
  return true;
}

function validateHistory(history) {
  const quarters = Array.isArray(history?.quarters) ? history.quarters : [];
  if (quarters.length === 0) throw new Error("Debt history has no complete quarter");

  const validateStoredRow = (rawRow, { complete }) => {
    const row = normalizeHistoryRow(rawRow);
    if (!row) {
      throw new Error(`Debt history contains an invalid row: ${rawRow?.quarter || "unknown"}`);
    }

    const rawCodes = Object.keys(rawRow.countries || {});
    const extraCodes = rawCodes.filter((code) => !EU27.includes(code));
    if (extraCodes.length > 0) {
      throw new Error(`Debt history contains non-EU country codes for ${row.quarter}`);
    }
    if (complete ? row.countriesWithData !== EU27.length : row.countriesWithData >= EU27.length) {
      throw new Error(
        `Debt history contains an ${complete ? "incomplete" : "complete"} row in the wrong collection: ${row.quarter}`
      );
    }
    if (Number(rawRow.countriesWithData) !== row.countriesWithData) {
      throw new Error(`Debt history country count does not match for ${row.quarter}`);
    }

    const storedTotal = Number(rawRow.totalDebtEUR);
    const tolerance = Math.max(1, row.totalDebtEUR * 1e-12);
    if (!Number.isFinite(storedTotal) || Math.abs(storedTotal - row.totalDebtEUR) > tolerance) {
      throw new Error(`Debt history total does not match its countries for ${row.quarter}`);
    }
    if (rawRow.dateISO !== row.dateISO) {
      throw new Error(`Debt history date does not match the quarter end for ${row.quarter}`);
    }
    return row;
  };

  let previousQuarter = null;
  const completeQuarterKeys = new Set();
  for (const rawRow of quarters) {
    const row = validateStoredRow(rawRow, { complete: true });
    if (previousQuarter && compareQuarters(previousQuarter, row.quarter) >= 0) {
      throw new Error("Debt history quarters are not strictly increasing");
    }
    previousQuarter = row.quarter;
    completeQuarterKeys.add(row.quarter);
  }

  const partialQuarters = Array.isArray(history?.partialQuarters) ? history.partialQuarters : [];
  previousQuarter = null;
  for (const rawRow of partialQuarters) {
    const row = validateStoredRow(rawRow, { complete: false });
    if (completeQuarterKeys.has(row.quarter)) {
      throw new Error(`Debt history stores ${row.quarter} as both complete and partial`);
    }
    if (previousQuarter && compareQuarters(previousQuarter, row.quarter) >= 0) {
      throw new Error("Partial debt history quarters are not strictly increasing");
    }
    previousQuarter = row.quarter;
  }

  const latest = quarters.at(-1);
  if (normalizeQuarterKey(history.latestQuarter) !== normalizeQuarterKey(latest.quarter)) {
    throw new Error("Debt history latestQuarter does not match the latest complete row");
  }
  if (normalizeQuarterKey(history.latestCompleteQuarter) !== normalizeQuarterKey(latest.quarter)) {
    throw new Error("Debt history latestCompleteQuarter does not match the latest complete row");
  }

  const allRows = [...quarters, ...partialQuarters].sort((a, b) =>
    compareQuarters(a.quarter, b.quarter)
  );
  const latestAvailable = allRows.at(-1);
  if (
    normalizeQuarterKey(history.latestAvailableQuarter) !==
    normalizeQuarterKey(latestAvailable?.quarter)
  ) {
    throw new Error("Debt history latestAvailableQuarter does not match its stored rows");
  }
  if (history.latestDateISO !== latest.dateISO) {
    throw new Error("Debt history latestDateISO does not match the latest complete row");
  }
  const latestTotalTolerance = Math.max(1, Number(latest.totalDebtEUR) * 1e-12);
  if (
    !Number.isFinite(Number(history.latestTotalDebtEUR)) ||
    Math.abs(Number(history.latestTotalDebtEUR) - Number(latest.totalDebtEUR)) >
      latestTotalTolerance
  ) {
    throw new Error("Debt history latestTotalDebtEUR does not match the latest complete row");
  }
  if (!Array.isArray(history.latestBreakdown) || history.latestBreakdown.length !== EU27.length) {
    throw new Error("Debt history latest breakdown does not contain all EU-27 countries");
  }
  const breakdownCodes = new Set();
  for (const item of history.latestBreakdown) {
    if (!EU27.includes(item?.code) || breakdownCodes.has(item.code)) {
      throw new Error("Debt history latest breakdown contains invalid or duplicate countries");
    }
    breakdownCodes.add(item.code);
    const expectedValue = Number(latest.countries[item.code]);
    if (Number(item.valueEUR) !== expectedValue) {
      throw new Error(`Debt history latest breakdown value does not match for ${item.code}`);
    }
  }
  return true;
}

function findJsonEnd(source, start) {
  const first = source[start];
  if (first === '"') {
    let escaped = false;
    for (let index = start + 1; index < source.length; index += 1) {
      const char = source[index];
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') return index + 1;
    }
    return -1;
  }

  if (first === "{" || first === "[") {
    const open = first;
    const close = first === "{" ? "}" : "]";
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < source.length; index += 1) {
      const char = source[index];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') inString = true;
      else if (char === open) depth += 1;
      else if (char === close) {
        depth -= 1;
        if (depth === 0) return index + 1;
      }
    }
    return -1;
  }

  const semicolon = source.indexOf(";", start);
  return semicolon === -1 ? -1 : semicolon;
}

function extractExportJson(source, name, fallback) {
  const marker = `export const ${name} =`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return fallback;

  let start = markerIndex + marker.length;
  while (/\s/.test(source[start] || "")) start += 1;
  const end = findJsonEnd(source, start);
  if (end === -1) throw new Error(`Cannot parse ${name} from generated data`);
  return JSON.parse(source.slice(start, end));
}

function readCurrentGenerated(file) {
  const source = fs.readFileSync(file, "utf8");
  return {
    source,
    snapshotId: extractExportJson(source, "EUROSTAT_SNAPSHOT_ID", null),
    updatedAt: extractExportJson(source, "EUROSTAT_UPDATED_AT", null),
    report: extractExportJson(source, "EUROSTAT_UPDATE_REPORT", {}),
    series: extractExportJson(source, "EUROSTAT_SERIES", {}),
  };
}

function readHistoryGenerated(file) {
  const source = fs.readFileSync(file, "utf8");
  return {
    source,
    snapshotId: extractExportJson(source, "EUROSTAT_DEBT_HISTORY_SNAPSHOT_ID", null),
    updatedAt: extractExportJson(source, "EUROSTAT_DEBT_HISTORY_UPDATED_AT", null),
    history: extractExportJson(source, "EUROSTAT_DEBT_HISTORY", {}),
  };
}

function renderCurrentGenerated({ snapshotId, updatedAt, report, series }) {
  return `// Auto-generated by scripts/update-eurostat-debt.js\n` +
    `export const EUROSTAT_SNAPSHOT_ID = ${JSON.stringify(snapshotId)};\n` +
    `export const EUROSTAT_UPDATED_AT = ${JSON.stringify(updatedAt)};\n` +
    `export const EUROSTAT_UPDATE_REPORT = ${JSON.stringify(report, null, 2)};\n` +
    `export const EUROSTAT_SERIES = ${JSON.stringify(series, null, 2)};\n`;
}

function renderHistoryGenerated({ snapshotId, updatedAt, history }) {
  return `// Auto-generated by scripts/update-eurostat-debt.js\n` +
    `export const EUROSTAT_DEBT_HISTORY_SNAPSHOT_ID = ${JSON.stringify(snapshotId)};\n` +
    `export const EUROSTAT_DEBT_HISTORY_UPDATED_AT = ${JSON.stringify(updatedAt)};\n` +
    `export const EUROSTAT_DEBT_HISTORY = ${JSON.stringify(history, null, 2)};\n`;
}

function buildEurostatUrl(lastTimePeriod = HISTORY_LIMIT) {
  const base =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt";
  const params = new URLSearchParams({
    lang: "EN",
    format: "JSON",
    freq: "Q",
    sector: "S13",
    na_item: "GD",
    unit: "MIO_EUR",
    lastTimePeriod: String(lastTimePeriod),
  });
  for (const code of EU27) params.append("geo", toEurostatGeo(code));
  return `${base}?${params.toString()}`;
}

module.exports = {
  EU27,
  HISTORY_LIMIT,
  buildCurrentSeries,
  buildEurostatUrl,
  buildHistory,
  compareQuarters,
  extractExportJson,
  normalizeExistingSeriesRow,
  normalizeQuarterKey,
  parseEurostatDataset,
  parseQuarterKey,
  periodSummary,
  quarterEndDate,
  quarterOrdinal,
  quartersBehind,
  readCurrentGenerated,
  readHistoryGenerated,
  renderCurrentGenerated,
  renderHistoryGenerated,
  validateCurrentSeries,
  validateHistory,
};
