const snapshot = require("../lib/fiscal/per-capita.gen.json");
const { validateSnapshot } = require("./eurostat-per-capita-core");
validateSnapshot(snapshot);
console.log(`Debt per resident inputs valid: EU27, ${snapshot.debtDate} / ${snapshot.populationDate}`);
