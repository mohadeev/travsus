#!/usr/bin/env bash
# Warms the live site's page cache after a deploy: Cloudflare's saved pages are
# tied to the deploy, so right after one every page would be built on its first
# visit (2 s or more). This requests the home pages and every tour page in every
# language, like a visitor, so the first real visitors get the saved copy.
# Usage: scripts/warm-cache.sh [site]   (default https://www.travsus.com)
set -u
SITE="${1:-https://www.travsus.com}"
UA="TRAVSUS cache warmer (+$SITE)"
sleep 20 # let the new deploy reach every Cloudflare location
urls=$(curl -s -A "$UA" "$SITE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<\/*loc>//g' \
	| grep -E '/[a-z]{2}-[A-Z]{2}$|/[0-9a-f]{24}$' | grep -v '/blog/')
total=$(echo "$urls" | grep -c . || true)
echo "Warming $total pages"
echo "$urls" | xargs -P 8 -I{} curl -s -o /dev/null -A "$UA" --max-time 60 -w '%{http_code}\n' {} | sort | uniq -c
