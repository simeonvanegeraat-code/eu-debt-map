const fs = require("node:fs");
const path = require("node:path");

const ARTICLE_STANDARD = "discover-2026-v1";
const ARTICLE_AD_MARKER = "<!-- MID_ARTICLE_AD -->";
const SUPPORTED_LANGUAGES = new Set(["en", "nl", "de", "fr"]);
const MIN_LARGE_IMAGE_WIDTH = 1200;
const MIN_LARGE_IMAGE_PIXELS = 300000;
const TARGET_IMAGE_RATIO = 16 / 9;

function readJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
    0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);
  let offset = 2;

  while (offset + 3 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (buffer[offset] === 0xff) offset += 1;

    const marker = buffer[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 1 >= buffer.length) return null;

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) return null;

    if (startOfFrameMarkers.has(marker) && segmentLength >= 7) {
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3),
      };
    }
    offset += segmentLength;
  }

  return null;
}

function readPngDimensions(buffer) {
  const signature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== signature) {
    return null;
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function readWebpDimensions(buffer) {
  if (
    buffer.length < 30 ||
    buffer.subarray(0, 4).toString("ascii") !== "RIFF" ||
    buffer.subarray(8, 12).toString("ascii") !== "WEBP"
  ) {
    return null;
  }

  const chunkType = buffer.subarray(12, 16).toString("ascii");
  if (chunkType === "VP8X") {
    return {
      width: readUInt24LE(buffer, 24) + 1,
      height: readUInt24LE(buffer, 27) + 1,
    };
  }
  if (chunkType === "VP8L" && buffer[20] === 0x2f) {
    const b1 = buffer[21];
    const b2 = buffer[22];
    const b3 = buffer[23];
    const b4 = buffer[24];
    return {
      width: 1 + (((b2 & 0x3f) << 8) | b1),
      height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6)),
    };
  }
  if (
    chunkType === "VP8 " &&
    buffer.length >= 30 &&
    buffer[23] === 0x9d &&
    buffer[24] === 0x01 &&
    buffer[25] === 0x2a
  ) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  return null;
}

function readImageDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  return (
    readPngDimensions(buffer) ||
    readJpegDimensions(buffer) ||
    readWebpDimensions(buffer)
  );
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validDate(value) {
  if (!isNonEmptyString(value)) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function plainTextWordCount(html = "") {
  return String(html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function resolvePublicImage(root, image) {
  if (!isNonEmptyString(image) || /^https?:\/\//i.test(image)) return null;

  const publicRoot = path.resolve(root, "public");
  const relativeImage = image.replace(/^\/+/, "");
  const resolved = path.resolve(publicRoot, relativeImage);
  if (resolved !== publicRoot && !resolved.startsWith(`${publicRoot}${path.sep}`)) {
    return null;
  }
  return resolved;
}

function inspectArticle(article, { root = process.cwd(), file = "article.json" } = {}) {
  const enforced = article?.contentStandard === ARTICLE_STANDARD;
  const issues = [];

  function issue(code, message, preferredLevel = "error") {
    issues.push({
      code,
      message,
      level: enforced ? preferredLevel : "warning",
      file,
    });
  }

  for (const field of ["slug", "title", "seoTitle", "summary", "primaryTopic", "articleType", "imageAlt", "imageCredit", "sourceNote", "body"]) {
    if (!isNonEmptyString(article?.[field])) {
      issue(`missing-${field}`, `${field} is required`);
    }
  }

  if (!SUPPORTED_LANGUAGES.has(article?.lang)) {
    issue("invalid-language", "lang must be en, nl, de or fr");
  }
  if (!Array.isArray(article?.tags) || article.tags.length === 0) {
    issue("missing-tags", "at least one descriptive tag is required");
  } else if (article.tags.some((tag) => !isNonEmptyString(tag))) {
    issue("invalid-tags", "every tag must be a non-empty string");
  }
  if (!Array.isArray(article?.relatedCountries)) {
    issue("invalid-related-countries", "relatedCountries must be an array");
  }
  if (!Array.isArray(article?.relatedLinks) || article.relatedLinks.length === 0) {
    issue("missing-related-links", "at least one relevant internal link is required");
  } else {
    article.relatedLinks.forEach((link, index) => {
      if (!isNonEmptyString(link?.label) || !isHttpUrl(link?.url)) {
        issue(
          "invalid-related-link",
          `related link ${index + 1} must contain a label and an absolute URL`
        );
      }
    });
  }
  if (!Number.isFinite(article?.readingMinutes) || article.readingMinutes <= 0) {
    issue("invalid-reading-minutes", "readingMinutes must be a positive number");
  }

  for (const field of ["datePublished", "dateModified", "dateReviewed"]) {
    if (!validDate(article?.[field])) {
      issue(`invalid-${field}`, `${field} must be a valid date`);
    }
  }
  if (
    validDate(article?.datePublished) &&
    validDate(article?.dateModified) &&
    new Date(article.dateModified) < new Date(article.datePublished)
  ) {
    issue("modified-before-published", "dateModified cannot be earlier than datePublished");
  }

  for (const [field, value] of [["author", article?.author], ["reviewedBy", article?.reviewedBy]]) {
    if (!isNonEmptyString(value?.name) || !isHttpUrl(value?.url)) {
      issue(`invalid-${field}`, `${field} must contain a name and an absolute URL`);
    }
  }

  if (!Array.isArray(article?.sources) || article.sources.length === 0) {
    issue("missing-sources", "at least one primary or authoritative source is required");
  } else {
    article.sources.forEach((source, index) => {
      if (!isNonEmptyString(source?.name) || !isHttpUrl(source?.url) || !validDate(source?.accessed)) {
        issue(
          "invalid-source",
          `source ${index + 1} must contain a name, absolute URL and accessed date`
        );
      }
    });
  }

  const imageFile = resolvePublicImage(root, article?.image);
  if (!imageFile) {
    issue("invalid-image-path", "image must be a local path inside public/");
  } else if (!fs.existsSync(imageFile)) {
    issue("missing-image-file", `image file does not exist: ${article.image}`);
  } else {
    let actual = null;
    try {
      actual = readImageDimensions(imageFile);
    } catch {
      actual = null;
    }
    if (!actual) {
      issue("unreadable-image", `image dimensions could not be read: ${article.image}`);
    } else {
      const declaredWidth = Number(article.imageWidth);
      const declaredHeight = Number(article.imageHeight);
      if (
        !Number.isInteger(declaredWidth) ||
        !Number.isInteger(declaredHeight) ||
        declaredWidth <= 0 ||
        declaredHeight <= 0
      ) {
        issue("missing-image-dimensions", "imageWidth and imageHeight must be measured and recorded");
      } else if (declaredWidth !== actual.width || declaredHeight !== actual.height) {
        issue(
          "incorrect-image-dimensions",
          `declared ${declaredWidth}x${declaredHeight}, actual ${actual.width}x${actual.height}`
        );
      }

      if (actual.width < MIN_LARGE_IMAGE_WIDTH) {
        issue(
          "image-too-narrow",
          `image is ${actual.width}px wide; the large-image target is at least ${MIN_LARGE_IMAGE_WIDTH}px`
        );
      }
      if (actual.width * actual.height <= MIN_LARGE_IMAGE_PIXELS) {
        issue(
          "image-too-small",
          `image has ${actual.width * actual.height} pixels; target more than ${MIN_LARGE_IMAGE_PIXELS}`
        );
      }

      const ratioDifference = Math.abs(actual.width / actual.height - TARGET_IMAGE_RATIO);
      if (ratioDifference > 0.05) {
        issue(
          "non-ideal-image-ratio",
          `image ratio is ${actual.width}:${actual.height}; a 16:9 editorial crop is preferred`,
          "warning"
        );
      }
    }
  }

  const markerCount = String(article?.body || "").split(ARTICLE_AD_MARKER).length - 1;
  if (markerCount > 1) {
    issue("too-many-ad-markers", "article body may contain at most one manual ad marker");
  }
  if (plainTextWordCount(article?.body) < 600) {
    issue(
      "short-article",
      "article contains fewer than 600 words; verify that it provides enough original value",
      "warning"
    );
  }

  return {
    enforced,
    errors: issues.filter((item) => item.level === "error"),
    warnings: issues.filter((item) => item.level === "warning"),
    issues,
  };
}

function listArticleFiles(root = process.cwd()) {
  const contentRoot = path.join(root, "content", "articles");
  if (!fs.existsSync(contentRoot)) return [];

  const files = [];
  const stack = [contentRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const filePath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(filePath);
      if (entry.isFile() && entry.name.endsWith(".json")) files.push(filePath);
    }
  }
  return files.sort();
}

function inspectArticleCollection(root = process.cwd()) {
  return listArticleFiles(root).map((filePath) => {
    const file = path.relative(root, filePath);
    const raw = fs.readFileSync(filePath, "utf8");

    try {
      const article = JSON.parse(raw);
      return { file, article, ...inspectArticle(article, { root, file }) };
    } catch (error) {
      const enforced = raw.includes(ARTICLE_STANDARD);
      const item = {
        code: "invalid-json",
        message: `article JSON cannot be parsed: ${error.message}`,
        level: enforced ? "error" : "warning",
        file,
      };
      return {
        file,
        article: null,
        enforced,
        errors: enforced ? [item] : [],
        warnings: enforced ? [] : [item],
        issues: [item],
      };
    }
  });
}

module.exports = {
  ARTICLE_STANDARD,
  MIN_LARGE_IMAGE_PIXELS,
  MIN_LARGE_IMAGE_WIDTH,
  inspectArticle,
  inspectArticleCollection,
  listArticleFiles,
  plainTextWordCount,
  readImageDimensions,
};
