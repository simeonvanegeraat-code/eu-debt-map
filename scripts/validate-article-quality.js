const path = require("node:path");

const {
  ARTICLE_STANDARD,
  inspectArticleCollection,
} = require("../lib/articleQualityCore.cjs");

function summarizeIssues(results) {
  const counts = new Map();
  const examples = new Map();

  for (const result of results) {
    for (const issue of result.warnings) {
      counts.set(issue.code, (counts.get(issue.code) || 0) + 1);
      const current = examples.get(issue.code) || [];
      if (current.length < 3) current.push(result.file);
      examples.set(issue.code, current);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([code, count]) => ({ code, count, examples: examples.get(code) }));
}

function validateArticleQuality(root = process.cwd()) {
  const results = inspectArticleCollection(root);
  const enforced = results.filter((result) => result.enforced);
  const legacy = results.filter((result) => !result.enforced);
  const errors = enforced.flatMap((result) => result.errors);

  console.log(
    `[article-quality] ${results.length} articles checked; ` +
      `${enforced.length} use ${ARTICLE_STANDARD}; ${legacy.length} remain in the legacy backlog.`
  );

  for (const error of errors) {
    console.error(`[article-quality] ERROR ${error.file}: ${error.message}`);
  }

  const summary = summarizeIssues(legacy);
  if (summary.length) {
    console.log("[article-quality] Legacy improvement backlog (does not block the build):");
    for (const item of summary) {
      console.log(
        `  - ${item.code}: ${item.count} (${item.examples.join(", ")})`
      );
    }
  }

  if (errors.length) {
    throw new Error(`${errors.length} required article quality check(s) failed`);
  }

  console.log("[article-quality] OK");
  return { results, enforced, legacy, errors, summary };
}

if (require.main === module) {
  try {
    validateArticleQuality(path.resolve(process.cwd()));
  } catch (error) {
    console.error(`[article-quality] FAILED: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { summarizeIssues, validateArticleQuality };
