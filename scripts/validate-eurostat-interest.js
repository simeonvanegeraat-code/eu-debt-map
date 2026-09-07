const snapshot = require("../lib/fiscal/interest.gen.json");
const { validateSnapshot } = require("./eurostat-interest-core");
validateSnapshot(snapshot);
console.log(`Interest data valid: ${snapshot.years[0]}–${snapshot.latestYear}, EU27`);
