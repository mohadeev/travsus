# TRAVSUS Next.js app for Cloudflare Containers (wrangler.container.jsonc).
# Built by `wrangler deploy -c wrangler.container.jsonc`, or by hand:
#   docker build --platform linux/amd64 -t travsus .
#
# Secrets are never baked in: the Worker passes them to the container at start
# (src/container-worker.ts). Only the public NEXT_PUBLIC_* values are needed at
# build time, because Next.js writes them into the browser code. Pass them as
# build args, or put them in a local .env.production (gitignored), which is
# used for the build and removed from the final image.

# ---- Dependencies ----
FROM --platform=linux/amd64 node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

# ---- Build ----
FROM --platform=linux/amd64 node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL=https://www.travsus.com
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_GOOGLE_MAP_API_KEY
ARG NEXT_PUBLIC_GOOGLE_MAP_ID
ARG NEXT_PUBLIC_EXTERNAL_SERVER
ARG NEXT_PUBLIC_BACK_END_URL
ARG NEXT_PUBLIC_COMPANY_PROFILE
ARG NEXT_PUBLIC_LEGAL_NAME
ARG NEXT_PUBLIC_LEGAL_LOCATION
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_GOOGLE_MAP_API_KEY=$NEXT_PUBLIC_GOOGLE_MAP_API_KEY \
    NEXT_PUBLIC_GOOGLE_MAP_ID=$NEXT_PUBLIC_GOOGLE_MAP_ID \
    NEXT_PUBLIC_EXTERNAL_SERVER=$NEXT_PUBLIC_EXTERNAL_SERVER \
    NEXT_PUBLIC_BACK_END_URL=$NEXT_PUBLIC_BACK_END_URL \
    NEXT_PUBLIC_COMPANY_PROFILE=$NEXT_PUBLIC_COMPANY_PROFILE \
    NEXT_PUBLIC_LEGAL_NAME=$NEXT_PUBLIC_LEGAL_NAME \
    NEXT_PUBLIC_LEGAL_LOCATION=$NEXT_PUBLIC_LEGAL_LOCATION \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Run ----
FROM --platform=linux/amd64 node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8080 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs --no-create-home nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# No .env file in the image: settings come from the Worker at start
RUN rm -f .env .env.*
# The tours' JSON copy (src/lib/tourStore.ts) is written here. The container's
# disk is emptied on each restart: the copy is read again from MongoDB at start.
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
ENV TOURS_JSON_PATH=/app/data/tours.json

USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
