const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const EXTRA_ROUTES = [
  "/robots.txt",
  "/rss.xml",
  "/news-sitemap.xml",
];
const RESPONSE_HEADERS = [
  "cache-control",
  "content-security-policy",
  "content-type",
  "location",
  "x-robots-tag",
];

function readArguments(argv) {
  const options = { baseUrl: DEFAULT_BASE_URL, label: "baseline", output: null };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (argument === "--base" && value) {
      options.baseUrl = value;
      index += 1;
    } else if (argument === "--label" && value) {
      options.label = value;
      index += 1;
    } else if (argument === "--output" && value) {
      options.output = value;
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }
  }

  if (!options.output) {
    throw new Error("Provide an output file with --output <path>");
  }

  return options;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function decodeHtml(value = "") {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const isHex = entity[1]?.toLowerCase() === "x";
      const parsed = Number.parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : match;
    }

    return namedEntities[entity.toLowerCase()] ?? match;
  });
}

function textFromHtml(value = "") {
  return decodeHtml(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedTextHash(value) {
  const normalized = textFromHtml(value)
    .replace(/\b\d[\d\s.,:%€$+\-–—/]*\b/g, "<number>")
    .replace(/\s+/g, " ")
    .trim();

  return sha256(normalized);
}

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;

  while ((match = pattern.exec(tag))) {
    const [, rawName, doubleQuoted, singleQuoted, unquoted] = match;
    const name = rawName.toLowerCase();
    if (name === "link" || name === "meta" || name === "a") continue;
    attributes[name] = decodeHtml(doubleQuoted ?? singleQuoted ?? unquoted ?? "");
  }

  return attributes;
}

function extractTagText(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? textFromHtml(match[1]) : null;
}

function extractHeadings(html) {
  return [...html.matchAll(/<(h[12])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((match) => ({
    level: match[1].toLowerCase(),
    text: textFromHtml(match[2]),
  }));
}

function extractMetadata(html) {
  const meta = {};
  const links = [];

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const key = attributes.name || attributes.property || attributes["http-equiv"];
    if (key && attributes.content != null) meta[key.toLowerCase()] = attributes.content;
  }

  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    if (attributes.rel === "canonical" || attributes.rel === "alternate") {
      links.push({
        href: attributes.href || null,
        hreflang: attributes.hreflang || null,
        rel: attributes.rel,
      });
    }
  }

  return {
    title: extractTagText(html, "title"),
    description: meta.description || null,
    robots: meta.robots || null,
    openGraph: Object.fromEntries(
      Object.entries(meta)
        .filter(([key]) => key.startsWith("og:"))
        .sort(([left], [right]) => left.localeCompare(right)),
    ),
    twitter: Object.fromEntries(
      Object.entries(meta)
        .filter(([key]) => key.startsWith("twitter:"))
        .sort(([left], [right]) => left.localeCompare(right)),
    ),
    links: links.sort((left, right) =>
      `${left.rel}|${left.hreflang}|${left.href}`.localeCompare(
        `${right.rel}|${right.hreflang}|${right.href}`,
      ),
    ),
  };
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, sortObject(child)]),
  );
}

function extractStructuredData(html) {
  const values = [];

  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      values.push(sortObject(JSON.parse(decodeHtml(match[1]))));
    } catch (error) {
      values.push({ parseError: error.message, rawHash: sha256(match[1].trim()) });
    }
  }

  return values;
}

function extractInternalLinks(html) {
  const links = new Set();

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = parseAttributes(match[0]).href;
    if (!href) continue;

    try {
      const url = new URL(href, "https://www.eudebtmap.com");
      if (url.hostname === "www.eudebtmap.com") links.add(`${url.pathname}${url.search}`);
    } catch {
      // Ignore malformed links; existing SEO tests cover invalid public routes.
    }
  }

  return [...links].sort();
}

function extractMain(html) {
  return html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || html;
}

function snapshotHtml(html) {
  const htmlAttributes = parseAttributes(html.match(/<html\b[^>]*>/i)?.[0] || "");
  const main = extractMain(html);

  return {
    htmlLang: htmlAttributes.lang || null,
    metadata: extractMetadata(html),
    headings: extractHeadings(main),
    structuredData: extractStructuredData(html),
    internalLinks: extractInternalLinks(main),
    mainTextHash: normalizedTextHash(main),
    integrations: {
      adsense: html.includes("pagead2.googlesyndication.com"),
      consentMode: html.includes("ad_storage") && html.includes("analytics_storage"),
      vercelAnalytics: html.includes("/_vercel/insights/script.js"),
    },
  };
}

