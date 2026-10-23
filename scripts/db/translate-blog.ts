// Fills in missing blog post translations with OpenAI and saves them in the database.
//
//   npm run db:translate-blog            → dry run: lists what would change
//   npm run db:translate-blog -- --apply → backs up the posts, then saves
//   npm run db:translate-blog -- --preview=<language> → translates one post, prints it, saves nothing
//   --from=<dir>: use ready translations from <dir>/<postId>.<language>.json
//   --redo=<language>: with --from, also replace that language where a file exists
//   ({ title, excerpt, tags, content }) instead of calling OpenAI
//
// Only the posts the blog shows (readable, one copy per title) are translated,
// into every site language they don't have yet: title, excerpt, tags and the
// article HTML (tags, links and images kept as they are). The page address in
// each language comes from the translated title (see blogPath in src/lib/blog.ts).
// A backup of every post row is written to scripts/db/backups/ before saving.
import fs from 'node:fs'
import path from 'node:path'
import { db, T, must } from '@/lib/db'
import { openai } from '@/lib/openai'
import { routing } from '@/i18n/routing'

const APPLY = process.argv.includes('--apply')
const FROM = process.argv.find((a) => a.startsWith('--from='))?.split('=')[1]
const PREVIEW = process.argv.find((a) => a.startsWith('--preview='))?.split('=')[1]
// --redo=<language> with --from: also replace that language where a ready file exists
const REDO = process.argv.find((a) => a.startsWith('--redo='))?.split('=')[1]
// …or a file with "<postId> <language>" lines: replace exactly those
const REDO_PAIRS = new Set(REDO && fs.existsSync(REDO) ? fs.readFileSync(REDO, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean) : [])
const MODEL = process.env.TRANSLATE_MODEL || 'gpt-4.1-mini'
const SOURCE = 'en-US'
const MIN_TEXT = 300 // same as src/lib/blog.ts: shorter texts don't count
const LANGUAGE_NAMES: Record<string, string> = {
	'de-DE': 'German',
	'es-ES': 'Spanish (Spain)',
	'fr-FR': 'French',
	'it-IT': 'Italian',
	'ja-JP': 'Japanese',
	'ko-KR': 'Korean',
	'pt-PT': 'European Portuguese',
	'ru-RU': 'Russian',
	'zh-CN': 'Simplified Chinese',
}

const plain = (html: string) => String(html ?? '').replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()
const tagNames = (html: string) => (String(html ?? '').match(/<\/?[a-z0-9]+/gi) ?? []).map((t) => t.toLowerCase())

/** The post's English text (its en-US translation, else the post fields). */
function englishOf(post: any) {
	const en = (post.translations ?? []).find((t: any) => t?.language === SOURCE && plain(t?.content).length >= MIN_TEXT)
	return {
		title: String(en?.title || post.title || '').trim(),
		excerpt: String(en?.excerpt || post.excerpt || ''),
		content: String(en?.content || post.content || ''),
		tags: ((en?.tags?.length ? en.tags : post.tags) ?? []).filter(Boolean) as string[],
	}
}

const hasLanguage = (post: any, language: string) =>
	(post.translations ?? []).some((t: any) => t?.language === language && plain(t?.content).length >= MIN_TEXT && String(t?.title ?? '').trim())

/** The posts the blog shows: readable, and one copy per title (same rule as src/lib/blog.ts). */
function shownPosts(rows: any[]) {
	const readable = rows.filter((p) => {
		const en = englishOf(p)
		return en.title.length >= 10 && plain(en.content).length >= MIN_TEXT
	})
	const score = (p: any) => [(p.translations ?? []).length, p.featuredImage ? 1 : 0, plain(englishOf(p).content).length, -new Date(p.createdAt).getTime()]
	const better = (a: any, b: any) => {
		const [sa, sb] = [score(a), score(b)]
		for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return sa[i] > sb[i] ? a : b
		return a
	}
	const byTitle = new Map<string, any>()
	for (const p of readable) {
		const key = englishOf(p).title.toLowerCase()
		const current = byTitle.get(key)
		byTitle.set(key, current ? better(current, p) : p)
	}
	return Array.from(byTitle.values())
}

