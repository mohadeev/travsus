import { T } from '@/lib/db'

/** Public author fields shown next to forum posts and comments. */
export const AUTHOR = `author:${T.users}!authorId(id, username, profileImage, accountData)`

