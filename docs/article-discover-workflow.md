# Article quality and Google Discover workflow

This workflow improves eligibility and presentation quality; it cannot guarantee
Google Discover traffic. Discover does not require a special tag or schema type.
The `contentStandard` field is an internal EU Debt Map quality gate only.

## Create a draft

```bash
npm run new:article -- nl 2026 voorbeeld-artikel "Voorbeeldtitel"
```

The command refuses to overwrite an existing article. A new draft deliberately
fails the strict quality check until the content, sources and image information
have been completed. Local development (`npm run dev`) remains available while
the draft is being written.

## Before publication

1. Answer the main question quickly and add original analysis or a useful data
   comparison. Do not use clickbait or exaggeration.
2. Prefer primary and authoritative sources. Record the source name, URL and the
   date on which it was checked.
3. Choose the appropriate visual lane in `docs/article-image-style.md` and use an
   original, relevant hero image. It should be at least 1,200 pixels wide and
   more than 300,000 pixels in total. A 16:9 crop is preferred. Record the
   measured `imageWidth` and `imageHeight`; the audit compares these values with
   the real file. Generated scenes are credited as editorial illustrations and
   must not be presented as photographs of real events.
4. Write meaningful alternative text and keep the large-image preview enabled.
5. Add descriptive internal links to the relevant country page, debt-to-GDP page
   and methodology.
6. Set `dateModified` and `dateReviewed` only after a substantive update or a real
   editorial review. Do not change dates merely to make an article look recent.
7. Keep at most one `<!-- MID_ARTICLE_AD -->` marker. Consent and AdSense scripts
   stay in the shared site configuration, never inside article HTML.

Run the checks before creating a pull request:

```bash
npm run audit:articles
npm test
npm run build
```

## Updating and consolidating old articles

- Inspect page-level Search Console data before changing or retiring a URL.
- Prefer a substantive update on a URL that already performs well.
- Consolidate overlapping pages only when they answer the same search intent.
- Use one permanent redirect to the closest replacement and update internal links
  and the sitemap through the normal application code.
- Keep old URLs when their search intent or useful historical context is distinct.

Legacy articles are reported as an improvement backlog but do not fail the build.
Once an article has been fully revised, add
`"contentStandard": "discover-2026-v1"`; from that point its mechanical quality
checks become mandatory.
