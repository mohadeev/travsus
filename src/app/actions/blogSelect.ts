import { T } from '@/lib/db'

/** Blog post with its author's public profile (never the full user row). */
export const POST_WITH_AUTHOR = `*, author:${T.users}(id, name, username, profileImage, accountData)`
