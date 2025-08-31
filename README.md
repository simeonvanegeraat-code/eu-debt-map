# EU Debt Map (Clean JS Build)

- JavaScript-only Next.js 14 App Router to reduce deploy errors on Vercel
- Alias via `jsconfig.json` (`@/*`)
- ESLint won't block builds (`next.config.mjs`)
- Europe map with `react-simple-maps`
- Country page with a ticking estimate + sparkline (Recharts)
- Demo data in `lib/data.js`

## Local
```bash
npm install
npm run dev
```

## Deploy
Push to GitHub → Vercel (Add New → Project → Import → Deploy)
