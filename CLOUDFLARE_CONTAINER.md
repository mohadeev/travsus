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
npm run deploy:container
```

Cron Triggers are off (`"crons": []`): the live Worker already runs
`/api/cron/charge-balances` and `/api/cron/invite-reminders`, and running them
here as well would charge balances twice. To move the jobs here, turn them off
there first, then set `"crons": ["0 6 * * *", "0 9 * * *"]`.

One container instance (`basic`, `max_instances: 1`; `INSTANCES` in
src/container-worker.ts must match). It stops after 2 hours without requests
and starts again on the next one; while it starts, visitors get a "starting
up" page that refreshes itself every 5 seconds (API calls get a JSON 503).
