// "Explore more" tags at the very end of a tour page (like the link chips at the
// bottom of big tour sites): the city guides of the places the tour really goes
// through, then the country guide. Real internal links to indexed pages, so they
// help visitors and Google find the destination pages; no keyword lists.
import 'server-only'

/** Destination pages that exist (/destinations/morocco/<slug>), with the names a route can use for them. */
const MOROCCO_CITIES: { slug: string; names: string[] }[] = [
	{ slug: 'marrakech', names: ['marrakech', 'marrakesh'] },
	{ slug: 'ait-benhaddou', names: ['ait ben haddou', 'ait benhaddou'] },
	{ slug: 'ouarzazate', names: ['ouarzazate'] },
	{ slug: 'boumalne-dades', names: ['dades', 'boumalne'] },
	{ slug: 'merzouga', names: ['merzouga', 'erg chebbi', 'sahara'] },
	{ slug: 'fes', names: ['fes', 'fez'] },
	{ slug: 'chefchaouen', names: ['chefchaouen', 'chaouen'] },
	{ slug: 'tangier', names: ['tangier', 'tanger'] },
	{ slug: 'casablanca', names: ['casablanca'] },
	{ slug: 'essaouira', names: ['essaouira'] },
	{ slug: 'agadir', names: ['agadir'] },
]

export type TourTag = { href: string; kind: 'city' | 'country'; name: string }

const words = (text: string) => ` ${text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ')} `

/**
 * Tags for a tour, in route order. `en` is the English tour (to recognise the
 * places), `local` the tour in the page's language (for the names shown).
 */
export function tourTags(en: any, local: any, locale: string): TourTag[] {
	const enDays: any[] = (en?.days ?? []).filter((d: any) => !d?.hidden)
	const localDays: any[] = (local?.days ?? []).filter((d: any) => !d?.hidden)
	const country = words(String(enDays[0]?.country ?? en?.startAddress?.country ?? ''))
	if (!country.includes(' morocco ')) return []
	const found = new Map<string, TourTag>()
	// Every listed city named in a text
	const citiesIn = (text: string) => {
		const w = words(text)
		return MOROCCO_CITIES.filter((city) => city.names.some((n) => w.includes(` ${n} `)))
	}
	const titleCase = (s: string) => s.replace(/(^|\s)[a-z]/g, (c) => c.toUpperCase())
	const add = (text: string, shown?: string) => {
		for (const city of citiesIn(text)) {
			if (found.has(city.slug)) continue
			found.set(city.slug, { href: `/${locale}/destinations/morocco/${city.slug}`, kind: 'city', name: (citiesIn(text).length === 1 && shown?.trim()) || titleCase(city.names[0]) })
		}
	}
	add(String(en?.startAddress?.city ?? ''), local?.startAddress?.city)
	enDays.forEach((day, i) => {
		// The day's city (named in the page's language), then places named in the day's title
		add(String(day?.city || day?.cityName || ''), localDays[i]?.city || localDays[i]?.cityName)
		add(String(day?.name ?? ''))
	})
	const tags = Array.from(found.values()).slice(0, 10)
	if (!tags.length) return tags
	const countryName = String(localDays[0]?.country || 'Morocco')
	return [...tags, { href: `/${locale}/destinations/morocco`, kind: 'country', name: countryName }]
}
