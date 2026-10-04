const { validateSnapshot } = require("./eurostat-inflation-core");
const snapshot = require("../lib/inflation/inflation.gen.json");
validateSnapshot(snapshot);
console.log(`Inflation snapshot valid: ${snapshot.latestMonth}, ${snapshot.periods.length} months, 29 geographies`);
