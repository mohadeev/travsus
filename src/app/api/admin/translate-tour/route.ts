// Translates one English tour text into one site language with OpenAI.
// Owner or CRON_SECRET only. Stateless: it returns the translation and saves nothing;
// the caller stores it with the tour (content/tours/*.<lang>.json, then /api/admin/tours).
//
// POST { language: 'fr-FR', slug: '/en-US/<country>/<city>/tours/<name>',
//        country: 'Italy', city: 'Rome',
//        tour: { name, subtitle, overview, days: [{ name, description }], faq: [{ question, answer }] } }
//  →   { translation: { language, slug, name, subtitle, overview, days, faq } }
import { NextResponse, type NextRequest } from 'next/server'
import { isOwner } from '@/lib/admin/owner'
import { openai } from '@/lib/openai'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

const MODEL = 'gpt-4o'

const LANGUAGE_NAMES: Record<string, string> = {
	'de-DE': 'German', 'es-ES': 'Spanish (Spain)', 'fr-FR': 'French', 'it-IT': 'Italian', 'ja-JP': 'Japanese',
	'ko-KR': 'Korean', 'pt-PT': 'European Portuguese', 'ru-RU': 'Russian', 'zh-CN': 'Simplified Chinese',
}

// The word for "tours" in tour addresses, as the existing translated tours use it
const CATEGORY: Record<string, string> = {
	'de-DE': 'tours', 'es-ES': 'rutas', 'fr-FR': 'tours', 'it-IT': 'tours', 'ja-JP': 'tsua',
	'ko-KR': 'tueo', 'pt-PT': 'tours', 'ru-RU': 'ekskursii', 'zh-CN': 'lv-you-tuan',
}

const ROMANISATION: Record<string, string> = {
	'ja-JP': 'Hepburn romanisation of the Japanese words',
	'ko-KR': 'Revised Romanisation of the Korean words',
	'ru-RU': 'Latin transliteration of the Russian words',
	'zh-CN': 'pinyin without tones, one hyphen between syllables',
}

async function allowed(request: NextRequest) {
	const secret = process.env.CRON_SECRET
	if (secret && request.headers.get('authorization') === `Bearer ${secret}`) return true
	return isOwner()
}

const RULES = (language: string) => `You are a professional travel translator. Translate the JSON values from English into ${LANGUAGE_NAMES[language]}.
Rules:
- Return JSON with exactly the same keys and structure; translate every string value; keep arrays the same length and order.
- Natural, fluent, polished travel-brochure style for native readers; keep it accurate, add nothing and leave nothing out.
- Keep line breaks (\\n), bullet characters (•), times (09:00), prices, numbers and units. Keep the section headings in capitals (e.g. "AT A GLANCE") translated, also in capitals where the script has capitals.
- Proper names of places and sites use the usual name in ${LANGUAGE_NAMES[language]}.
- "TRAVSUS" stays as it is.`

async function translateJson(language: string, value: unknown, extra = '') {
	const res = await openai.chat.completions.create({
		model: MODEL,
		temperature: 0.2,
		max_tokens: 16000,
		response_format: { type: 'json_object' },
		messages: [
			{ role: 'system', content: RULES(language) + (extra ? `\n${extra}` : '') },
			{ role: 'user', content: JSON.stringify(value) },
		],
	})
	const choice = res.choices[0]
	if (choice?.finish_reason === 'length') throw new Error('Translation was cut off (too long)')
	return JSON.parse(choice?.message?.content || '{}')
}

const slugPart = (s: unknown) =>
	String(s ?? '')
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 140)

export async function POST(request: NextRequest) {
	if (!(await allowed(request))) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await request.json().catch(() => null)
	const language = String(body?.language ?? '')
	const tour = body?.tour
	if (!(routing.locales as readonly string[]).includes(language) || !LANGUAGE_NAMES[language]) {
		return NextResponse.json({ error: 'Unknown language' }, { status: 400 })
	}
	if (!tour?.name || !tour?.overview || !Array.isArray(tour?.days) || !tour.days.length || !Array.isArray(tour?.faq)) {
		return NextResponse.json({ error: 'Send tour { name, subtitle, overview, days, faq }' }, { status: 400 })
	}
	if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'OPENAI_API_KEY is not set' }, { status: 500 })

	const roman = ROMANISATION[language] ?? `the ${LANGUAGE_NAMES[language]} words without accents`
	try {
		const [head, days, faq] = await Promise.all([
			translateJson(
				language,
				{ name: tour.name, subtitle: tour.subtitle ?? '', overview: tour.overview, country: body?.country ?? '', city: body?.city ?? '' },
				`Also add three keys: "countrySlug", "citySlug" and "nameSlug": the translated country name, city name and tour name written as URL slugs (${roman}, lowercase ASCII letters and digits, words joined by hyphens).`,
			),
			translateJson(language, { days: tour.days.map((d: any) => ({ name: String(d?.name ?? ''), description: String(d?.description ?? '') })) }),
			translateJson(language, { faq: tour.faq.map((q: any) => ({ question: String(q?.question ?? ''), answer: String(q?.answer ?? '') })) }),
		])
		if (!Array.isArray(days?.days) || days.days.length !== tour.days.length) throw new Error('Days came back with a different count')
		if (!Array.isArray(faq?.faq) || faq.faq.length !== tour.faq.length) throw new Error('FAQ came back with a different count')
		const country = slugPart(head.countrySlug), city = slugPart(head.citySlug), name = slugPart(head.nameSlug)
		if (!country || !city || !name || !head.name || !head.overview) throw new Error('Incomplete translation')
		return NextResponse.json({
			translation: {
				language,
				slug: `/${language}/${country}/${city}/${CATEGORY[language]}/${name}`,
				name: head.name,
				subtitle: head.subtitle ?? '',
				overview: head.overview,
				days: days.days.map((d: any) => ({ name: String(d.name ?? ''), description: String(d.description ?? '') })),
				faq: faq.faq.map((q: any) => ({ question: String(q.question ?? ''), answer: String(q.answer ?? '') })),
			},
		})
	} catch (error: any) {
		return NextResponse.json({ error: error?.message ?? 'Translation failed' }, { status: 502 })
	}
}