function jsonShape(value) {
  if (Array.isArray(value)) {
    return { type: "array", items: value.length ? jsonShape(value[0]) : null };
  }
  if (value === null) return "null";
  if (typeof value !== "object") return typeof value;

  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, jsonShape(child)]),
  );
}

async function fetchRoute(baseUrl, route) {
  const response = await fetch(new URL(route, baseUrl), { redirect: "manual" });
  const body = await response.text();
  const headers = Object.fromEntries(
    RESPONSE_HEADERS.map((name) => [name, response.headers.get(name)]).filter(([, value]) => value),
  );
  const contentType = response.headers.get("content-type") || "";
  const isHtml = contentType.includes("text/html");
  const isJson = contentType.includes("application/json");
  let parsedJson;
  if (isJson) {
    try {
      parsedJson = JSON.parse(body);
    } catch {
      parsedJson = null;
    }
  }

  return {
    route,
    status: response.status,
    headers,
    bodyHash:
      isHtml || isJson
        ? undefined
        : sha256(
            body
              .replace(/<lastBuildDate>.*?<\/lastBuildDate>/g, "")
              .replace(/<lastmod>.*?<\/lastmod>/g, ""),
          ),
    jsonShape: isJson && parsedJson ? jsonShape(parsedJson) : undefined,
    html: isHtml ? snapshotHtml(body) : undefined,
  };
}

async function mapWithConcurrency(values, concurrency, mapper) {
  const results = new Array(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(values[index]);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function hashTree(relativePath, filter = () => true) {
  const root = path.join(PROJECT_ROOT, relativePath);
  const files = [];

  async function walk(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolutePath);
      else if (filter(absolutePath)) files.push(absolutePath);
    }
  }

  await walk(root);
  const hash = crypto.createHash("sha256");
  for (const file of files) {
    hash.update(path.relative(PROJECT_ROOT, file).replaceAll("\\", "/"));
    hash.update(await fs.readFile(file));
  }

  return { count: files.length, sha256: hash.digest("hex") };
}

async function captureFileIntegrity() {
  return {
    content: await hashTree("content"),
    public: await hashTree("public"),
    eurostatGenerated: await hashTree(
      "lib",
      (file) => /eurostat.*\.gen\.js$/i.test(path.basename(file)),
    ),
  };
}

async function main() {
  const options = readArguments(process.argv.slice(2));
  const baseUrl = new URL(options.baseUrl);
  const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl));
  if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);

  const sitemap = await sitemapResponse.text();
  const publicUrls = [...sitemap.matchAll(/<loc>(https:\/\/www\.eudebtmap\.com[^<]*)<\/loc>/g)]
    .map((match) => new URL(match[1]))
    .map((url) => `${url.pathname}${url.search}`);
  const routes = [...new Set([...publicUrls, ...EXTRA_ROUTES])].sort();
  const routeSnapshots = await mapWithConcurrency(routes, 8, (route) =>
    fetchRoute(baseUrl, route),
  );
  const failures = routeSnapshots.filter((snapshot) => snapshot.status >= 400);
  if (failures.length) {
    throw new Error(
      `Baseline routes returned errors: ${failures
        .map(({ route, status }) => `${route} (${status})`)
        .join(", ")}`,
    );
  }

  const packageJson = JSON.parse(await fs.readFile(path.join(PROJECT_ROOT, "package.json"), "utf8"));
  const result = {
    schemaVersion: 1,
    label: options.label,
    capturedAt: new Date().toISOString(),
    baseUrl: baseUrl.toString(),
    versions: {
      next: packageJson.dependencies.next,
      react: packageJson.dependencies.react,
      reactDom: packageJson.dependencies["react-dom"],
    },
    fileIntegrity: await captureFileIntegrity(),
    sitemap: {
      routeCount: publicUrls.length,
      routes: [...new Set(publicUrls)].sort(),
    },
    routes: routeSnapshots,
  };

  const outputPath = path.resolve(options.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(
    `[migration-baseline] ${result.routes.length} routes captured (${result.sitemap.routeCount} sitemap URLs) -> ${outputPath}`,
  );
  console.log(
    `[migration-baseline] NL routes: ${result.sitemap.routes.filter((route) => route === "/nl" || route.startsWith("/nl/")).length}`,
  );
}

main().catch((error) => {
  console.error(`[migration-baseline] ${error.stack || error.message}`);
  process.exitCode = 1;
});
