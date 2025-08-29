# EU Debt Map (MVP)

Interactive EU map with per-country ticking debt meter (estimated), country pages with sparkline, and AdSense integration.

## Quick start
1. `npm install`
2. `npm run dev`  (http://localhost:3000)

## Deploy
- Vercel: import the repo → default settings.
- Netlify: Next.js build (`next build`) + `netlify.toml` if needed.

## Configure
- `app/sitemap.ts`: replace `https://example.com` with your domain.
- `app/layout.tsx`: set your AdSense client id.
- `data/eu.json`: replace demo values with official data.
