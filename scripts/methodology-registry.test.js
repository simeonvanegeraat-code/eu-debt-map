const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { methodologyRegistry, METHODOLOGY_REVIEWED } = require('../lib/fiscal/methodology-registry');
const { registryCopy } = require('../components/methodology-preview/registry-copy.js');
const snapshots = Object.fromEntries(['balance','per-capita','growth','interest','accounts'].map(name=>[name==='per-capita'?'perCapita':name,require(`../lib/fiscal/${name}.gen.json`)]));
const legacy = { debt: { fetchedAt: '2026-07-31T11:54:33.124Z', period:'2026-Q1' }, ratio: { fetchedAt:'2026-07-31T16:55:06.132Z', period:'2026-Q1' } };

test('registry keeps source vintages, units and population definitions distinct', () => {
  const before = JSON.stringify(snapshots), rows = methodologyRegistry(snapshots,legacy);
  const byId = Object.fromEntries(rows.map(row=>[row.id,row]));
  assert.equal(rows.length,14);
  assert.equal(new Set(rows.map(row=>row.id)).size,14);
  assert.equal(byId.debt.sources[0].accessed,legacy.debt.fetchedAt);
  assert.equal(byId.debt.sources[0].updated,null);
  assert.equal(byId.debt.sources[1].accessed,snapshots.growth.fetchedAt);
  assert.equal(byId.ratio.sources[0].accessed,legacy.ratio.fetchedAt);
  assert.equal(byId.balance.sources[0].updated,snapshots.balance.sourceUpdated);
  assert.equal(byId.accountsBalance.sources[0].updated,snapshots.accounts.sources.balance.updated);
  assert.equal(byId.perCapita.sources[1].filters.indic_de,'JAN');
  assert.equal(byId.perCapita.sources[0].period,snapshots.perCapita.debtDate);
  assert.equal(byId.perCapita.sources[1].period,snapshots.perCapita.populationDate);
  assert.equal(byId.interestCapita.sources[1].filters.indic_de,'AVG');
  assert(byId.interestCapita.sources.every(source=>source.period===snapshots.interest.latestYear));
  assert.equal(byId.annualRatio.sources[0].filters.na_item,'GD');
  assert.equal(byId.annualRatio.sources[0].filters.freq,'A');
  assert.equal(byId.interest.sources[0].filters.na_item,'D41PAY');
  assert.equal(byId.interestRevenue.sources[1].filters.na_item,'TR');
  assert.deepEqual(rows.filter(row=>row.kind==='modelled').map(row=>row.id),['liveDebt','liveRatio']);
  assert.equal(JSON.stringify(snapshots),before);
});

test('registry is compact metadata with valid sources, localized explanations and existing anchors', () => {
  const rows = methodologyRegistry(snapshots,legacy);
  assert(JSON.stringify(rows).length<60000);
  const sourceFiles = ['components/methodology-preview/MethodologyPreviewPage.jsx',...fs.readdirSync(path.join(__dirname,'../components/fiscal')).filter(name=>name.endsWith('Source.jsx')).map(name=>`components/fiscal/${name}`)];
  const source = sourceFiles.map(file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8')).join('\n');
  for (const row of rows) {
    assert(source.includes(`"${row.method}"`),row.method);
    for (const input of row.sources) {
      assert.equal(new URL(input.url).hostname,'ec.europa.eu');
      assert(['A','Q'].includes(input.filters.freq));
      assert(input.period && input.unit && Number.isFinite(Date.parse(input.accessed)));
      assert(!('countries' in input));
    }
    for (const lang of ['en','nl','de','fr']) {
      const copy=registryCopy(lang);
      assert.equal(copy.metrics[row.id].length,2);
      assert(copy.metrics[row.id].every(text=>text.length>10));
      assert(copy.kinds[row.kind] && copy.updates[row.update]);
    }
  }
  assert.equal(METHODOLOGY_REVIEWED,'2026-09-08T00:00:00Z');
});

test('registry reporting periods follow refreshed snapshots without borrowing another source period', () => {
  const changed=structuredClone(snapshots);
  changed.accounts.latestYear='2026'; changed.perCapita.debtDate='2026-12-31'; changed.perCapita.populationDate='2027-01-01';
  const rows=Object.fromEntries(methodologyRegistry(changed,legacy).map(row=>[row.id,row]));
  assert.equal(rows.spending.period,'2026');
  assert(rows.spending.sources.every(source=>source.period==='2026'));
  assert.equal(rows.interest.period,snapshots.interest.latestYear);
  assert.equal(rows.balance.period,snapshots.balance.latestCompleteYear);
  assert.equal(rows.perCapita.period,'2026-12-31 / 2027-01-01');
});
