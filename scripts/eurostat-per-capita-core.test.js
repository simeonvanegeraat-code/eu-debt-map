const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { EU27 } = require("../lib/fiscal/indicators");
const { PER_CAPITA, perResident, perCapitaRows, perCapitaAggregate, perCapitaBand } = require("../lib/fiscal/per-capita");
const { requestUrl, parseSource, buildSnapshot, validateSnapshot } = require("./eurostat-per-capita-core");
const { updatePerCapita } = require("./update-eurostat-per-capita");
const checkedIn = require("../lib/fiscal/per-capita.gen.json");
const NOW = "2026-09-05T20:00:00Z";

function dataset(kind, year = kind === "population" ? "2026" : "2025") {
  const definition = PER_CAPITA[kind];
  const axes = { time: [year], geo: EU27.map(code => code === "GR" ? "EL" : code), ...Object.fromEntries(Object.entries(definition.filters).map(([key,value]) => [key,[value]])) };
  return { source:"ESTAT",extension:{id:definition.dataset.toUpperCase()},updated:kind === "population" ? "2026-07-21T23:00:00+0200" : "2026-04-22T11:00:00+0200",
    id:Object.keys(axes),size:Object.values(axes).map(values=>values.length),
    dimension:Object.fromEntries(Object.entries(axes).map(([key,values])=>[key,{category:{index:values}}])),
    value:Object.fromEntries(EU27.map((code,i)=>[i,kind === "population" ? 1000000 : kind === "debt" ? 20000 : 60])),
  };
}
const responses = () => Object.fromEntries(["debt","ratio","population"].map(kind=>[kind,dataset(kind)]));
const fixture = () => buildSnapshot(responses(),NOW);
const read = (file) => fs.readFileSync(path.join(__dirname,"..",file),"utf8");

test("per resident converts millions once, preserves zero debt and rejects absent/zero populations", () => {
  assert.equal(perResident(523541,18130208),523541000000/18130208);
  assert.equal(perResident(2,4),500000);
  assert.equal(perResident(0,4),0);
  for (const pop of [0,null,undefined,NaN,-1]) assert.equal(perResident(2,pop),null);
  assert.equal(perResident(null,4),null);
  assert.equal(perResident(-2,4),null);
});

test("January population and annual debt have matching stock dates with distinct source vintages", () => {
  const input = responses();input.population.status = {0:"ep"};
  const result = buildSnapshot(input,NOW);
  assert.equal(result.debtDate,"2025-12-31");assert.equal(result.populationDate,"2026-01-01");
  assert.equal(result.countries.AT.populationStatus,"ep");assert.equal(result.countries.GR.population,1000000);
  assert.notEqual(result.sources.population.updated,result.sources.debt.updated);
  assert.equal(perCapitaRows(result).find(row=>row.code==="AT").status,"ep");
  const query = new URL(requestUrl("population"));
  assert.equal(query.searchParams.get("indic_de"),"JAN");
  assert.equal(query.searchParams.get("unit"),null); // JAN itself defines the count of persons.
  assert.equal(query.searchParams.getAll("geo").length,27);
});

test("wrong filters, source, quarter periods and a shifted population year are rejected", () => {
  const badUnit = dataset("debt");badUnit.dimension.unit.category.index = ["MIO_NAC"];
  assert.throws(()=>parseSource(badUnit,"debt",NOW),/Incorrect debt unit/);
  const badPopulation = dataset("population");badPopulation.dimension.indic_de.category.index = ["AVG"];
  assert.throws(()=>parseSource(badPopulation,"population",NOW),/Incorrect population indic_de/);
  const badSector = dataset("debt");badSector.dimension.sector.category.index = ["S1311"];
  assert.throws(()=>parseSource(badSector,"debt",NOW),/Incorrect debt sector/);
  const badSource = dataset("population");badSource.source = "UNKNOWN";
  assert.throws(()=>parseSource(badSource,"population",NOW),/source metadata/);
  assert.throws(()=>parseSource(dataset("debt","2025-Q4"),"debt",NOW),/annual period/);
  const mismatched = responses();mismatched.population = dataset("population","2025");
  assert.throws(()=>buildSnapshot(mismatched,NOW),/invalid population/);
  const stored = fixture();stored.populationYear = "2025";
  assert.throws(()=>validateSnapshot(stored),/incompatible stock dates/);
});

