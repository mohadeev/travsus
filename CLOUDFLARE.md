# Deploying to Cloudflare Workers

The site builds two ways from the same code:

| | Build | Run / deploy |
|---|---|---|
| Next.js (Vercel, Node) | `npm run build` | `npm start` / Vercel |
| Cloudflare Workers (vinext) | `npm run build:vinext` | `npm run deploy:vinext` |

Local Worker: `npm run build:vinext && npx wrangler dev` (real Workers runtime, reads `.env`).
Dev server with hot reload: `npm run dev:vinext`.

The Worker is `travsus`, set in [wrangler.jsonc](wrangler.jsonc) with `nodejs_compat`.
Free plan limit: 3 MiB gzipped. Current size (`npx wrangler deploy --dry-run`):
**Total Upload 10231 KiB / gzip 2740 KiB (2.68 MiB)**.

## Page cache (Workers KV)

Public pages (home, tours, destinations, about, legal pages…) are rendered once
and then served from a cache for an hour (`revalidate = 3600`); after that the
cached page is still served while a fresh one is rendered in the background.
Data caches (`unstable_cache`, cached `fetch`) use the same store.

The cache lives in a **Workers KV namespace with the binding name
`VINEXT_KV_CACHE`** (set in [wrangler.jsonc](wrangler.jsonc), used by
`kvDataAdapter()` in [vite.config.ts](vite.config.ts)), so every Worker instance
shares it. Create it once:

```sh
npx wrangler kv namespace create VINEXT_KV_CACHE
```

and put the `id` it prints in `wrangler.jsonc`:

```jsonc
"kv_namespaces": [{ "binding": "VINEXT_KV_CACHE", "id": "<the id>" }]
```

(Without an `id`, `wrangler deploy` creates a namespace by itself.)

Cached pages are sent with `Cache-Control: public, s-maxage=3600,
stale-while-revalidate=86400`, and [src/cloudflare/worker.ts](src/cloudflare/worker.ts)
also keeps a copy of each cached page in Cloudflare's edge cache (works on a
custom domain, not on `*.workers.dev`), so most visits don't run the page at
all. Pages for one visitor (account, checkout, search, dashboard) stay
`private, no-store`. Ad click ids (`gclid`, `utm_*`, `fbclid`…) are ignored
by the server so ad visitors get the cached page too; the browser keeps them
in the address for analytics.

Free plan KV limits: 100,000 reads and **1,000 writes per day**. Each page
written to the cache counts as a write (an hourly refresh of a visited page is
one more), so don't warm every page at once on the free plan
(`--warm-cache` renders every tour in every language: about 1,700 pages).



Secrets never go in the repo. Set them in the Cloudflare dashboard
(Workers → travsus → Settings → Variables and Secrets) or with
`npx wrangler secret put NAME`. For `wrangler dev`, put them in `.env` or
`.dev.vars` (both are gitignored).

**`NEXT_PUBLIC_*` variables are written into the code when it's built**, so they
have to be set wherever `npm run build:vinext` runs (your shell, or the build
settings in Workers Builds), not only as Worker variables.

### Read by the site's code (`process.env.*`)

