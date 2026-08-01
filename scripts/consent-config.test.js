const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

const POLICY_PAGES = [
  "app/privacy/page.jsx",
  "app/cookies/page.jsx",
  "app/nl/privacy/page.jsx",
  "app/nl/cookies/page.jsx",
  "app/de/privacy/page.jsx",
  "app/de/cookies/page.jsx",
  "app/fr/privacy/page.jsx",
  "app/fr/cookies/page.jsx",
];

test("Consent Mode v2 keeps every storage and advertising signal denied by default", () => {
  const layout = read("app/layout.jsx");

  for (const signal of [
    "ad_storage",
    "ad_user_data",
    "ad_personalization",
    "analytics_storage",
  ]) {
    assert.match(layout, new RegExp(`${signal}: 'denied'`));
  }

  assert.match(layout, /wait_for_update: 500/);
  assert.match(layout, /strategy="beforeInteractive"/);
});

test("Phase 3B preserves the production AdSense loader and publisher identity", () => {
  const layout = read("app/layout.jsx");

  assert.match(layout, /process\.env\.VERCEL_ENV === "production"/);
  assert.match(layout, /pagead\/js\/adsbygoogle\.js\?client=ca-pub-9252617114074571/);
  assert.match(layout, /name="google-adsense-account" content="ca-pub-9252617114074571"/);
  assert.equal(
    read("public/ads.txt").trim(),
    "google.com, pub-9252617114074571, DIRECT, f08c47fec0942fa0"
  );
});

test("Privacy and cookie pages describe the services that are actually loaded", () => {
  for (const page of POLICY_PAGES) {
    const source = read(page);
    assert.doesNotMatch(source, /CookieScript|Google Analytics 4/);
    assert.match(source, /Google Consent Management Platform|Google(?:'s|s| Datenschutz| Confidentialité| Privacy)/);
    assert.match(source, /Vercel Web Analytics/);
  }
});

test("Every public consent-settings link uses Google's revocation component", () => {
  for (const page of [...POLICY_PAGES, "components/Footer.jsx"]) {
    const source = read(page);
    assert.match(source, /GoogleConsentSettingsLink/);
    assert.doesNotMatch(source, /csconsentlink/);
  }

  const component = read("components/GoogleConsentSettingsLink.jsx");
  assert.match(component, /typeof googlefc\.showRevocationMessage !== "function"/);
  assert.match(
    component,
    /googlefc\.callbackQueue\.push\(googlefc\.showRevocationMessage\)/
  );
  assert.match(component, /googlefc\.showRevocationMessage\(\)/);
});

test("Google CMP and ad domains remain allowed by the existing CSP", () => {
  const config = read("next.config.mjs");

  assert.match(config, /https:\/\/fundingchoicesmessages\.google\.com/);
  assert.match(config, /https:\/\/pagead2\.googlesyndication\.com/);
  assert.match(config, /https:\/\/googleads\.g\.doubleclick\.net/);
});

test("Vercel Web Analytics remains enabled site-wide", () => {
  const layout = read("app/layout.jsx");

  assert.match(layout, /@vercel\/analytics\/next/);
  assert.match(layout, /<Analytics \/>/);
});
