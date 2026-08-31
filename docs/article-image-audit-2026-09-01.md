# Article image audit — 2026-09-01

## Scope and outcome

- Audited all 60 published article JSON files and their 37 unique hero-image references.
- Rechecked the 29 older image groups that remained after the first editorial-image refresh.
- Kept 3 existing photographic still-life images that already match the current standard.
- Replaced 26 older image references across 45 articles with 25 new assets. The two previous EU debt-burden variants now share one multilingual hero image.
- The published collection now uses 36 unique hero images: 8 approved assets from the first refresh, 3 retained still lifes, and 25 assets from this refresh.
- Previous files remain in `public/images/articles` for safe rollback, but published article JSON no longer references the rejected versions.

## Images retained

- `digital-euro-2026-editorial.jpg`
- `france-debt-outlook-2026-editorial.jpg`
- `rentelasten-staatsschuld-nederland-2027-editorial.jpg`

These images already use a credible editorial still life, avoid identifiable people and readable documents, and remain specific to their article topics.

## Rejection reasons

Older images were replaced when they contained one or more of the following:

- repeated isometric or three-dimensional country maps;
- invented dashboards, figures, charts, labels, or financial documents;
- generated analysts, meetings, hands, or identifiable people;
- prominent flags, logos, seals, or other unnecessary national symbols;
- a generic visual template that did not explain the article's specific subject.

Generated candidates were also rejected during production if people, flag shapes, or pseudo-text appeared despite the prompt constraints.

## Final production prompt set

All 25 assets were generated with the built-in image-generation tool in `photorealistic-natural` mode. The shared prompt was:

> Create an original photographic-looking editorial still life for an EU Debt Map article. Use sober, credible European financial-journalism art direction, a 16:9 landscape composition with a central safe area, strong thumbnail readability, soft natural daylight, and a restrained navy, slate, cream, and warm-brass palette. Do not portray a real documented event. No people, hands, body parts, readable documents, text, numbers, charts, maps, flags, logos, emblems, seals, signatures, recognizable banknote designs, watermarks, or sensational crisis imagery. Keep any architecture softly out of focus and geographically plausible.

Each image then received one topic-specific object brief:

| Asset | Topic-specific composition |
| --- | --- |
| `deutschland-staatsverschuldung-2026-editorial-v2.jpg` | Quarterly debt ledger, bond-maturity folders, clock, calculator, and measured coin stacks in a Berlin finance office. |
| `eu-debt-burden-2026-editorial-v2.jpg` | Distinct national debt folders around a central aggregate ledger with differing coin stacks. |
| `eu-debt-explained-adding-up-2026-editorial-v2.jpg` | Multiple national public-finance folders feeding into one thick aggregate ledger. |
| `eu-debt-ownership-2026-editorial-v2.jpg` | Central government-bond stack distributed to four investor trays. |
| `eu-debt-per-capita-2026-editorial-v3.jpg` | Wooden person tokens, national folders, and differing coin stacks. |
| `eu-debt-trend-2026-editorial-v2.jpg` | Four quarterly folders with uneven coin stacks and a blank calendar. |
| `eu-debt-update-ratio-total-2026-editorial-v2.jpg` | Debt folders measured against a broader national-output ledger with a proportional divider. |
| `eu-defense-government-debt-2026-editorial-v2.jpg` | Neutral defence-procurement objects balanced against bond folders and coins. |
| `eu-interest-public-services-2026-editorial-v2.jpg` | Budget desk divided between debt interest, education, and healthcare. |
| `europe-government-debt-refinancing-costs-2026-editorial-v2.jpg` | Thin older bond folder leading to thicker replacement folders and higher coin stacks. |
| `europe-public-investment-debt-tradeoff-2026-editorial-v2.jpg` | Infrastructure plans, bridge-and-rail model, public-bond folder, balance, and coins. |
| `eurozone-debt-risks-2026-editorial-v2.jpg` | Blank sovereign-bond folders, calendar, balance, and calculator on a Frankfurt desk. |
| `france-debt-counter-2026-editorial-v2.jpg` | Paris quarterly debt folders, unlabeled clock, calculator, and coin stacks. |
| `france-fuel-support-2026-editorial-v2.jpg` | Empty unbranded fuel pump with a blank receipt, support folder, and neutral tokens. |
| `france-public-debt-q1-2026-editorial-v2.jpg` | Paris quarterly ledger, debt folders, calculator, and measured coin stacks. |
| `global-currency-debt-impact-2026-editorial-v2.jpg` | Two neutral currency trays, sovereign-bond folders, balance, and calculator. |
| `hollandse-paradox-lage-staatsschuld-2026-editorial-v2.jpg` | Compact debt folder balanced against infrastructure, healthcare, and ageing obligations. |
| `nederland-staatsschuld-2026-editorial-v2.jpg` | The Hague quarterly debt folders, unlabeled clock, calculator, and coin stacks. |
| `netherlands-debt-live-eurostat-update-editorial-v2.jpg` | Four quarterly folders with descending coin stacks and an unlabeled clock. |
| `prinsjesdag-2026-begroting-nederland-editorial-v2.jpg` | Closed budget folder with cream ribbon, blank calendar, balance, and calculator. |
| `schuldenbremse-deutschland-2026-editorial-v2.jpg` | Clasped budget ledger, infrastructure plans, and a bridge-and-rail model. |
| `sweden-debt-2026-editorial-v2.jpg` | Stockholm quarterly folders, unlabeled clock, and non-linear coin stacks. |
| `us-europe-debt-capacity-2026-editorial-v2.jpg` | Symmetrical US and European bond-folder sets around a central balance. |
| `wer-haelt-deutsche-staatsschulden-2026-editorial-v2.jpg` | German bond documents distributed from one stack to four investor depots. |
| `wie-bezit-nederlandse-staatsschuld-2026-editorial-v2.jpg` | Dutch bond documents divided among four distinct investor depots. |

## Publication checks

For every updated article:

- the image dimensions are `1672 × 941`;
- alt text describes the visible composition in the article language;
- the image credit is localized;
- publication, modification, and review dates are unchanged because the editorial text was not substantively revised.

The reusable policy remains in [`article-image-style.md`](./article-image-style.md).
