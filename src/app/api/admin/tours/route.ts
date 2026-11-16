// Creates (or updates) a complete tour in one call (admin only): its start/end
// address, photos (copied to Cloudinary, with their credit), days and stops,
// inclusions, prices, FAQ, and every language version with its own address.
// Used to publish tours written outside the editor (content/tours/new/*.json).
//
// POST { key, template?, address, tour, translations, slugs }
//   key: a stable name for the tour ("qatar-doha-city-tour"). Sending the same
//        key again updates that tour instead of creating a second one.
//   template: id of an existing tour whose owner (creatorId, businessId) is reused.
//   address: { city, state, country, timeZone, streetAddress, geoCoordinates: { lat, log } }
//   tour: the English tour (name, subtitle, overview, days, images, inclusions,
//         pricingTiers, faq, highlights, tags, seoTitle, metaDescription,
//         duration, durationType, bookingMode...)
//   translations: [{ language, name, subtitle?, overview, days: [{ name, description }], faq }]
//   slugs: [{ language, path }] where path is "/fr-FR/qatar/doha/tours/name" (the id is added)
// Images: { source (a public image URL), credit: { author, source, license }, alt? }.
// Allowed for the site owner's account, or with "Authorization: Bearer <CRON_SECRET>".
import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { db, T, must, touch, withMeta, newId, EMPTY_TOUR_LISTS } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { TOURS_TAG, refreshTourCache } from '@/lib/tourCatalog'
import { routing } from '@/i18n/routing'
import cloudinary from '@/utils/cloudinary'

export const dynamic = 'force-dynamic'

async function allowed(request: NextRequest) {
	const secret = process.env.CRON_SECRET
	if (secret && request.headers.get('authorization') === `Bearer ${secret}`) return true
	return isOwner()
}

type Photo = { source?: string; url?: string; public_id?: string; credit?: { author?: string; source?: string; license?: string }; alt?: string }

