// Fills in missing tour translations with OpenAI and saves them in the database.
//
//   npm run db:translate-tours            → dry run: lists what would change
//   npm run db:translate-tours -- --apply → backs up the tours, then saves
//
// For every tour and site language it translates only what is missing or
// still in English: name, subtitle, overview, conclusion, each day's title and
// text, and the FAQ. Missing languages also get their page URL (slug).
// A backup of every tour row is written to scripts/db/backups/ before saving.
import fs from 'node:fs'
import path from 'node:path'
import { slugify } from 'transliteration'
import { db, T, must } from '@/lib/db'
import { openai } from '@/lib/openai'
import { routing } from '@/i18n/routing'

const APPLY = process.argv.includes('--apply')
// --from=<dir>: use ready translations from <dir>/<tourId>.<language>.json
// (same JSON shape the model returns) instead of calling OpenAI.
// --export=<dir>: write what needs translating to <dir>/<tourId>.json and stop.
const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]
const FROM = arg('from')
const EXPORT = arg('export')
const MODEL = process.env.TRANSLATE_MODEL || 'gpt-4.1-mini'
const SOURCE = 'en-US'
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
const TEXT_FIELDS = ['name', 'subtitle', 'overview', 'conclusion'] as const

type Job = {
	tour: any
	language: string
	missing: boolean
	fields: string[] // top-level fields to translate
	days: number[] // day indexes to translate
	faq: boolean
}

const blank = (v: unknown) => typeof v !== 'string' || !v.trim()
const sameAsSource = (value: unknown, source: unknown) =>
	!blank(source) && (blank(value) || String(value).trim() === String(source).trim())

/** English content for a tour (its en-US translation, else the tour fields). */
function englishOf(tour: any) {
	const en = (tour.translations ?? []).find((t: any) => t.language === SOURCE) ?? {}
	return {
		name: en.name || tour.name,
		subtitle: en.subtitle || tour.subtitle,
		overview: en.overview || tour.overview,
		conclusion: en.conclusion || tour.conclusion,
		days: (en.days?.length ? en.days : tour.days) ?? [],
		faq: tour.faq ?? [],
	}
}

function plan(tour: any): Job[] {
	const source = englishOf(tour)
	const jobs: Job[] = []
	for (const language of routing.locales) {
		if (language === SOURCE) continue
		const existing = (tour.translations ?? []).find((t: any) => t.language === language)
		const fields = TEXT_FIELDS.filter((f) => sameAsSource(existing?.[f], (source as any)[f]))
		const days = source.days
			.map((day: any, i: number) => {
				const tr = existing?.days?.[i]
				return sameAsSource(tr?.name, day?.name) || sameAsSource(tr?.description, day?.description) ? i : -1
			})
			.filter((i: number) => i >= 0)
		const faq = source.faq.length > 0 && !(existing?.faq?.length === source.faq.length)
		if (!existing || fields.length || days.length || faq) {
			jobs.push({ tour, language, missing: !existing, fields: [...fields], days, faq })
		}
	}
	return jobs
}

/** The English texts a job needs translated (the shape translations come back in). */
function payloadFor(job: Job) {
	const source = englishOf(job.tour)
	const payload: any = {}
	for (const f of job.fields) payload[f] = (source as any)[f]
	if (job.days.length) {
		payload.days = job.days.map((i) => ({ index: i, name: source.days[i]?.name ?? '', description: source.days[i]?.description ?? '' }))
	}
	if (job.faq) payload.faq = source.faq.map((q: any) => ({ question: q.question, answer: q.answer }))
	return payload
}

function check(job: Job, out: any) {
	const source = englishOf(job.tour)
	for (const f of job.fields) if (blank(out[f])) throw new Error(`no ${f}`)
	if (job.days.length && (!Array.isArray(out.days) || out.days.length !== job.days.length)) throw new Error('days count')
	if (job.faq && (!Array.isArray(out.faq) || out.faq.length !== source.faq.length)) throw new Error('faq count')
	return out
}

async function translate(job: Job) {
	if (FROM) {
		const file = path.join(FROM, `${job.tour.id}.${job.language}.json`)
		if (!fs.existsSync(file)) throw new Error(`no file ${file}`)
		return check(job, JSON.parse(fs.readFileSync(file, 'utf8')))
	}
	const payload = payloadFor(job)

	const response = await openai.chat.completions.create({
		model: MODEL,
		temperature: 0.2,
		response_format: { type: 'json_object' },
		messages: [
			{
				role: 'system',
				content:
					`You translate travel tour pages from English into ${LANGUAGE_NAMES[job.language]} for TRAVSUS, a tour booking site. ` +
					'Write natural, warm, accurate travel copy as a native speaker would. Translate every text value; keep the JSON ' +
					'structure, keys and "index" numbers exactly the same. Use the usual local spelling of place names ' +
					'(e.g. Marrakech, Fes, Merzouga in the target language) and keep the "Day N:" prefix translated. ' +
					'Do not add, remove or invent information. Return only JSON.',
			},
			{ role: 'user', content: JSON.stringify(payload) },
		],
	})
	return check(job, JSON.parse(response.choices[0]?.message?.content || '{}'))
}