test("partial countries, forecast observations and mismatched debt vintages fail closed", () => {
  for(const kind of ["debt","ratio","population"]){const partial=responses();delete partial[kind].value[3];assert.throws(()=>buildSnapshot(partial,NOW),/incomplete/);}
  const forecast = responses();forecast.population.status={0:"f"};
  assert.throws(()=>buildSnapshot(forecast,NOW),/invalid population/);
  const zero = responses();zero.population.value[0]=0;
  assert.throws(()=>buildSnapshot(zero,NOW),/invalid population/);
  const fraction = responses();fraction.population.value[0]=10.4;
  assert.throws(()=>buildSnapshot(fraction,NOW),/count of persons/);
  const vintage = responses();vintage.ratio.updated="2026-04-23T11:00:00+0200";
  assert.throws(()=>buildSnapshot(vintage,NOW),/share a vintage/);
  assert.deepEqual(parseSource(dataset("debt","2026"),"debt",NOW).series,{});
});

test("weighted EU comparison uses the same complete population cohort, not country averages", () => {
  const data=fixture();data.countries.AT.population=10000000;data.countries.AT.debtMioEur=100000;
  const aggregate=perCapitaAggregate(data);
  assert.equal(aggregate.debtEur,620000000000);
  assert.equal(aggregate.population,36000000);
  assert.equal(aggregate.value,620000000000/36000000);
  assert.notEqual(aggregate.value,perCapitaRows(data).reduce((sum,row)=>sum+row.value,0)/27);
  data.countries.BE.population=null;assert.equal(perCapitaAggregate(data),null);
});

test("ranks match displayed whole euros and remain stable on filtering; scale boundaries are explicit", () => {
  const data=fixture();data.countries.AT.debtMioEur=30000.1;data.countries.BE.debtMioEur=30000.4;
  const rows=perCapitaRows(data);
  assert.deepEqual(rows.slice(0,3).map(row=>row.rank),[1,1,3]);
  assert.equal(rows.filter(row=>row.code==="BG")[0].rank,3);
  assert.deepEqual([null,0,14999,15000,30000,45000].map(perCapitaBand),["missing","low","low","medium","high","highest"]);
  assert.equal(rows.length,27);
});

test("checked-in snapshot is complete and rejects period/source regressions", () => {
  validateSnapshot(checkedIn);
  assert.equal(perCapitaRows(checkedIn).length,27);
  const old=responses();for(const kind of Object.keys(old))old[kind]=dataset(kind,kind==="population"?"2025":"2024");
  assert.throws(()=>validateSnapshot(buildSnapshot(old,NOW),checkedIn),/regression/);
  const revision=structuredClone(checkedIn);revision.sources.population.updated="2026-07-01T00:00:00Z";
  assert.throws(()=>validateSnapshot(revision,checkedIn),/source regression/);
});

test("failed and incomplete updates preserve the previous snapshot; successful updates replace it", async () => {
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),"eu-per-capita-test-"));
  const target=path.join(directory,"per-capita.gen.json");const original=JSON.stringify(fixture());fs.writeFileSync(target,original);
  try {
    await assert.rejects(updatePerCapita({target,now:()=>NOW,fetchImpl:async()=>{throw Error("offline");}}),/offline/);
    assert.equal(fs.readFileSync(target,"utf8"),original);
    const fetchFixture=(partial)=>async(url)=>{const u=new URL(url);const kind=u.pathname.endsWith("demo_gind")?"population":u.searchParams.get("unit")==="MIO_EUR"?"debt":"ratio";const d=dataset(kind);if(partial&&kind==="population")delete d.value[3];return{ok:true,json:async()=>d};};
    await assert.rejects(updatePerCapita({target,now:()=>NOW,fetchImpl:fetchFixture(true)}),/invalid population/);
    assert.equal(fs.readFileSync(target,"utf8"),original);
    const saved=await updatePerCapita({target,now:()=>NOW,fetchImpl:fetchFixture(false)});
    assert.deepEqual(JSON.parse(fs.readFileSync(target,"utf8")),saved);
    assert.deepEqual(fs.readdirSync(directory),["per-capita.gen.json"]);
  } finally {for(const file of fs.readdirSync(directory))fs.unlinkSync(path.join(directory,file));fs.rmdirSync(directory);}
});

test("all four routes are localized and existing country pages receive a separate per-capita slot", () => {
  for(const lang of ["en","nl","de","fr"]){const prefix=lang==="en"?"":`/${lang}`;
    assert.match(read(`app${prefix}/debt-per-capita/page.jsx`),new RegExp(`perCapitaMetadata\\("${lang}"\\)`));
    assert.match(read(`app${prefix}/country/[code]/page.jsx`),/createCountryFiscalSlots/);
  }
  assert.match(read("app/country/[code]/CountryClient.jsx"),/perCapitaSlot=\{perCapitaSlot\}/);
  assert.match(read("components/country/CountryPageExperience.jsx"),/\{perCapitaSlot\}/);
  assert.match(read("app/sitemap.js"),/urlFor\("\/debt-per-capita", lang\)/);
  assert.match(read("components/fiscal/PerCapitaPage.jsx"),/"x-default"/);
});
