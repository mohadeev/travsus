# TRAVSUS

Tour booking site: Next.js 14 (App Router), MongoDB Atlas, Clerk sign-in, Stripe payments, 10 languages (next-intl). Deployed on Vercel from `main`.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3001
```

Secrets go in `.env.local` (never committed); see `.env.local.example`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3001 |
| `npm run build` / `npm start` | Production build / server |
| `npm run db:import <file.json>` | Load a database export (`{ table: rows[] }`) into MongoDB (dry run; add `--apply` to write) |
| `npm run db:translate-tours` | Fill in missing tour translations (dry run; add `-- --apply` to save) |

## Admin panels (owner account only)

- `/en-US/admin/analytics`: live visitors and reports (first-party tracker, `src/components/AnalyticsTracker.tsx`)
- `/en-US/admin/translations`: view, edit, add and import the site texts (`messages/*.json`). Editing works when running locally; push to publish.

## Where things are

- `messages/<locale>.json`: site texts for the 10 languages (`src/i18n/routing.ts`)
- `src/app/[locale]/`: pages; `src/app/api/`: API routes
- `src/lib/`: data access (`db.ts`), payments, blog, forum, analytics
- `scripts/db/`: database scripts and SQL migrations
