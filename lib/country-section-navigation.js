function activeCountrySection(sections, readingLine, atBottom = false) {
  if (!sections.length) return null;
  if (atBottom) return sections.at(-1).id;
  let current = sections[0].id;
  for (const section of sections) {
    if (section.top <= readingLine) current = section.id;
  }
  return current;
}

module.exports = { activeCountrySection };