/** Country / city / category words other tours already use in this language. */
function slugParts(allTours: any[], tour: any, language: string) {
	const en = tour.slugs?.find((s: any) => s.language === SOURCE)?.slug?.split('/') ?? []
	const [, , enCountry, enCity] = en
	let country, city, category
	for (const other of allTours) {
		const otherEn = other.slugs?.find((s: any) => s.language === SOURCE)?.slug?.split('/') ?? []
		const target = other.slugs?.find((s: any) => s.language === language)?.slug?.split('/')
		if (!target) continue
		if (otherEn[2] === enCountry) country ??= target[2]
		if (otherEn[2] === enCountry && otherEn[3] === enCity) city ??= target[3]
		category ??= target[4]
	}
	return { country: country ?? enCountry, city: city ?? slugify(enCity ?? ''), category: category ?? 'tours' }
}

function merge(tour: any, job: Job, out: any, allTours: any[]) {
	const source = englishOf(tour)
	const translations = [...(tour.translations ?? [])]
	let index = translations.findIndex((t: any) => t.language === job.language)
	const entry: any = index >= 0 ? { ...translations[index] } : { language: job.language }

	for (const f of job.fields) entry[f] = out[f]
	// Days: keep the source's ids / city info, use the translated text
	const days = source.days.map((day: any, i: number) => {
		const current = entry.days?.[i] ?? {}
		const translated = job.days.includes(i) ? out.days.find((d: any) => d.index === i) ?? out.days[job.days.indexOf(i)] : null
		return {
			...day,
			...current,
			name: translated?.name ?? current.name ?? day.name,
			description: translated?.description ?? current.description ?? day.description,
		}
	})
	entry.days = days
	if (job.faq) entry.faq = out.faq
	if (index >= 0) translations[index] = entry
	else translations.push(entry)

	// A page URL for a newly added language
	let slugs = tour.slugs ?? []
	if (!slugs.some((s: any) => s.language === job.language)) {
		const { country, city, category } = slugParts(allTours, tour, job.language)
		const slug = `/${job.language}/${country}/${city}/${category}/${slugify(entry.name)}/${tour.id}`
		slugs = [...slugs, { language: job.language, slug }]
	}
	return { ...tour, translations, slugs }
}

async function main() {
	const tours = must(await db.from(T.tours).select('id, name, subtitle, overview, conclusion, days, faq, slugs, translations')) as any[]
	const jobs = tours.flatMap(plan)

	console.log(`${jobs.length} translations to do (${APPLY ? 'APPLY' : 'dry run'}, model ${MODEL}):`)
	for (const j of jobs) {
		const what = j.missing
			? 'whole language'
			: [j.fields.join(', '), j.days.length && `${j.days.length} day(s)`, j.faq && 'FAQ'].filter(Boolean).join(', ')
		console.log(`  ${j.tour.name.trim().slice(0, 50).padEnd(50)} ${j.language}  ${what}`)
	}
	if (EXPORT) {
		fs.mkdirSync(EXPORT, { recursive: true })
		for (const job of jobs) {
			fs.writeFileSync(path.join(EXPORT, `${job.tour.id}.${job.language}.source.json`), JSON.stringify(payloadFor(job), null, 2))
		}
		console.log(`Exported ${jobs.length} files to ${EXPORT}`)
		return
	}
	if (!APPLY || !jobs.length) return

	// Backup every tour row before changing anything
	const dir = path.join(process.cwd(), 'scripts/db/backups')
	fs.mkdirSync(dir, { recursive: true })
	const backup = path.join(dir, `tours-before-translate-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
	fs.writeFileSync(backup, JSON.stringify(must(await db.from(T.tours).select('id, slugs, translations')), null, 2))
	console.log(`\nBackup: ${path.relative(process.cwd(), backup)}`)

	// Translate (a few at a time), then save each tour once
	const updated = new Map<string, any>(tours.map((t) => [t.id, t]))
	const failed: string[] = []
	const changed = new Set<string>()
	for (let i = 0; i < jobs.length; i += 4) {
		await Promise.all(
			jobs.slice(i, i + 4).map(async (job) => {
				try {
					const out = await translate(job)
					updated.set(job.tour.id, merge(updated.get(job.tour.id), job, out, tours))
					changed.add(job.tour.id)
					process.stdout.write('.')
				} catch (error: any) {
					failed.push(`${job.tour.id} ${job.language}: ${error.message}`)
					process.stdout.write('x')
				}
			}),
		)
	}
	console.log('')

	let saved = 0
	// Only tours that really got new translations
	for (const id of changed) {
		const tour = updated.get(id)
		must(
			await db
				.from(T.tours)
				.update({ translations: tour.translations, slugs: tour.slugs, updatedAt: new Date().toISOString() })
				.eq('id', id),
		)
		saved++
	}
	console.log(`Saved ${saved} tours.${failed.length ? ` Failed (left unchanged):\n  ${failed.join('\n  ')}` : ' No failures.'}`)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
