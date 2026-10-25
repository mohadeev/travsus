// The format of an affiliate's link code (?ref=CODE), shared by the server,
// the admin and the page that reads links. Like an Instagram username:
// letters, digits, dots, underscores and dashes, 3 to 30 characters,
// compared in lowercase.
export const CODE = /^[a-z0-9._-]{3,30}$/
export const CODE_MAX = 30

/** What can be typed: lowercase, allowed characters only, "@" dropped. */
export const cleanCode = (value: string) => value.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, CODE_MAX)
