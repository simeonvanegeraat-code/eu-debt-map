// Decode JSON-stat by dimension coordinates, preserving zero, negatives, nulls and flags.
function decodeJsonStat(data) {
  const { id, size, dimension, value, status = {} } = data || {};
  if (!Array.isArray(id) || !id.length || new Set(id).size !== id.length ||
      !Array.isArray(size) || size.length !== id.length || !value || typeof value !== "object") {
    throw new Error("Invalid JSON-stat structure");
  }
  const axes = id.map((name, i) => {
    const index = dimension?.[name]?.category?.index;
    if (!Number.isInteger(size[i]) || size[i] < 1 || !index) throw new Error(`Invalid axis: ${name}`);
    const entries = Array.isArray(index) ? index.map((key, j) => [key, j]) : Object.entries(index);
    entries.sort((a, b) => a[1] - b[1]);
    if (entries.length !== size[i] || entries.some(([, position], j) => position !== j)) {
      throw new Error(`Invalid category positions: ${name}`);
    }
    return entries.map(([key]) => key);
  });
  const count = size.reduce((a, b) => a * b, 1);
  if (!Number.isSafeInteger(count) || count > 100000) throw new Error("Unexpected response size");
  for (const collection of [value, typeof status === "string" ? {} : status]) {
    if (!collection || typeof collection !== "object") throw new Error("Invalid observation collection");
    for (const key of Object.keys(collection)) {
      if (!/^\d+$/.test(key) || Number(key) >= count) throw new Error(`Invalid observation index: ${key}`);
    }
  }
  const strides = size.map((_, i) => size.slice(i + 1).reduce((a, b) => a * b, 1));
  return Array.from({ length: count }, (_, offset) => {
    const raw = value[offset];
    if (raw !== null && raw !== undefined && (typeof raw !== "number" || !Number.isFinite(raw))) {
      throw new Error(`Invalid numeric observation at ${offset}`);
    }
    const flag = typeof status === "string" ? status : status[offset] ?? "";
    if (typeof flag !== "string") throw new Error(`Invalid observation status at ${offset}`);
    return {
      dimensions: Object.fromEntries(id.map((name, i) => [name, axes[i][Math.floor(offset / strides[i]) % size[i]]])),
      value: raw ?? null,
      status: flag,
    };
  });
}
module.exports = { decodeJsonStat };
