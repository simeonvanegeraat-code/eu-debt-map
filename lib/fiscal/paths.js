// New fiscal routes use explicit language codes; the legacy locale helper expects "" for English.
function fiscalPath(path, lang = "en") {
  const prefix = ["nl", "de", "fr"].includes(lang) ? `/${lang}` : "";
  return `${prefix}${path === "/" && prefix ? "" : path}`;
}
module.exports = { fiscalPath };
