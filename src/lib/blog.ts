// Blog data for the server: posts in the visitor's language, their addresses
// in every language, and which posts are shown at all.
//
// The posts table has no "published" flag, so test posts (almost no text) are
// hidden, and when the same article was saved several times only one copy is
// shown: its other copies redirect to it.
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { slugify } from 'transliteration'
import { dbFresh, T, fetchAll } from '@/lib/db'
import { routing } from '@/i18n/routing'

const BASE_LOCALE = routing.defaultLocale // the language posts are written in
const MIN_TEXT = 300 // characters of text for a post to be shown

export type BlogAuthor = { name: string; image: string | null }
export type BlogPost = {
	id: string
	title: string
	excerpt: string
	content: string // HTML, ready to show
	tags: string[]
	image: string | null
	createdAt: string
	readMinutes: number
	author: BlogAuthor
	authorId: string
	/** Shown in this language (false: the English text is shown) */
	translated: boolean
}

const plain = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()

/** The post's text in `locale` (its translation when there is one). */
function localize(raw: any, locale: string) {
	const tr = (raw.translations ?? []).find((t: any) => t?.language === locale && plain(t?.content ?? '').length >= MIN_TEXT)
	const pick = (key: string) => (tr?.[key] && String(tr[key]).trim()) || raw[key]
	return {
		title: String(pick('title') ?? '').trim(),
		content: String(pick('content') ?? ''),
		excerpt: String(pick('excerpt') ?? ''),
		tags: ((tr?.tags?.length ? tr.tags : raw.tags) ?? []).filter(Boolean) as string[],
		translated: !!tr || locale === BASE_LOCALE,
	}
}

const readable = (raw: any) => {
	const { title, content } = localize(raw, BASE_LOCALE)
	return title.length >= 10 && plain(content).length >= MIN_TEXT
}

/** Article HTML made safe to show under the page's own <h1>. */
function cleanHtml(html: string) {
	return html
		.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
		// Iframes: only YouTube videos added in the editor (privacy-friendly domain)
		.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, (frame) =>
			/\ssrc="https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]+[^"]*"/i.test(frame) ? frame : '',
		)
		.replace(/<iframe\b(?![^>]*youtube-nocookie\.com\/embed\/)[^>]*>/gi, '')
		.replace(/\son\w+="[^"]*"/gi, '')
		.replace(/\son\w+='[^']*'/gi, '')
		.replace(/href="\s*javascript:[^"]*"/gi, 'href="#"')
		.replace(/<(\/?)h1(\s|>)/gi, '<$1h2$2') // the title is the page's only <h1>
		// Paragraphs that only repeat the image caption just above them
		.replace(/(<figcaption[^>]*>([\s\S]*?)<\/figcaption>\s*<\/figure>)((?:\s*<p>[\s\S]*?<\/p>)+)/gi, (_, figure, caption, paras) =>
			figure + paras.replace(/<p>([\s\S]*?)<\/p>/gi, (p: string, text: string) => (plain(text) === plain(caption) ? '' : p)),
		)
}

const authorOf = (user: any): BlogAuthor => {
	const full = [user?.accountData?.firstname, user?.accountData?.lastname].filter(Boolean).join(' ')
	return { name: user?.name || full || user?.username || 'TRAVSUS', image: user?.profileImage?.url || null }
}

/** All posts, newest first, plus each post's main copy (read once per request). */
const loadAll = cache(async () => {
	const rows = await fetchAll<any>(() =>
		dbFresh
			.from(T.posts)
			.select(`id, title, content, excerpt, tags, featuredImage, authorId, createdAt, translations, author:${T.users}(id, name, username, profileImage, accountData)`)
			.order('createdAt', { ascending: false }),
	)
	// Copies of the same article share a title: keep the one with the most
	// translations, then a photo, then the most text, then the oldest
	const score = (p: any) => [
		(p.translations ?? []).length,
		p.featuredImage ? 1 : 0,
		plain(localize(p, BASE_LOCALE).content).length,
		-new Date(p.createdAt).getTime(),
	]
	const better = (a: any, b: any) => {
		const [sa, sb] = [score(a), score(b)]
		for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return sa[i] > sb[i] ? a : b
		return a
	}
	const mainByTitle = new Map<string, any>()
	for (const row of rows.filter(readable)) {
		const key = localize(row, BASE_LOCALE).title.toLowerCase()
		const current = mainByTitle.get(key)
		mainByTitle.set(key, current ? better(current, row) : row)
	}
	const main = new Set(Array.from(mainByTitle.values()).map((p) => p.id))
	const mainIdOf = (row: any) => mainByTitle.get(localize(row, BASE_LOCALE).title.toLowerCase())?.id ?? null
	return { rows, main, mainIdOf }
})

