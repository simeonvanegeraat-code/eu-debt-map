# EU Debt Map editorial image style

Use this standard for new articles and for articles that receive a substantive
editorial update. Existing images are replaced in small reviewed batches so
that every image remains specific to its article.

Google does not prescribe a photographic or illustrated style for Discover or
Google News. It does recommend compelling, relevant, high-quality and large
images. EU Debt Map therefore chooses its visual treatment on editorial trust
and accuracy, not on an assumed ranking shortcut.

## Choose the image lane

### News and current-affairs articles: editorial realism by default

Use a realistic editorial still life in a recognisable but softly focused
location. Show the subject through objects such as financing folders, a blank
ledger, a calculator, coins, maturity documents or institutional architecture.

- Keep the scene calm, factual and visually plausible.
- Use authentic country context without turning landmarks into the main subject.
- Prefer objects and environments over generated people.
- Do not depict an invented meeting, press moment, government decision or real
  person.
- Credit the result as an original editorial illustration, never as a news
  photograph.

This is the default lane for articles about a newly published statistic,
budget, forecast, interest bill or policy decision.

### Evergreen analysis and explainers: realistic or abstract

Use editorial realism when a still life can explain the topic honestly. Use a
polished conceptual illustration when the subject is inherently abstract, such
as debt composition, cross-country comparisons or a methodology explainer.

Abstract work may use the established deep navy, EU blue, cool white, silver
and restrained gold palette. It must still have one clear focal idea and remain
readable at card size. Do not automatically repeat the same country silhouette,
banknote texture or glowing-network composition across unrelated articles.

## Source hierarchy

Use the first suitable option:

1. An authentic photograph owned by EU Debt Map or licensed for publication,
   with complete attribution where required.
2. An original realistic editorial illustration that does not pretend to record
   a real event.
3. An original abstract illustration when abstraction is needed to explain the
   subject.

Never copy an image from a news site, search result or social post without a
clear reusable licence. A generated image must not imitate a named photographer,
publication or living artist.

## Accuracy and disclosure

- Do not show public figures or identifiable private people in generated work.
- Do not invent readable documents, official seals, signatures, headlines,
  charts or data values.
- Do not add text, numbers, labels, flags, logos or watermarks to the image.
- Do not use flames, explosions, distressed people or exaggerated red warning
  graphics unless they depict a documented event and the source permits it.
- Keep exact figures in the article's HTML, charts and tables where sources and
  updates remain visible.
- Use meaningful localized alt text that describes what is actually visible.
- Localize the credit, for example `Originele redactionele illustratie van EU
  Debt Map`, `Redaktionelle Originalillustration von EU Debt Map` or
  `Illustration éditoriale originale créée pour EU Debt Map`.
- Replacing only an image is not a substantive editorial review: do not change
  `dateModified` or `dateReviewed` for that reason alone.

## Technical requirements

- Use a 16:9 landscape composition. The current preferred export is 1672 × 941
  pixels; never go below 1,200 pixels wide or 300,000 pixels in total.
- Keep the main subject inside the central safe area so article cards and social
  previews can crop it without losing meaning.
- Use natural contrast and restrained sharpening. Avoid plastic surfaces,
  excessive glow and artificial HDR.
- Export a web-optimized JPEG for opaque images. Confirm the actual dimensions
  and record them in `imageWidth` and `imageHeight`.
- Keep `max-image-preview:large`, `og:image` and article structured data pointing
  to the same representative, crawlable image through the existing shared code.

## Reusable prompt: editorial realism

```text
Use case: editorial-realism
Asset type: EU Debt Map article hero illustration
Primary request: create a realistic editorial still life that explains [TOPIC]
Country context: a restrained institutional interior with [LOCATION] softly out of focus in the background
Objects: [SMALL SET OF TOPIC-SPECIFIC OBJECTS]
Style/medium: original photographic-looking editorial illustration, natural materials, sober European financial-journalism art direction
Composition/framing: 16:9 landscape, one clear focal idea, central safe area, readable at thumbnail size, no people
Lighting/mood: calm, analytical and trustworthy, soft natural daylight, restrained navy and warm brass accents
Constraints: do not portray a real event; no text, readable documents, numbers, charts, flags, logos, seals, signatures or watermark; no sensational crisis imagery
```

## Reusable prompt: abstract explainer

```text
Use case: stylized-concept
Asset type: EU Debt Map article hero illustration
Primary request: explain [TOPIC] with one clear country-level or European financial metaphor
Style/medium: polished editorial illustration using the EU Debt Map visual system, not a repeated template
Composition/framing: 16:9 landscape, one clear focal subject, generous negative space, central safe area, readable at thumbnail size
Lighting/mood: calm, analytical and trustworthy; soft cinematic lighting
Color palette: deep navy, EU blue, cool white and silver, restrained warm gold accents
Constraints: no text, numbers, labels, flags, logos, seals or watermark; no invented data; no sensational crisis imagery
```

## Review checklist

- Does the image explain this specific article rather than only showing “debt”?
- Could a reader mistake it for a photograph of a real event or person?
- Are the background location and objects plausible but not falsely precise?
- Is every visible document blank or unreadable?
- Does the composition still work in a small article card and a 16:9 social crop?
- Do the localized alt text and credit match the final image?
- Do the measured file dimensions match the article metadata?
- Has `npm run audit:articles` passed after the change?

Keep superseded files temporarily when an image is migrated. Remove them only
in a later, separately reviewed cleanup after the new image has been live and
verified.

## External references

- [Google Discover image guidance](https://developers.google.com/search/docs/appearance/google-discover)
- [Google Article structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google News ranking factors](https://support.google.com/news/publisher-center/answer/9606702)
- [Google News transparency and content policies](https://support.google.com/news/publisher-center/answer/6204050)
