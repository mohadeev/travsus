// Building blocks for TRAVSUS emails, in the site's style: white card on a
// light grey page, black pill buttons, rounded corners, system fonts.
// Emails need tables and inline styles to look the same in Gmail, Outlook and
// Apple Mail, so everything here returns HTML strings built that way.
// Any text passed in is escaped; pass raw HTML only through `raw()`.

export const SITE = 'https://www.travsus.com'
const LOGO = `${SITE}/images/logo/dark/travsus_text_dark_bg_transparent.png`
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
const C = { ink: '#0a0a0a', muted: '#737373', line: '#e5e5e5', page: '#f5f5f7', soft: '#f5f5f5', green: '#059669' }

/** Text made safe for HTML */
export const esc = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

/** Marks a string as already-safe HTML (built by these helpers) */
export type Html = { __html: string }
export const raw = (html: string): Html => ({ __html: html })
const out = (part: string | Html) => (typeof part === 'string' ? esc(part) : part.__html)
const join = (parts: (string | Html | false | null | undefined)[]) => parts.filter(Boolean).map((p) => out(p as string | Html)).join('')

export const euros = (n: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(n || 0)
export const longDate = (d: Date | string | number | null | undefined) =>
	d ? new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ''

// ---- Blocks -----------------------------------------------------------------

/** Small grey label above the title, e.g. "Booking confirmed" */
export const eyebrow = (text: string) =>
	raw(`<p style="margin:0 0 12px;font:600 12px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${C.muted}">${esc(text)}</p>`)

export const title = (text: string) => raw(`<h1 style="margin:0 0 12px;font:700 30px/1.15 ${FONT};letter-spacing:-.02em;color:${C.ink}">${esc(text)}</h1>`)

export const heading = (text: string) => raw(`<h2 style="margin:28px 0 10px;font:700 18px/1.3 ${FONT};color:${C.ink}">${esc(text)}</h2>`)

export const text = (...parts: (string | Html)[]) => raw(`<p style="margin:0 0 14px;font:400 16px/1.6 ${FONT};color:#404040">${join(parts)}</p>`)

export const small = (...parts: (string | Html)[]) => raw(`<p style="margin:0 0 10px;font:400 13px/1.6 ${FONT};color:${C.muted}">${join(parts)}</p>`)

export const strong = (value: string) => raw(`<strong style="color:${C.ink}">${esc(value)}</strong>`)

export const link = (label: string, href: string) => raw(`<a href="${esc(href)}" style="color:${C.ink};text-decoration:underline">${esc(label)}</a>`)

/** Black pill button */
export const button = (label: string, href: string) =>
	raw(`<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px"><tr><td style="border-radius:999px;background:${C.ink}">
<a href="${esc(href)}" style="display:inline-block;padding:15px 30px;font:600 15px/1 ${FONT};color:#ffffff;text-decoration:none;border-radius:999px">${esc(label)} &rarr;</a></td></tr></table>`)

/** Full-width photo with rounded corners */
export const image = (src: string | undefined, alt = '') =>
	src ? raw(`<img src="${esc(src)}" alt="${esc(alt)}" width="520" style="display:block;width:100%;max-width:520px;height:auto;border-radius:20px;margin:0 0 24px" />`) : raw('')

/** Grey rounded box with label / value rows */
export const details = (rows: [string, string | Html][]) =>
	raw(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;background:${C.soft};border-radius:20px">
<tr><td style="padding:8px 20px">${rows
		.map(
			([label, value], i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${i ? `border-top:1px solid ${C.line};` : ''}">
<tr><td style="padding:12px 0;font:400 14px/1.4 ${FONT};color:${C.muted}">${esc(label)}</td>
<td align="right" style="padding:12px 0;font:600 14px/1.4 ${FONT};color:${C.ink}">${out(value)}</td></tr></table>`,
		)
		.join('')}</td></tr></table>`)

/** Price lines and a bold total */
export const priceTable = (items: [string, number][], totalLabel: string, total: number) =>
	raw(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px">
${items
	.map(
		([label, amount]) => `<tr><td style="padding:8px 0;font:400 15px/1.4 ${FONT};color:#404040">${esc(label)}</td>
<td align="right" style="padding:8px 0;font:400 15px/1.4 ${FONT};color:#404040">${esc(euros(amount))}</td></tr>`,
	)
	.join('')}
<tr><td style="padding:14px 0 0;border-top:1px solid ${C.line};font:700 17px/1.4 ${FONT};color:${C.ink}">${esc(totalLabel)}</td>
<td align="right" style="padding:14px 0 0;border-top:1px solid ${C.line};font:700 17px/1.4 ${FONT};color:${C.ink}">${esc(euros(total))}</td></tr></table>`)

/** Green check badge, for "done" emails */
export const check = () =>
	raw(`<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px"><tr><td width="52" height="52" align="center" style="width:52px;height:52px;border-radius:999px;background:${C.green};font:700 26px/52px ${FONT};color:#ffffff">&#10003;</td></tr></table>`)

/** Short list with check marks */
export const bullets = (items: string[]) =>
	raw(`<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 18px">${items
		.map((item) => `<tr><td valign="top" style="padding:5px 12px 5px 0;font:700 14px/1.5 ${FONT};color:${C.green}">&#10003;</td><td style="padding:5px 0;font:400 15px/1.5 ${FONT};color:#404040">${esc(item)}</td></tr>`)
		.join('')}</table>`)

/** A personal note, in a soft grey box (line breaks kept) */
export const quote = (value: string) =>
	raw(`<p style="margin:0 0 18px;padding:16px 20px;background:${C.soft};border-radius:16px;font:400 15px/1.6 ${FONT};color:#262626;white-space:pre-line">${esc(value)}</p>`)

export const divider = () => raw(`<hr style="border:0;border-top:1px solid ${C.line};margin:28px 0" />`)

// ---- Page -------------------------------------------------------------------

/**
 * The whole email: logo, white card with the blocks, footer.
 * `preheader` is the grey preview line inboxes show next to the subject.
 */
export function emailPage({ preheader, blocks, footer }: { preheader: string; blocks: Html[]; footer?: string }) {
	return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>TRAVSUS</title></head>
<body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 8px 24px"><a href="${SITE}"><img src="${LOGO}" alt="TRAVSUS" height="28" style="display:block;height:28px;width:auto;border:0" /></a></td></tr>
<tr><td style="background:#ffffff;border-radius:28px;padding:40px 36px">${blocks.map((b) => b.__html).join('\n')}</td></tr>
<tr><td style="padding:28px 8px;font:400 12px/1.7 ${FONT};color:${C.muted}">
${footer ? `${esc(footer)}<br>` : ''}TRAVSUS LIMITED &middot; Tours and trips, booked in minutes.<br>
<a href="${SITE}/en-US/contact" style="color:${C.muted}">Help</a> &nbsp;&middot;&nbsp; <a href="${SITE}/en-US/privacy-policy" style="color:${C.muted}">Privacy</a> &nbsp;&middot;&nbsp; <a href="${SITE}/en-US/general-conditions" style="color:${C.muted}">Terms</a>
</td></tr></table></td></tr></table></body></html>`
}
