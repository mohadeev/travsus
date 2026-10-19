// /llms.txt — a plain-text guide to TRAVSUS for AI assistants (llmstxt.org).
import { db, T, fetchAll } from '@/lib/db'

export const revalidate = 3600

const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travsus.com'
).replace(/\/$/, '')

const oneLine = (text: unknown, max = 200) => {
	const t = String(text ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
	return t.length > max ? `${t.slice(0, t.lastIndexOf(' ', max))}…` : t
}

export async function GET() {
	const tours = await fetchAll(() =>
		db
			.from(T.tours)
			.select('id, name, overview, slugs, translations')
			.order('name'),
	)

	const tourLines = tours
		.map((tour) => {
			const slug = (tour.slugs ?? []).find(
				(s: any) => s.language === 'en-US',
			)?.slug
			const en = (tour.translations ?? []).find(
				(t: any) => t.language === 'en-US',
			)
			const name = en?.name || tour.name
			if (!slug || slug.includes('//') || !name) return null // no start address: link would 404
			const days = en?.days?.length ? ` (${en.days.length} days)` : ''
			return `- [${oneLine(name, 120)}${days}](${SITE_URL}${slug}): ${oneLine(en?.overview || tour.overview)}`
		})
		.filter(Boolean)

	const body = `# TRAVSUS

> TRAVSUS is an online travel company offering guided, private and group tours —
> mainly multi-day trips in Morocco (Marrakech, Fes, the Sahara at Merzouga, the
> Atlas Mountains). Tours can be booked online with free cancellation up to 24
> hours before departure and a "reserve now, pay later" option.

Every tour page lists the full day-by-day itinerary, what is included,
prices, real traveler reviews and an FAQ. Pages are available in 10 languages
(en-US, es-ES, fr-FR, de-DE, it-IT, pt-PT, ru-RU, zh-CN, ja-JP, ko-KR).

## Tours

${tourLines.join('\n')}

## More

- [All tours and search](${SITE_URL}/en-US/search)
- [Travel blog](${SITE_URL}/en-US/blog)
- [About TRAVSUS](${SITE_URL}/en-US/about)
- [Contact](${SITE_URL}/en-US/contact)
- [Sitemap](${SITE_URL}/sitemap.xml)
`

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}
