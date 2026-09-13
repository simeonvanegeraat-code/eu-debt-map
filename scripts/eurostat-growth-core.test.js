const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { EU27 } = require("../lib/fiscal/indicators");
const { GROWTH, quarterIndex, quarterEnd, shiftQuarter, countryGrowthPoints, endpointChange, growthRows, fiveYearOverview, trendSegments } = require("../lib/fiscal/growth");
const { requestUrl, parseSource, buildSnapshot, validateSnapshot } = require("./eurostat-growth-core");
const { updateGrowth } = require("./update-eurostat-growth");
const { readHistoryGenerated, readCurrentGenerated } = require("./eurostat-debt-core");
const { readRatioGenerated } = require("./eurostat-ratio-core");
const saved = require("../lib/fiscal/growth.gen.json");
const NOW = "2026-09-06T12:00:00Z";
function fixture(kind) {
  const times = Array.from({length:41},(_,i)=>shiftQuarter("2026-Q1",i-40));
  const axes = {time:times,geo:EU27.map(c=>c==="GR"?"EL":c),unit:[GROWTH.units[kind]],sector:["S13"],na_item:["GD"],freq:["Q"]};
  const id = Object.keys(axes);
  return {source:"ESTAT",extension:{id:GROWTH.dataset},updated:"2026-07-21T11:00:00+0200",id,size:id.map(k=>axes[k].length),dimension:Object.fromEntries(id.map(k=>[k,{category:{index:Object.fromEntries(axes[k].map((v,i)=>[v,i]))}}])),value:Object.fromEntries(times.flatMap((q,i)=>EU27.map((c,j)=>[i*27+j,kind==="debt"?100+i*2+j:100-i*.5+j]))),status:{[40*27+EU27.indexOf("GR")]:"p"}};
}
const fixtures = () => ({debt:fixture("debt"),ratio:fixture("ratio")});
const make = () => buildSnapshot(fixtures(),NOW);