function check(source: ReturnType<typeof englishOf>, out: any) {
	if (!String(out?.title ?? '').trim()) throw new Error('no title')
	if (plain(out?.content).length < MIN_TEXT) throw new Error('content too short')
	if (!Array.isArray(out?.tags) || out.tags.length !== source.tags.length) throw new Error('tags count')
	// Same HTML structure: same tags in the same order
	if (tagNames(out.content).join() !== tagNames(source.content).join()) throw new Error('HTML structure changed')
	// Every link and image address kept
	const urls = (html: string) => (html.match(/(?:href|src)="[^"]*"/g) ?? []).join()
	if (urls(out.content) !== urls(source.content)) throw new Error('links or images changed')
	return { title: String(out.title).trim(), excerpt: String(out.excerpt ?? ''), content: String(out.content), tags: out.tags.map(String) }
}

async function translate(post: any, language: string) {
	const source = englishOf(post)
	if (FROM) {
		const file = path.join(FROM, `${post.id}.${language}.json`)
		if (!fs.existsSync(file)) throw new Error(`no file ${file}`)
		return check(source, JSON.parse(fs.readFileSync(file, 'utf8')))
	}
	const response = await openai.chat.completions.create({
		model: MODEL,
		temperature: 0.2,
		response_format: { type: 'json_object' },
		messages: [
			{
				role: 'system',
				content:
					`You translate travel blog articles from English into ${LANGUAGE_NAMES[language]} for TRAVSUS, a tour booking site. ` +
					'Write natural, warm, accurate travel writing as a native speaker would, with search-friendly titles. ' +
					'You get JSON with title, excerpt, tags (a list) and content (HTML). Translate every text value and return the same JSON keys. ' +
					'In content, translate only the visible text: keep every HTML tag, attribute, class, style, link (href) and image (src) exactly ' +
					'as they are, in the same order; translate alt and title attribute text. Keep emojis. Return exactly as many tags as given. ' +
					'Use the usual local spelling of place names (Marrakech, Fes, Merzouga, Sahara in the target language). ' +
					'Do not add, remove or invent information. Return only JSON.',
			},
			{ role: 'user', content: JSON.stringify(source) },
		],
	})
	return check(source, JSON.parse(response.choices[0]?.message?.content || '{}'))
}

async function main() {
	const rows = must(await db.from(T.posts).select('id, title, content, excerpt, tags, featuredImage, createdAt, translations')) as any[]
	const posts = shownPosts(rows)
	const jobs = posts.flatMap((post) =>
		Object.keys(LANGUAGE_NAMES)
			.filter((language) => !hasLanguage(post, language) || ((language === REDO || REDO_PAIRS.has(`${post.id} ${language}`)) && FROM && fs.existsSync(path.join(FROM, `${post.id}.${language}.json`))))
			.map((language) => ({ post, language })),
	)

	console.log(`${posts.length} posts shown, ${jobs.length} translations to do (${APPLY ? 'APPLY' : 'dry run'}, ${FROM ? `from ${FROM}` : `model ${MODEL}`}):`)
	for (const post of posts) {
		const missing = jobs.filter((j) => j.post.id === post.id).map((j) => j.language)
		if (missing.length) console.log(`  ${post.id}  ${englishOf(post).title.slice(0, 45).padEnd(45)} ${missing.length === 9 ? 'all 9 languages' : missing.join(', ')}`)
	}
	if (PREVIEW) {
		// The shortest post still missing that language
		const job = jobs.filter((j) => j.language === PREVIEW).sort((a, b) => englishOf(a.post).content.length - englishOf(b.post).content.length)[0]
		if (!job) return console.log(`Nothing missing in ${PREVIEW}`)
		const out = await translate(job.post, job.language)
		console.log(`\nPreview (${PREVIEW}, checks passed):\n${JSON.stringify({ ...out, content: plain(out.content).slice(0, 700) + '…' }, null, 2)}`)
		return
	}
	if (!APPLY || !jobs.length) return

	// Backup every post row before changing anything
	const dir = path.join(process.cwd(), 'scripts/db/backups')
	fs.mkdirSync(dir, { recursive: true })
	const backup = path.join(dir, `posts-before-translate-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
	fs.writeFileSync(backup, JSON.stringify(must(await db.from(T.posts).select('id, translations')), null, 2))
	console.log(`\nBackup: ${path.relative(process.cwd(), backup)}`)

	// Translate (a few at a time; one retry), then save each post once
	const done = new Map<string, any[]>() // post id → new translation entries
	const failed: string[] = []
	for (let i = 0; i < jobs.length; i += 4) {
		await Promise.all(
			jobs.slice(i, i + 4).map(async ({ post, language }) => {
				for (let attempt = 1; attempt <= 2; attempt++) {
					try {
						const out = await translate(post, language)
						done.set(post.id, [...(done.get(post.id) ?? []), { language, ...out }])
						process.stdout.write('.')
						return
					} catch (error: any) {
						if (attempt === 2) {
							failed.push(`${post.id} ${language}: ${error.message}`)
							process.stdout.write('x')
						}
					}
				}
			}),
		)
	}
	console.log('')

	let saved = 0
	for (const [id, entries] of Array.from(done)) {
		const post = posts.find((p) => p.id === id)
		const languages = new Set(entries.map((e: any) => e.language))
		// Replace empty / too-short entries of those languages, keep everything else
		const translations = [...(post.translations ?? []).filter((t: any) => !languages.has(t?.language)), ...entries]
		must(await db.from(T.posts).update({ translations }).eq('id', id))
		saved++
	}
	console.log(`Saved ${saved} posts.${failed.length ? ` Failed (left unchanged):\n  ${failed.join('\n  ')}` : ' No failures.'}`)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
