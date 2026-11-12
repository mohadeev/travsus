// Replaces a tour's day descriptions and/or FAQ in one language (admin only).
// Used to publish long, detailed texts written outside the editor (for example
// content/tours/*.md) without retyping them one by one.
//
// POST { tourId, language, descriptions?: string[], faq?: { question, answer }[], overview?: string }
// descriptions: one text per day, in order (an empty string keeps that day's text);
// faq: replaces the tour's questions in that language.
// overview: replaces the tour's overview (the "About this tour" text) in that language.
// Allowed for the site owner's account, or with "Authorization: Bearer <CRON_SECRET>".
import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { db, T, must, touch } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { TOURS_TAG } from '@/lib/tourCatalog'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

const MAX_TEXT = 20000

async function allowed(request: NextRequest) {
	const secret = process.env.CRON_SECRET
	if (secret && request.headers.get('authorization') === `Bearer ${secret}`) return true
	return isOwner()
}

export async function POST(request: NextRequest) {
	if (!(await allowed(request))) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await request.json().catch(() => ({}))
	const tourId = typeof body.tourId === 'string' ? body.tourId : ''
	const language = typeof body.language === 'string' ? body.language : ''
	const descriptions: unknown = body.descriptions ?? []
	const faq: unknown = body.faq
	const overview = typeof body.overview === 'string' ? body.overview.trim() : ''
	if (overview.length > MAX_TEXT) return NextResponse.json({ error: `The overview must be at most ${MAX_TEXT} characters` }, { status: 400 })
	if (!tourId || !(routing.locales as readonly string[]).includes(language) || !Array.isArray(descriptions)) {
		return NextResponse.json({ error: 'Send tourId, a site language and descriptions (an array of texts) and/or faq' }, { status: 400 })
	}
	const faqItems = Array.isArray(faq)
		? faq.map((item: any) => ({ question: String(item?.question ?? '').trim(), answer: String(item?.answer ?? '').trim() }))
		: null
	if (faqItems && (faqItems.some((item) => !item.question || !item.answer || item.question.length > 300 || item.answer.length > 3000) || faqItems.length > 40)) {
		return NextResponse.json({ error: 'Each FAQ needs a question (300 characters at most) and an answer (3000 at most), 40 questions at most' }, { status: 400 })
	}
	if (descriptions.some((text) => typeof text !== 'string' || text.length > MAX_TEXT)) {
		return NextResponse.json({ error: `Each description must be text of at most ${MAX_TEXT} characters` }, { status: 400 })
	}

	try {
		const tour = must(await db.from(T.tours).select('id, translations').eq('id', tourId).maybeSingle()) as any
		if (!tour) return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		const translations: any[] = Array.isArray(tour.translations) ? tour.translations : []
		const index = translations.findIndex((t) => t?.language === language)
		if (index < 0) return NextResponse.json({ error: `The tour has no ${language} version` }, { status: 404 })
		const days: any[] = Array.isArray(translations[index].days) ? translations[index].days : []
		if ((descriptions as string[]).length > days.length) {
			return NextResponse.json({ error: `The tour has ${days.length} days, ${(descriptions as string[]).length} texts were sent` }, { status: 400 })
		}

		const changed: number[] = []
		const nextDays = days.map((day, i) => {
			const text = ((descriptions as string[])[i] ?? '').trim()
			if (!text || text === day?.description) return day
			changed.push(i + 1)
			return { ...day, description: text }
		})
		const nextTranslations = translations.map((t, i) => (i === index ? { ...t, days: nextDays, ...(faqItems ? { faq: faqItems } : {}), ...(overview ? { overview } : {}) } : t))
		must(await db.from(T.tours).update(touch({ translations: nextTranslations })).eq('id', tourId))
		revalidateTag(TOURS_TAG, { expire: 0 })
		return NextResponse.json({ ok: true, tourId, language, changedDays: changed, faq: faqItems?.length ?? 'unchanged', overview: overview ? overview.length : 'unchanged' })
	} catch (error) {
		console.error('Tour days update failed:', error)
		return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
	}
}
