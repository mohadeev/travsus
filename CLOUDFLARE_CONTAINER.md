# TRAVSUS on Cloudflare Containers

The normal Next.js app (`next build`, `output: "standalone"`) runs in a Docker
container on Cloudflare Containers (Workers Paid plan). A small Worker
([src/container-worker.ts](src/container-worker.ts)) receives every request and
forwards it to one of up to 3 containers; it also runs the two daily jobs.

| File | What it is |
| --- | --- |
| [Dockerfile](Dockerfile) | Builds the app and runs `node server.js` on port 8080 |
| [wrangler.container.jsonc](wrangler.container.jsonc) | Worker, container, Durable Object binding, crons |
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

The daily jobs (06:00 and 09:00 UTC) call `/api/cron/charge-balances` and
`/api/cron/invite-reminders` with `Authorization: Bearer <CRON_SECRET>`, as
Vercel Cron did. A container stops after 30 minutes without requests and
starts again on the next one (the first request after that waits a few seconds).
