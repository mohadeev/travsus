import { defineCloudflareConfig } from '@opennextjs/cloudflare'

// Default cache is in-memory per isolate. Add an R2 incremental cache later
// if ISR results must be shared across isolates (needs an R2 bucket binding).
export default defineCloudflareConfig()
