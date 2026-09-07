const { validateSnapshot } = require("./eurostat-growth-core");
const snapshot = require("../lib/fiscal/growth.gen.json");
validateSnapshot(snapshot);
console.log(`Growth history valid: EU27, ${snapshot.periods[0]} to ${snapshot.latestQuarter}`);
