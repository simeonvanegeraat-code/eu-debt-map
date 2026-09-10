# EU Debt Map design direction

## Product preference

- Do not use green or mint as a recurring brand or interface accent. Reserve green only for data where its conventional meaning is necessary, such as an explicitly positive status.
- Prefer deep navy, EU blue, cool white, slate, warm ivory and restrained brass accents.
- Aim for a calm financial-research or advisory publication rather than a generic fintech dashboard.

## Layout preference

- Avoid walls of rounded cards. Use typography, whitespace, alignment, hairline dividers and section contrast as the primary hierarchy.
- Use a bordered or filled container only when it clarifies an interactive tool, warning, state or independently actionable item.
- Prefer open editorial rows, tables, timelines and grouped lists for explanatory content.
- Keep official sources and advertising visually distinct. An advertisement must never resemble an official link, broker recommendation or purchase action.

Recorded from the product owner's feedback on 3 September 2026.

## Shared page backgrounds

Revised on 9 September 2026 after the owner compared the first unified preview with the original country-page background. Use the original country design as the shared reference, with its depth, subtle blue glow and soft transition into the page canvas.

- Use `--surface-page` (`#f7f9fc`) for the page canvas and `--surface-panel` (`#ffffff`) for content panels.
- Use `--surface-dark` (`#07182f`) for solid dark surfaces.
- Use `--surface-hero` for introductory sections: deep navy `#07182f`, blue `#0c2e62`, the shared subtle radial glow and a soft fade through `#245ca8`, `#83a7d8` and `#dfe9f7` into the page canvas.
- Reserve at least `--surface-hero-fade-height` below the hero content. The fade uses an explicit responsive length instead of percentages of total hero height, so long mobile content remains on the dark background. Dark text on the country scroll cue can overlap this transition.
- Use `--surface-feature` for contained dark explanatory sections. This shares the navy/blue palette but stays dark behind its text throughout.
- Define these tokens once in `app/globals.css`. Page modules must reuse them instead of defining their own blue hero gradients or page canvas colors.
- Reuse the shared glow and transition without adding page-specific glows, grids or rings. Light editorial openings remain light within the same theme.
- Keep data visualization palettes and semantic warning/status colors independent from page surfaces.