| Variable | Needed | Used for |
|---|---|---|
| `DATABASE_URL` | **required** (startup fails without it) | MongoDB connection string (main database) |
| `DATABASE_URL_PLACES` | optional | Separate MongoDB for geography; defaults to `DATABASE_URL` |
| `MONGODB_DB` | optional | Main database name; defaults to `travsus` |
| `CLOUDINARY_CLOUD_NAME` | required | Image uploads and deletes |
| `CLOUDINARY_API_KEY` | required | Image uploads and deletes |
| `CLOUDINARY_API_SECRET` | required | Signing Cloudinary requests |
| `CLOUDINARY_URL` | optional | `cloudinary://key:secret@cloud`, read when the three above are missing |
| `CLOUDINARY_UPLOAD_PRESET` | optional | Unsigned upload preset (reviews photos) |
| `STRIPE_SECRET_KEY` | required | Payments |
| `STRIPE_WEBHOOK_SECRET` | required | Verifying `/api/webhook` calls from Stripe |
| `CRON_SECRET` | required | Protects `/api/cron/*`; the Worker's cron jobs send it too |
| `OPENAI_API_KEY` | optional | Itinerary generation, AI features |
| `SENDGRID_API_KEY` | optional | Email (SendGrid) |
| `SMTP_HOST` | optional | Email (SMTP) |
| `SMTP_PORT` | optional | Email (SMTP) |
| `SMTP_USER` | optional | Email (SMTP) |
| `SMTP_PASS` | optional | Email (SMTP) |
| `MAILRELAY_ACCOUNT` | optional | Newsletter (Mailrelay) |
| `MAILRELAY_API_KEY` | optional | Newsletter (Mailrelay) |
| `MAILRELAY_GROUP_ID` | optional | Newsletter (Mailrelay) |
| `NEXT_PUBLIC_SITE_URL` | build time | Site address for links, sitemap and the cron jobs (default `https://www.travsus.com`) |
| `NEXT_PUBLIC_COMPANY_PROFILE` | build time | Company details on legal pages and booking PDFs |
| `NEXT_PUBLIC_LEGAL_NAME` | build time | Legal pages |
| `NEXT_PUBLIC_LEGAL_LOCATION` | build time | Legal pages |
| `NEXT_PUBLIC_EXTERNAL_SERVER` | build time | External API address |
| `NEXT_PUBLIC_BACK_END_URL` | build time | Back-end API address |
| `NEXT_PUBLIC_GOOGLE_MAP_API_KEY` | build time | Google Maps |
| `NEXT_PUBLIC_GOOGLE_MAP_ID` | build time | Google Maps |
| `NODE_ENV` | set automatically | `production` in builds; don't set it |
| `CLOUDFLARE_BUILD` | set automatically | Set by `npm run build:vinext`; don't set it |

### Read by libraries

| Variable | Needed | Used for |
|---|---|---|
| `CLERK_SECRET_KEY` | required | Sign-in (Clerk, server side) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | required, build time | Sign-in (Clerk, browser) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | optional, build time | Clerk sign-in page |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | optional, build time | Clerk sign-up page |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | optional, build time | Clerk redirect after sign-in |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | optional, build time | Clerk redirect after sign-up |

Other variables in the Vercel project (`NEXTAUTH_*`, `SUPABASE_*`, `POSTMARK_API_TOKEN`,
`TRIPADVISOR_ACCESS_TOKEN`, `AWS_*`, `BREVO_API_KEY`, `ZOHO_*`, social login
IDs and so on) aren't read anywhere in `src/` and don't need copying.

## Daily jobs

Vercel Cron (`vercel.json`) is replaced on Cloudflare by Cron Triggers in
`wrangler.jsonc`, on the same schedules in UTC:

- `0 6 * * *` → `/api/cron/charge-balances`
- `0 9 * * *` → `/api/cron/invite-reminders`

[src/cloudflare/worker.ts](src/cloudflare/worker.ts) calls each route with
`Authorization: Bearer $CRON_SECRET`, the same way Vercel did. The Worker
needs `CRON_SECRET` and `NEXT_PUBLIC_SITE_URL`. **If Vercel stays live while the
Worker runs, both will run the jobs.** Only one of them should keep them
(charge-balances charges cards).

## What is different in the Cloudflare build

All of this lives in [vite.config.ts](vite.config.ts) and `src/lib/cloudflare/`.
The Next.js build doesn't use any of it.

- **Texts** (`public/messages/*.json`) are read from static assets instead of
  being bundled, which keeps the Worker under 3 MiB.
- **Images**: vinext ignores `images.loaderFile`, so Cloudinary photos go
  through `src/lib/cloudflare/image.tsx`, which keeps the same resized URLs and srcset.
- **Cloudinary**: the Node SDK is replaced by a small REST version with the
  same calls (`upload`, `destroy`).
- **Booking PDF**: the yoga-layout WebAssembly is loaded as a module (Workers
  can't compile WebAssembly at runtime). Only built-in PDF fonts work on the
  server, not `.woff2`.
- **Database**: each request opens its own MongoDB connection, because Workers
  can't share sockets between requests.

## Things to watch

- **CPU time on the free plan** is 10 ms per request. Server-rendering large
  pages (home, tour pages) can go over that, which shows up as error 1102. If
  it does, the paid Workers plan ($5/month) raises the limit to 30 s.
- **Middleware redirects** for old tour links call the site's own
  `/api/tours/{id}/slug`. They worked in the local Workers runtime. If they
  stop on the live domain, the old links simply aren't redirected (pages still load).
- **Edits show up within an hour** on cached pages (tours, destinations).
  Saving a tour or review clears the tour catalog cache right away
  (`revalidateTag`), as on Vercel.
- The admin "Site texts" panel is read-only on the Worker, as on Vercel. Edit
  texts locally with `npm run dev`.
