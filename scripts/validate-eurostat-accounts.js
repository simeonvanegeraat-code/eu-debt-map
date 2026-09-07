const snapshot = require("../lib/fiscal/accounts.gen.json");
const { validateSnapshot } = require("./eurostat-accounts-core");
validateSnapshot(snapshot);
console.log(`Government accounts valid: ${snapshot.years[0]}–${snapshot.latestYear}, EU27 and EU aggregate`);
