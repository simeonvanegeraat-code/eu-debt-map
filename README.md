# EU Debt Map

* JavaScript-only Next.js 14 App Router (works on Vercel)
* Europe map with `react-simple-maps` (no jvectormap)
* Country pages show a live debt estimate and an official Eurostat debt-to-GDP ratio.
* Official data is stored locally so normal builds do not depend on a live Eurostat response.

## Quarterly data update

Run these commands from the project folder:

```bash
npm run update:data
npm test
npm run build
```

`update:data` refreshes both official debt (`MIO_EUR`) and official debt-to-GDP ratios (`PC_GDP`). Generated files are validated before they replace the last-known-good snapshots. If one country is temporarily missing, its previous valid value is retained while the other countries can update.

Do not edit these generated files manually:

* `lib/eurostat.debt.gen.js`
* `lib/eurostat.debt.history.gen.js`
* `lib/eurostat.ratio.gen.js`

## Deploy

Review the local changes, commit and push them to GitHub. Vercel will install and build automatically. The data scripts themselves do not deploy anything.

For local development: `npm install`, then `npm run dev`.