test("growth compares exact same-quarter endpoints and calendar quarter ends",()=>{
  assert.equal(quarterIndex("2026-Q1")-quarterIndex("2016-Q1"),40);
  assert.equal(shiftQuarter("2026-Q1",-20),"2021-Q1");
  assert.equal(shiftQuarter("2026-Q1",-1),"2025-Q4");
  assert.equal(quarterEnd("2024-Q1"),"2024-03-31");
  assert.equal(quarterEnd("2025-Q4"),"2025-12-31");
  assert.equal(quarterIndex("2026-Q5"),null);
  const points=countryGrowthPoints(make(),EU27[0]);
  const euro=endpointChange(points,"2026-Q1",10,"debt"),ratio=endpointChange(points,"2026-Q1",10,"ratio");
  assert.equal(euro.first,100e6);assert.equal(euro.last,180e6);assert.equal(euro.change,80e6);assert.equal(euro.percent,80);
  assert.equal(ratio.first,100);assert.equal(ratio.last,80);assert.equal(ratio.change,-20);
  assert.equal(endpointChange(points,"2026-Q1",5,"debt").first,140e6);
});
test("growth preserves metadata, Greece and observation flags through reordered JSON-stat dimensions",()=>{
  const s=make();assert.equal(s.periods.length,41);assert.equal(s.countries.GR.debtStatus.at(-1),"p");assert.equal(s.countries.GR.ratioStatus[0],"");
  const url=new URL(requestUrl("ratio"));assert.equal(url.searchParams.get("unit"),"PC_GDP");assert.equal(url.searchParams.get("lastTimePeriod"),"41");assert.equal(url.searchParams.getAll("geo").length,27);assert.ok(url.searchParams.getAll("geo").includes("EL"));
  const p=countryGrowthPoints(s,"GR");const change=endpointChange(p,s.latestQuarter,1,"debt");assert.equal(change.firstStatus,"");assert.equal(change.lastStatus,"p");assert.equal(change.status,"p");
});
test("growth rejects wrong accounting filters, annual data, unknown geography and inconsistent vintages",()=>{
  for(const [axis,bad]of [["unit","MIO_NAC"],["sector","S1311"],["na_item","AF3"],["freq","A"],["geo","UK"],["time","2026"]]){
    const f=fixtures();const index=f.debt.dimension[axis].category.index;const first=Object.keys(index)[0];index[bad]=index[first];delete index[first];assert.throws(()=>buildSnapshot(f,NOW));
  }
  for(const field of ["source","updated"]){const f=fixtures();f.debt[field]=field==="source"?"other":"2027-01-01";assert.throws(()=>buildSnapshot(f,NOW));}
  const f=fixtures();f.ratio.updated="2026-07-20T11:00:00+0200";assert.throws(()=>buildSnapshot(f,NOW),/vintage/);
});
test("growth excludes unfinished quarters and fails closed on missing latest or five-year overview values",()=>{
  const f=fixtures();f.debt.updated="2026-01-21T11:00:00+0200";assert.equal(Object.keys(parseSource(f.debt,"debt","2026-02-01T12:00:00Z").series).at(-1),"2025-Q4");
  for(const kind of ["debt","ratio"]){const f=fixtures();delete f[kind].value[40*27];assert.throws(()=>buildSnapshot(f,NOW),/incomplete latest/);}
  const forecast=fixtures();forecast.debt.status[40*27]="f";assert.throws(()=>buildSnapshot(forecast,NOW),/incomplete latest/);
  const overview=fixtures();delete overview.debt.value[25*27];assert.throws(()=>buildSnapshot(overview,NOW),/overview/);
  const bad=make();bad.countries.AT.debt[0]=-1;assert.throws(()=>validateSnapshot(bad),/observation/);
});
test("older gaps do not substitute endpoints and break flags suppress only the affected measure",()=>{
  const s=make();const c=EU27[0];s.countries[c].debt[0]=null;validateSnapshot(s);
  const row=growthRows(s,10).find(r=>r.code===c);assert.equal(row.debt.change,null);assert.equal(row.ratio.change,-20);assert.equal(row.rank,null);
  assert.ok(growthRows(s,5).find(r=>r.code===c).debt.change>0);
  const points=countryGrowthPoints(make(),c);points[10].ratioStatus="b";
  assert.equal(endpointChange(points,"2026-Q1",10,"ratio").reason,"break");assert.ok(endpointChange(points,"2026-Q1",10,"debt").change>0);
  assert.equal(endpointChange(points.filter(p=>p.quarter!=="2021-Q1"),"2026-Q1",5,"debt").change,null);
  const zero=countryGrowthPoints(make(),c);zero[0].debt=0;const result=endpointChange(zero,"2026-Q1",10,"debt");assert.equal(result.percent,null);assert.equal(result.change,180e6);
});
test("growth ranks displayed values, keeps negative changes and distinguishes absolute from relative growth",()=>{
  const s=make();s.countries.AT=structuredClone(s.countries.BE);s.countries.BG=structuredClone(s.countries.BE);
  s.countries.AT.debt[0]=100;s.countries.AT.debt[40]=110;
  s.countries.BE.debt[0]=1000;s.countries.BE.debt[40]=1011;
  s.countries.BG.debt[0]=100;s.countries.BG.debt[40]=110.01;
  const relative=growthRows(s,10);assert.equal(relative.find(r=>r.code==="AT").rank,relative.find(r=>r.code==="BG").rank);
  assert.ok(relative.find(r=>r.code==="AT").rank<relative.find(r=>r.code==="BE").rank);
  const absolute=growthRows(s,10,"absolute");assert.ok(absolute.find(r=>r.code==="BE").rank<absolute.find(r=>r.code==="AT").rank);
  const decline=growthRows(s,10,"ratioDown");assert.ok(decline.every(r=>r.ratio.change===-20));assert.ok(relative.some(r=>r.divergence));
  assert.throws(()=>growthRows(s,2));assert.throws(()=>growthRows(s,5,"other"));
});
test("trend segments show gaps and breaks without connecting across them",()=>{
  const points=[{debt:1},{debt:2},{debt:null},{debt:4},{debt:5,debtStatus:"b"},{debt:6},{debt:7,debtStatus:"f"}];
  assert.deepEqual(trendSegments(points,"debt").map(s=>s.map(p=>p.index)),[[0,1],[3],[4,5]]);
});
test("five-year overview spans exactly 20 intervals with a complete weighted country breakdown",()=>{
  const overview=fiveYearOverview(make());assert.equal(overview.quarters.length,21);assert.equal(overview.quarters[0].quarter,"2021-Q1");assert.equal(overview.latestQuarter,"2026-Q1");
  assert.ok(Math.abs(overview.latestBreakdown.reduce((s,r)=>s+r.sharePct,0)-100)<1e-10);
  assert.equal(overview.latestBreakdown.reduce((s,r)=>s+r.valueEUR,0),overview.latestTotalDebtEUR);assert.equal(overview.provisional,true);
});
test("saved growth data validates and reconciles with the unchanged debt history and latest country inputs",()=>{
  validateSnapshot(saved);const old=readHistoryGenerated(path.join(__dirname,"../lib/eurostat.debt.history.gen.js")).history;
  const current=readCurrentGenerated(path.join(__dirname,"../lib/eurostat.debt.gen.js")).series;
  const ratio=readRatioGenerated(path.join(__dirname,"../lib/eurostat.ratio.gen.js")).series;
  // Reconcile this initial shared vintage; subsequent explicit revisions may legitimately differ.
  if(saved.latestQuarter===old.latestQuarter&&saved.sources.debt.updated.startsWith("2026-07-21")){
    for(const q of old.quarters)for(const code of EU27)assert.ok(Math.abs(saved.countries[code].debt[saved.periods.indexOf(q.quarter)]*1e6-q.countries[code])<1);
    for(const code of EU27){assert.equal(current[code].latestTime,saved.latestQuarter);assert.equal(ratio[code].latestTime,saved.latestQuarter);assert.equal(ratio[code].ratioPct,saved.countries[code].ratio.at(-1));}
  }
  const s=make();assert.throws(()=>validateSnapshot({...s,periods:s.periods.slice(1)}));
  assert.throws(()=>validateSnapshot({...s,fetchedAt:"2026-08-01"},s),/regression/);
  const lost=structuredClone(s);lost.countries.AT.ratio[0]=null;assert.throws(()=>validateSnapshot(lost,s),/lost existing/);
});
test("growth updater preserves previous bytes on failure and replaces only a fully validated bundle",async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),"growth-update-test-"));const target=path.join(dir,"growth.json");const initial=JSON.stringify(make());await fs.writeFile(target,initial);
  try{
    await assert.rejects(updateGrowth({target,now:()=>NOW,fetchImpl:async()=>({ok:false,status:503})}));assert.equal(await fs.readFile(target,"utf8"),initial);
    const bad=fixtures();delete bad.ratio.value[40*27];
    await assert.rejects(updateGrowth({target,now:()=>NOW,fetchImpl:async url=>({ok:true,json:async()=>bad[new URL(url).searchParams.get("unit")==="MIO_EUR"?"debt":"ratio"]})}));assert.equal(await fs.readFile(target,"utf8"),initial);
    const good=fixtures();await updateGrowth({target,now:()=>NOW,fetchImpl:async url=>({ok:true,json:async()=>good[new URL(url).searchParams.get("unit")==="MIO_EUR"?"debt":"ratio"]})});validateSnapshot(JSON.parse(await fs.readFile(target,"utf8")));assert.deepEqual(await fs.readdir(dir),["growth.json"]);
  }finally{await fs.unlink(target);await fs.rmdir(dir);}
});
test("all growth locales share one page and integrate with country, source and historical chart paths",async()=>{
  for(const lang of ["en","nl","de","fr"]){const root=lang==="en"?"app":`app/${lang}`;assert.match(await fs.readFile(path.join(__dirname,"..",root,"debt-growth/page.jsx"),"utf8"),new RegExp(`growthMetadata\\("${lang}"\\)`));assert.match(await fs.readFile(path.join(__dirname,"..",root,"country/[code]/page.jsx"),"utf8"),/CountryPublicPage/);}
  assert.match(await fs.readFile(path.join(__dirname,"../components/country-preview/CountryPreviewExperience.jsx"),"utf8"),/fiscalPath\("\/debt-growth", lang\)/);
  const page=await fs.readFile(path.join(__dirname,"../components/fiscal/GrowthPage.jsx"),"utf8");assert.match(page,/canonical:url/);assert.match(page,/"x-default"/);assert.match(page,/"percentage points"/);
  assert.match(await fs.readFile(path.join(__dirname,"../app/sitemap.js"),"utf8"),/urlFor\("\/debt-growth", lang\)/);
  assert.match(await fs.readFile(path.join(__dirname,"../components/HomePageExperience.jsx"),"utf8"),/historyRows={overview.quarters}/);
  assert.doesNotMatch(await fs.readFile(path.join(__dirname,"../components/home-preview/HomeTrendPreview.jsx"),"utf8"),/eurostat.debt.history.gen|slice\(-20\)/);
});
