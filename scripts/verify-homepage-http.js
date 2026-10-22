/* Verify rendered homepages and their local destinations against a running build. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { readRatioGenerated } = require("./eurostat-ratio-core");
const { readCurrentGenerated } = require("./eurostat-debt-core");

const base = process.argv[process.argv.indexOf("--base-url") + 1];
assert.ok(process.argv.includes("--base-url") && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base), "Supply a local --base-url, for example http://127.0.0.1:3001");
const root = path.resolve(__dirname, "..");
const ratios = readRatioGenerated(path.join(root, "lib/eurostat.ratio.gen.js")).series;
const debt = readCurrentGenerated(path.join(root, "lib/eurostat.debt.gen.js"));
const period = debt.report.dominantLatestTime;
const total = Object.values(debt.series).filter(row => row.latestTime === period).reduce((sum, row) => sum + row.endValue, 0);
const locales = { en: "en-GB", nl: "nl-NL", de: "de-DE", fr: "fr-FR" };
const destinations = new Set();
const images = new Set();
const results = [];
const decode = value => value.replaceAll("&amp;", "&").replaceAll("&nbsp;", "\u00a0").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');

async function get(pagePath) {
  const response = await fetch(new URL(pagePath, base), { redirect: "manual", signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${pagePath}: HTTP ${response.status}`);
  return response;
}

async function verify() {
  for (const [lang, locale] of Object.entries(locales)) {
    const prefix = lang === "en" ? "" : `/${lang}`;
    const response = await get(prefix || "/");
    assert.ok(!/noindex|none/.test(response.headers.get("x-robots-tag") || ""), `${lang}: indexable response headers`);
    const html = await response.text();
    const directoryStart = html.indexOf('id="country-directory"');
    assert.ok(directoryStart > 0, `${lang}: country directory in server HTML`);
    const directory = html.slice(directoryStart, html.indexOf("</section>", directoryStart));
    const links = [...directory.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    for (const [code, row] of Object.entries(ratios)) {
      const country = links.find(match => match[1] === `${prefix}/country/${code.toLowerCase()}`);
      assert.ok(country, `${lang}: country link ${code}`);
      const value = `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(row.ratioPct)}%`;
      assert.ok(country[2].includes(value), `${lang}/${code}: official debt-to-GDP ${value}`);
      assert.ok(country[2].includes(row.latestTime), `${lang}/${code}: official period`);
    }
    const formattedTotal = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(total);
    assert.ok(decode(html).includes(formattedTotal), `${lang}: official EU total in initial HTML`);
    const imageLabel = html.match(/<div[^>]*role="img"[^>]*aria-label="([^"]+)"[^>]*aria-live="off"/);
    assert.ok(imageLabel && decode(imageLabel[1]).includes(formattedTotal), `${lang}: screen-reader total without live announcements`);
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = decode(match[1]);
      if (!href.startsWith("/")) continue;
      const target = new URL(href, base);
      if (target.origin === base) destinations.add(target.pathname + target.search);
    }
    for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
      const src = decode(match[1]);
      if (src.startsWith("/")) images.add(src);
    }
    results.push({ lang, officialRatios: Object.keys(ratios).length, total, period, htmlBytes: Buffer.byteLength(html) });
  }
  const queue = [...destinations].map(url => ({ url, image: false })).concat([...images].map(url => ({ url, image: true })));
  let cursor = 0;
  const errors = [];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < queue.length) {
      const target = queue[cursor++];
      try {
        const response = await get(target.url);
        if (target.image) assert.ok(response.headers.get("content-type")?.startsWith("image/"), `${target.url}: image response`);
        await response.body?.cancel();
      } catch (error) { errors.push(error.message); }
    }
  }));
  assert.deepEqual(errors, [], "Homepage destinations and images must work");
  const report = { pages: results, destinations: destinations.size, images: images.size, errors };
  fs.mkdirSync(path.join(root, "reports/home-atlas"), { recursive: true });
  fs.writeFileSync(path.join(root, "reports/home-atlas/http-audit.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

verify().catch(error => { console.error(error); process.exitCode = 1; });