/** "/fr-FR/blog/{slug}/{id}" */
export const blogPath = (locale: string, title: string, id: string) => `/${locale}/blog/${slugify(title) || 'article'}/${id}`

/** The post's address in every language it is translated into. */
export function blogLanguages(raw: any): Record<string, string> {
	const languages: Record<string, string> = {}
	for (const locale of routing.locales) {
		const text = localize(raw, locale)
		if (text.translated) languages[locale] = blogPath(locale, text.title, raw.id)
	}
	return languages
}

function toPost(raw: any, locale: string): BlogPost {
	const text = localize(raw, locale)
	const words = plain(text.content).split(' ').length
	return {
		id: raw.id,
		title: text.title,
		excerpt: plain(text.excerpt) || plain(text.content).slice(0, 180),
		content: cleanHtml(text.content),
		tags: text.tags,
		image: raw.featuredImage || null,
		createdAt: raw.createdAt,
		readMinutes: Math.max(1, Math.round(words / 220)),
		author: authorOf(raw.author),
		authorId: raw.authorId,
		translated: text.translated,
	}
}

/** Posts shown on the blog, newest first (without the article text). */
export const listBlogPosts = unstable_cache(
	async (locale: string): Promise<BlogPost[]> => {
		const { rows, main } = await loadAll()
		return rows.filter((r) => main.has(r.id)).map((r) => ({ ...toPost(r, locale), content: '' }))
	},
	['blog-list-v2'],
	{ revalidate: 600, tags: ['blog'] },
)

/** Shown posts with their address in every language (for the sitemap). */
export const blogSitemapEntries = unstable_cache(
	async (): Promise<{ id: string; createdAt: string; languages: Record<string, string> }[]> => {
		const { rows, main } = await loadAll()
		return rows.filter((r) => main.has(r.id)).map((r) => ({ id: r.id, createdAt: r.createdAt, languages: blogLanguages(r) }))
	},
	['blog-sitemap-v1'],
	{ revalidate: 3600, tags: ['blog'] },
)

/**
 * One post. `redirectTo` is set when the post is a copy of another one;
 * null when the post doesn't exist or is a test post.
 */
export async function getBlogPost(
	id: string,
	locale: string,
): Promise<{ redirectTo: string } | { post: BlogPost; languages: Record<string, string>; related: BlogPost[] } | null> {
	const { rows, main, mainIdOf } = await loadAll()
	const raw = rows.find((r) => r.id === id)
	if (!raw || !readable(raw)) return null
	if (!main.has(id)) {
		const target = rows.find((r) => r.id === mainIdOf(raw))
		return target ? { redirectTo: blogPath(locale, localize(target, locale).title, target.id) } : null
	}
	const post = toPost(raw, locale)
	// Related: most shared tags first, then the newest
	const tags = new Set(post.tags.map((t) => t.toLowerCase()))
	const shared = (r: any) => (r.tags ?? []).filter((t: string) => tags.has(String(t).toLowerCase())).length
	const related = rows
		.filter((r) => main.has(r.id) && r.id !== id)
		.map((r, i) => ({ r, i, s: shared(r) }))
		.sort((a, b) => b.s - a.s || a.i - b.i)
		.slice(0, 3)
		.map(({ r }) => toPost(r, locale))
	return { post, languages: blogLanguages(raw), related }
}