/** Copies a photo to Cloudinary once (kept when the same source was already uploaded). */
async function stored(photo: Photo, folder: string, known: Map<string, any>) {
	const source = photo.source || photo.url || ''
	if (!/^https:\/\//.test(source)) throw new Error(`Image without an https source: ${source}`)
	const done = known.get(source)
	if (done) return done
	const result = source.includes('res.cloudinary.com/')
		? { secure_url: source, public_id: photo.public_id ?? null }
		: await cloudinary.v2.uploader.upload(source, { folder, resource_type: 'image' })
	const image = { url: result.secure_url, public_id: result.public_id, source, credit: photo.credit ?? null, alt: photo.alt ?? null }
	known.set(source, image)
	return image
}

export async function POST(request: NextRequest) {
	if (!(await allowed(request))) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await request.json().catch(() => null)
	const key = typeof body?.key === 'string' ? body.key.trim() : ''
	const tour = body?.tour
	const address = body?.address
	const translations: any[] = Array.isArray(body?.translations) ? body.translations : []
	const slugs: any[] = Array.isArray(body?.slugs) ? body.slugs : []
	const locales = routing.locales as readonly string[]
	if (!key || !tour?.name || !Array.isArray(tour?.days) || !tour.days.length || !address?.city || !address?.country) {
		return NextResponse.json({ error: 'Send key, address (city, country) and tour (name, days)' }, { status: 400 })
	}
	if (translations.some((t) => !locales.includes(t?.language)) || slugs.some((s) => !locales.includes(s?.language) || !String(s?.path ?? '').startsWith(`/${s.language}/`))) {
		return NextResponse.json({ error: 'Each translation and slug needs a site language (and the slug path starts with it)' }, { status: 400 })
	}
	if (translations.some((t) => (t.days ?? []).length !== tour.days.length)) {
		return NextResponse.json({ error: `Every translation needs ${tour.days.length} days` }, { status: 400 })
	}

	try {
		const existing: any = must(await db.from(T.tours).select('id, images, days, startAddressId').eq('importKey', key).maybeSingle())
		const id: string = existing?.id ?? newId()
		const folder = `tours/${id}`

		// Photos already uploaded for this tour are reused (no duplicates on updates)
		const known = new Map<string, any>()
		for (const image of existing?.images ?? []) if (image?.source) known.set(image.source, image)
		for (const day of existing?.days ?? []) for (const stop of day?.stops ?? []) if (stop?.imageSource) known.set(stop.imageSource, { url: stop.image, public_id: stop.imagePublicId, source: stop.imageSource })

		const images = []
		for (const photo of (tour.images ?? []) as Photo[]) {
			const image = await stored(photo, folder, known)
			images.push({ url: image.url, public_id: image.public_id, source: image.source, credit: image.credit, alt: image.alt })
		}
		if (!images.length) return NextResponse.json({ error: 'Send at least one image' }, { status: 400 })

		const days = []
		for (const day of tour.days as any[]) {
			const stops = []
			for (const stop of (day.stops ?? []) as any[]) {
				const photo = stop.image ? await stored(stop.image, folder, known) : null
				stops.push({
					name: stop.name,
					description: stop.description ?? '',
					duration: stop.duration ?? '',
					image: photo?.url ?? null,
					imagePublicId: photo?.public_id ?? null,
					imageSource: photo?.source ?? null,
					imageAlt: stop.image?.alt ?? stop.name,
					imageCredit: stop.image?.credit ?? null,
				})
			}
			days.push({ name: day.name, description: day.description ?? '', cityName: address.city, cityId: null, hidden: false, ...(stops.length ? { stops } : {}) })
		}

		// One address for start and end (the traveller's hotel in that city)
		const addressRow = {
			city: address.city,
			state: address.state ?? null,
			country: address.country,
			timeZone: address.timeZone ?? null,
			streetAddress: address.streetAddress ?? 'Your hotel',
			geoCoordinates: address.geoCoordinates ?? null,
			isPrimary: null, notes: null, landmark: null, postalCode: null, subdivision: null, suiteNumber: null, postOfficeBox: null, buildingNumber: null,
		}
		let addressId: string = existing?.startAddressId
		if (addressId) must(await db.from(T.addresses).update(touch(addressRow)).eq('id', addressId))
		else addressId = must(await db.from(T.addresses).insert(withMeta(addressRow)).select('id').single()).id

		let owner = { creatorId: null as string | null, businessId: null as string | null }
		if (body.template) {
			const template: any = must(await db.from(T.tours).select('creatorId, businessId').eq('id', body.template).maybeSingle())
			if (template) owner = { creatorId: template.creatorId, businessId: template.businessId }
		}

		// Every language version; the stops (photos, places) are shared, their texts stay English
		const english = { language: 'en-US', name: tour.name, subtitle: tour.subtitle ?? '', overview: tour.overview ?? '', days: days.map((d) => ({ name: d.name, description: d.description, cityName: d.cityName, cityId: null, hidden: false })), faq: tour.faq ?? [] }
		const versions = [english, ...translations.filter((t) => t.language !== 'en-US').map((t) => ({
			language: t.language,
			name: t.name,
			subtitle: t.subtitle ?? '',
			overview: t.overview ?? '',
			days: (t.days as any[]).map((d) => ({ name: d.name, description: d.description ?? '', cityName: address.city, cityId: null, hidden: false })),
			faq: t.faq ?? [],
		}))]
		const tourSlugs = slugs.map((s) => ({ language: s.language, slug: `${String(s.path).replace(/\/+$/, '')}/${id}` }))

		const row = {
			importKey: key,
			name: tour.name,
			subtitle: tour.subtitle ?? '',
			overview: tour.overview ?? '',
			conclusion: '',
			lang: 'EN',
			seoTitle: tour.seoTitle ?? tour.name,
			metaDescription: tour.metaDescription ?? '',
			tags: tour.tags ?? [],
			highlights: (tour.highlights ?? []).map((name: string) => ({ name })),
			faq: tour.faq ?? [],
			images,
			days,
			inclusions: tour.inclusions ?? {},
			pricingTiers: tour.pricingTiers ?? [],
			accommodations: tour.accommodations ?? [],
			duration: tour.duration ?? days.length,
			durationType: tour.durationType ?? 'days',
			includesOvernight: !!tour.includesOvernight,
			bookingMode: tour.bookingMode === 'request' ? 'request' : 'instant',
			startAddressId: addressId,
			endAddressId: addressId,
			translations: versions,
			slugs: tourSlugs,
			updated: true,
		}

		if (existing) {
			must(await db.from(T.tours).update(touch(row)).eq('id', id))
		} else {
			must(await db.from(T.tours).insert(withMeta({ ...EMPTY_TOUR_LISTS, ...owner, ...row, id })))
		}
		revalidateTag(TOURS_TAG, { expire: 0 })
		refreshTourCache()
		return NextResponse.json({ ok: true, id, created: !existing, images: images.length, days: days.length, languages: versions.length, slugs: tourSlugs.map((s) => s.slug) })
	} catch (error: any) {
		console.error('Tour import failed:', error)
		return NextResponse.json({ error: error?.message || 'Could not save the tour' }, { status: 500 })
	}
}
