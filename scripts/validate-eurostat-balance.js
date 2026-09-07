const snapshot = require("../lib/fiscal/balance.gen.json");
const { validateSnapshot } = require("./eurostat-balance-core");
validateSnapshot(snapshot);
console.log(`Fiscal data valid: 27 countries + EU aggregate, latest ${snapshot.latestCompleteYear}`);
