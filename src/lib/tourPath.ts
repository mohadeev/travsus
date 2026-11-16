// Repairs tour addresses that were saved without a country or city
// ("/en-US///tours/name/id") using the departure place named in the itinerary.
import { buildRoute, countrySlugFor } from '@/app/[locale]/[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/itinerary/route'

export function slugifyPlace(name: string) {
	return name
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}

/** English country and city slugs for the tour's departure. */
export function routePlaceSlugs(
	days: any[] | null | undefined,
	address?: { city?: string | null; country?: string | null } | null,
) {
	const start = buildRoute(Array.isArray(days) ? days : []).path[0]
	const country = (address?.country && slugifyPlace(address.country)) || (start ? countrySlugFor(start) : '')
	const city = (address?.city && slugifyPlace(address.city)) || (start ? slugifyPlace(start.name) : '')
	return { country, city }
}

/**
 * "/{locale}///tours/{name}/{id}" → "/{locale}/{country}/{city}/tours/{name}/{id}".
 * The category word already in the slug (tours, rutas, …) is kept.
 * A slug that already has both places is returned unchanged.
 */
export function repairTourSlug(slug: string, country?: string, city?: string) {
	if (!slug || !slug.includes('//') || !country || !city) return slug
	const parts = slug.split('/')
	// ['', locale, country, city, category, name, id]
	if (parts.length < 7 || (parts[2] && parts[3])) return slug
	parts[2] = country
	parts[3] = city
	return parts.join('/')
}

export function repairTourSlugs(
	slugs: { language: string; slug: string }[] | null | undefined,
	days: any[] | null | undefined,
	address?: { city?: string | null; country?: string | null } | null,
) {
	const place = routePlaceSlugs(days, address)
	return (slugs ?? []).map((entry) => ({
		...entry,
		slug: repairTourSlug(entry.slug, place.country, place.city),
	}))
}
