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
FROM --platform=linux/amd64 node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- Build ----
FROM --platform=linux/amd64 node:22-alpine AS builder
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
FROM --platform=linux/amd64 node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8080 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# No .env file in the image: settings come from the Worker at start
RUN rm -f .env .env.*

USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
