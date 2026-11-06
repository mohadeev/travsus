# TRAVSUS on Cloudflare Containers

The normal Next.js app (`next build`, `output: "standalone"`) runs in a Docker
container on Cloudflare Containers (Workers Paid plan). A small Worker
([src/container-worker.ts](src/container-worker.ts)) receives every request and
forwards it to one of up to 3 containers; it also runs the two daily jobs.

| File | What it is |
| --- | --- |
| [Dockerfile](Dockerfile) | Builds the app and runs `node server.js` on port 8080 |
| [wrangler.container.jsonc](wrangler.container.jsonc) | Worker, container, Durable Object binding (crons off) |
| [src/container-worker.ts](src/container-worker.ts) | Forwards requests; passes settings to the container |

## Settings and secrets

Nothing secret is in the repo or the image. Set every setting the app uses
(`DATABASE_URL`, `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `CRON_SECRET`, …) as
a Worker secret; the Worker hands all of them to the container at start:

```sh
npx wrangler secret put DATABASE_URL -c wrangler.container.jsonc
```

`NEXT_PUBLIC_*` values (Clerk publishable key, Google Maps key, site URL…)
are public and written into the browser code when the image is built. Put them
in a local `.env.production` (gitignored; deleted from the final image) before
deploying. Never put secrets in that file.

## Deploy

Docker must be running (wrangler builds the image for linux/amd64 and pushes it):

```sh
npm run deploy:container        # deploy only
npm run deploy:container:warm   # deploy, then load every sitemap page once
npm run warm:cache              # just the warm-up (--only=tours, --concurrency=2, --site=...)
```

Each deploy starts with an empty edge cache (copies are keyed by deploy id),
so run the warm-up after deploying. It renders every page once in the
container and fills the edge cache of the data centre nearest to you; the
others fill on their first visit, which no longer has to render the page.

### Tours from a JSON file (not MongoDB)

Every read of the tours (tour pages, lists, search, sitemap, bookings that show
their tour...) is answered from a JSON file on the container's disk,
`/app/data/tours.json`: an exact copy of MongoDB's `tours` collection. Every
other collection is read from MongoDB as before. See src/lib/tourStore.ts.

- MongoDB stays the source of truth: every write still goes to MongoDB.
- Always in step with MongoDB: a write made by the site updates the copy before
  it returns; a MongoDB change stream applies every other change (scripts in
  scripts/db, edits in Atlas) within a fraction of a second, deletes included;
  every tour is read again at start and every 30 minutes as a safety net.
- The file is MongoDB Extended JSON (dates as `{"$date": "..."}`), so filters,
  sorting and joins give exactly what MongoDB gives (mingo runs MongoDB's query
  language on the copy). It is held in memory while the server runs.
- The container's disk is emptied on restart: the copy is read from MongoDB at
  start (the server answers at once; the first tour reads wait for it, up to
  15 s, then fall back to MongoDB). If MongoDB is down but the file from the
  last run is there, tours are served from it.
- Change streams need a replica set (every MongoDB Atlas cluster is one).
  Without one, every tour is read again every 2 minutes instead.
- Pages still have their own caches on top (tour pages up to an hour): a tour
  edited in the dashboard shows at once (the dashboard clears them); one
  edited straight in MongoDB shows when those expire.

Check it (and force a full re-read with POST):

```sh
curl -s -H "Authorization: Bearer $CRON_SECRET" https://www.travsus.com/api/tours/store-status
curl -s -X POST -H "Authorization: Bearer $CRON_SECRET" https://www.travsus.com/api/tours/store-status
```

`tours` is the number of tours in the copy, `loadedFrom` `mongodb`,
`changeStream` `open`. `TOURS_JSON=off` (a Worker variable) reads tours from
MongoDB again; `TOURS_JSON_PATH` moves the file. The Cloudflare Worker build
(vinext, no disk) always reads tours from MongoDB.

### Edge cache (fast pages for visitors and crawlers)

Public pages (home, tours, destinations, the blog list, search without
filters, about and the other info pages: `isPublicPath` in
src/container-worker.ts, the same list as `isPublicPage` in src/middleware.ts) are kept in Cloudflare's edge cache
on the custom domain (*.workers.dev has no cache):

- younger than 1 hour: served from the edge, the container is not called;
- older: served at once while a new copy is fetched in the background, so a
  visitor or crawler never waits for the container, even a sleeping one;
- kept up to 7 days, so an old copy is still served if the container fails.

Check with `curl -sI https://www.travsus.com/en-US | grep x-edge-cache`
(MISS, HIT or STALE). Copies are always fetched as a visitor without cookies;
a page that sets a cookie (other than the language cookie) is never stored.
An edited tour shows on the site within the hour (or deploy again).
Pages for one visitor (account, booking, checkout) and blog articles are never cached.

### Crons

The only Cron Trigger is an hourly ping (`"23 * * * *"`) that keeps the
container awake (it would sleep after 2 hours), so pages that are not cached
yet never wait for a cold start. This keeps one `basic` instance running all
the time; remove the cron to let it sleep when idle.

The daily jobs are NOT run here: the live Worker already runs
`/api/cron/charge-balances` and `/api/cron/invite-reminders`, and running them
here as well would charge balances twice. To move them here, turn them off
there first, then add `"0 6 * * *"` and `"0 9 * * *"` to `"crons"` (JOBS in
src/container-worker.ts already maps them).

One container instance (`basic`, `max_instances: 1`; `INSTANCES` in
src/container-worker.ts must match). If it is starting, visitors get a
"starting up" page that refreshes itself every 5 seconds (API calls get a JSON
503); cached pages are served from the edge instead.
